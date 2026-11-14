import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import config from "../../../config";
import { createBookInput } from "./book.interface";
import { prepareFormData } from "./book.utils";
import axios from "axios";
import { UserRole } from "@prisma/client";
import QueryBuilder from "../../builder/QueryBuilder";

export const BookService = {
  createBook: async (
    payload: createBookInput,
    userId: string,
    reference_image_urls: string[],
  ) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(
        status.NOT_FOUND,
        "User not found while creating book content!",
      );
    }

    try {
      // generate content

      const response = await fetch(`${config.ai_base_url}/generate_story`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: payload.gender,
          name: payload.characterName,
          age: payload.characterAge,
          image_style: payload.style,
          language: payload.language,
          user_input: payload.user_input,
          image: reference_image_urls[0],
        }),
      });

      //  console.log(response, "generateFormData");

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
      }

      const aiResponse = await response.json();

      //  Normalize AI response (supports both formats)
      const normalizedData = aiResponse.data ?? aiResponse;
      console.log(normalizedData, "normalizedData");

      if (!normalizedData?.story || !normalizedData?.prompt) {
        throw new Error("Invalid AI response format");
      }

      const { story, prompt, page_connections } = normalizedData;

      const sortedPages = Object.keys(story).sort(
        (a, b) => Number(a.split(" ")[1]) - Number(b.split(" ")[1]),
      );
      // create book with book page
      const book = await prisma.book.create({
        data: {
          title: story["page 0"],
          characterName: payload.characterName,
          gender: payload.gender,
          characterAge: payload.characterAge,
          style: payload.style,
          language: payload.language,
          userId,
          reference_image_1: reference_image_urls[0],
          reference_image_2: reference_image_urls[1],
          reference_image_3: reference_image_urls[2],
          coverImagePrompt: prompt["page 0"],
          coverImageUrl: "PENDING",
          status: "DRAFT",
          pageConnections: page_connections || {},
          pages: {
            create: sortedPages
              .filter((pageKey) => pageKey !== "page 0")
              .map((pageKey) => ({
                content: story[pageKey],
                name: pageKey,
                prompt: prompt?.[pageKey] || null,
              })),
          },
        },
      });

      const formData = await prepareFormData(book.id);

      try {
        let response;
        // if role is user create only cover page and first page
        if (user.role === UserRole.USER) {
          response = await axios.post(
            `${config.ai_base_url}/generate_images_first?sequential=yes`,
            formData,
            {
              headers: {
                ...formData.getHeaders(),
                accept: "application/json",
              },
              timeout: 5000000,
            },
          );
          const page0 = response.data.image_urls.find(
            (page: any) => page.name === "page 0",
          );
          const page1 = response.data.image_urls.find(
            (page: any) => page.name === "page 1",
          );

          await prisma.$transaction([
            // 1.Update the book cover
            prisma.book.update({
              where: { id: book.id },
              data: {
                coverImageUrl: page0.fullPageUrl,
              },
            }),

            // 2.Update the first BookPage with page 1 info
            prisma.bookPage.updateMany({
              where: {
                bookId: book.id,
                name: "page 1",
              },
              data: {
                fullPageUrl: page1.fullPageUrl,
                leftUrl: page1.leftUrl,
                rightUrl: page1.rightUrl,
              },
            }),
          ]);
        } else {
          // if role is not USER, create fullBook with coverPage
          response = await axios.post(
            `${config.ai_base_url}/generate_images_full?coverpage=no&sequential=yes`,
            formData,
            {
              headers: {
                ...formData.getHeaders(),
                accept: "application/json",
              },
              timeout: 6000000,
            },
          );

          //  Normalize the response structure
          const imageData = response.data.image_urls || response.data;
          const pdfUrl = response.data.pdf_url || response.data;

          //   console.log("Full response received with", imageData.length, "pages");
          console.log("Full response received with", imageData, "pages");

          if (!Array.isArray(imageData)) {
            throw new Error(
              "Invalid response format: expected array of images",
            );
          }

          // Find cover page and book pages
          const coverPage = imageData.find((p: any) => p.name === "page 0");
          const bookPages = imageData.filter(
            (p: any) => p.name !== "page 0" && p.name !== "page 12",
          );
          const colorPage = imageData.find((p: any) => p.name === "page 12");

          console.log("Cover page found:", !!coverPage);
          console.log("Book pages to update:", bookPages);
          console.log("Color pages to update:", colorPage);
          console.log("PdfUrl:", pdfUrl);

          // UPDATE: Use separate transactions with smaller batches to avoid timeout

          // 1. Update cover page first (separate transaction)
          if (coverPage?.fullPageUrl) {
            try {
              await prisma.book.update({
                where: { id: book.id },
                data: {
                  coverImageUrl: coverPage.fullPageUrl,
                  pdfUrl,
                },
              });
              console.log("Cover page updated successfully");
            } catch (error) {
              console.error("Failed to update cover page:", error);
            }
          }

          if (colorPage?.leftUrl && colorPage?.rightUrl) {
            try {
              // update page 12
              await prisma.bookPage.updateMany({
                where: { bookId: book.id, name: "page 12" },
                data: { fullPageUrl: colorPage.leftUrl },
              });

              // update page 13
              await prisma.bookPage.updateMany({
                where: { bookId: book.id, name: "page 13" },
                data: { fullPageUrl: colorPage.rightUrl },
              });

              console.log("Color pages updated successfully");
            } catch (error) {
              console.error("Failed to update color pages:", error);
            }
          }

          // 2. Update book pages in batches (avoid long transactions)
          if (bookPages.length > 0) {
            const BATCH_SIZE = 3; // Update 3 pages at a time
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < bookPages.length; i += BATCH_SIZE) {
              const batch = bookPages.slice(i, i + BATCH_SIZE);

              try {
                // Process batch in a short transaction
                await prisma.$transaction(
                  async (tx) => {
                    for (const page of batch) {
                      if (page.fullPageUrl) {
                        const updateResult = await tx.bookPage.updateMany({
                          where: {
                            bookId: book.id,
                            name: page.name,
                          },
                          data: {
                            fullPageUrl: page.fullPageUrl,
                            leftUrl: page.leftUrl || null,
                            rightUrl: page.rightUrl || null,
                          },
                        });

                        if (updateResult.count > 0) {
                          successCount++;
                        } else {
                          failCount++;
                          console.warn(
                            `⚠️ Page ${page.name} not found in database`,
                          );
                        }
                      }
                    }
                  },
                  {
                    maxWait: 10000, // 10 seconds max wait
                    timeout: 30000, // 30 seconds timeout
                  },
                );

                console.log(
                  ` Batch ${Math.floor(i / BATCH_SIZE) + 1} completed`,
                );
              } catch (error) {
                console.error(
                  `Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`,
                  error,
                );
                failCount += batch.length;
              }
            }

            console.log(
              ` Update complete: ${successCount} succeeded, ${failCount} failed out of ${bookPages.length} pages`,
            );
          }
        }
      } catch (error) {
        console.error("Error generating images:", error);
        throw error;
      }

      const updatedBook = await prisma.book.findUnique({
        where: {
          id: book.id,
        },
        select: {
          id: true,
          title: true,
          characterName: true,
          characterAge: true,
          gender: true,
          coverImageUrl: true,
          pages: {
            where: { name: "page 1" },
            select: {
              id: true,
              name: true,
              fullPageUrl: true,
              leftUrl: true,
              rightUrl: true,
              content: true,
            },
          },
          reference_image_1: true,

          language: true,
          style: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        ...updatedBook,
        firstPage: updatedBook?.pages?.[0] || null,
        pages: undefined,
        // totalPage:
      };
    } catch (error) {
      console.error("Error generating story:", error);
      throw error;
    }
  },

  createRestBook: async (bookId: string) => {
    const formData = await prepareFormData(bookId, "yes");
    let response;

    // if role is not USER, create fullBook with coverPage
    response = await axios.post(
      // `${config.ai_base_url}/generate_images_full?coverpage=yes&sequential=yes`,
      `${config.ai_base_url}/generate-images-batch?coverpage=yes&sequential=yes`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          accept: "application/json",
        },
        timeout: 6000000,
      },
    );

    //  Normalize the response structure
    const imageData = response.data.image_urls || response.data;

    console.log("==================================");
    console.log("response.data", response.data);

    const pdfUrl = response.data.pdf_url || response.data;
    console.log("pdfUrl", pdfUrl);
    console.log("Full response received with", imageData.length, "pages");

    if (!Array.isArray(imageData)) {
      throw new Error("Invalid response format: expected array of images");
    }

    // Find cover page and book pages
    const coverPage = imageData.find((p: any) => p.name === "page 0");
    const bookPages = imageData.filter(
      (p: any) => p.name !== "page 0" && p.name !== "page 12",
    );
    const colorPage = imageData.find((p: any) => p.name === "page 12");

    if (pdfUrl) {
      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          pdfUrl,
        },
      });
    }
    // 1. Update cover page first (separate transaction)
    if (coverPage?.fullPageUrl) {
      try {
        await prisma.book.update({
          where: { id: bookId },
          data: {
            coverImageUrl: coverPage.fullPageUrl,
            pdfUrl,
          },
        });
        console.log("Cover page updated successfully");
      } catch (error) {
        console.error("Failed to update cover page:", error);
      }
    }

    if (colorPage?.leftUrl && colorPage?.rightUrl) {
      try {
        // update page 12
        await prisma.bookPage.updateMany({
          where: { bookId, name: "page 12" },
          data: { fullPageUrl: colorPage.leftUrl },
        });

        // update page 13
        await prisma.bookPage.updateMany({
          where: { bookId, name: "page 13" },
          data: { fullPageUrl: colorPage.rightUrl },
        });

        console.log("Color pages updated successfully");
      } catch (error) {
        console.error("Failed to update color pages:", error);
      }
    }

    if (bookPages.length > 0) {
      const BATCH_SIZE = 3; // Update 3 pages at a time
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < bookPages.length; i += BATCH_SIZE) {
        const batch = bookPages.slice(i, i + BATCH_SIZE);

        try {
          // Process batch in a short transaction
          await prisma.$transaction(
            async (tx) => {
              for (const page of batch) {
                if (page.fullPageUrl) {
                  const updateResult = await tx.bookPage.updateMany({
                    where: {
                      bookId,
                      name: page.name,
                    },
                    data: {
                      fullPageUrl: page.fullPageUrl,
                      leftUrl: page.leftUrl || null,
                      rightUrl: page.rightUrl || null,
                    },
                  });

                  if (updateResult.count > 0) {
                    successCount++;
                  } else {
                    failCount++;
                    console.warn(`⚠️ Page ${page.name} not found in database`);
                  }
                }
              }
            },
            {
              maxWait: 10000, // 10 seconds max wait
              timeout: 30000, // 30 seconds timeout
            },
          );

          console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed`);
        } catch (error) {
          console.error(
            `Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`,
            error,
          );
          failCount += batch.length;
        }
      }

      console.log(
        `Update complete: ${successCount} succeeded, ${failCount} failed out of ${bookPages.length} pages`,
      );
    }
    return {
      imageData,
      pdfUrl,
    };
  },

  getAllBooks: async (query: Record<string, unknown>) => {
    if (query.characterAge) {
      query.characterAge = Number(query.characterAge);
    }
    // const bookQuery = new QueryBuilder(prisma.book, query)
    const bookQuery = new QueryBuilder(prisma.book, {
      ...query,
      status: "PUBLISHED",
    })
      .search(["title", "characterName"])
      .filter()
      .paginate()
      .select({
        id: true,
        title: true,
        characterName: true,
        coverImageUrl: true,
        characterAge: true,
        gender: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      });

    const [data, meta] = await Promise.all([
      bookQuery.execute(),
      bookQuery.countTotal(),
    ]);

    return {
      data,
      meta,
    };
  },

  publishBook: async (bookId: string, userId: string, role: UserRole) => {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, userId: true, status: true, pdfUrl: true },
    });

    if (!book) {
      throw new ApiError(status.NOT_FOUND, "Book not found");
    }

    if (role === UserRole.USER && book.userId !== userId) {
      throw new ApiError(status.FORBIDDEN, "Not allowed to publish this book");
    }

    if (book.status === "PUBLISHED") {
      return prisma.book.findUnique({ where: { id: bookId } });
    }

    if (!book.pdfUrl) {
      await BookService.createRestBook(bookId);
    }

    const publishedBook = await prisma.book.update({
      where: { id: bookId },
      data: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        characterName: true,
        coverImageUrl: true,
        pdfUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return publishedBook;
  },

  // regenerateBook: async (bookId: string, pageName: string) => {
  //   if (!pageName) {
  //     throw new ApiError(status.BAD_REQUEST, "Page Name is required");
  //   }

  //   const book = await prisma.book.findUnique({
  //     where: {
  //       id: bookId,
  //     },
  //     select: {
  //       id: true,
  //       gender: true,
  //       characterAge: true,
  //       style: true,
  //       pdfUrl: true,
  //       title: true,
  //       coverImageUrl: true,
  //       coverImagePrompt: true,
  //       pages: {
  //         where: { name: pageName },
  //         select: {
  //           id: true,
  //           name: true,
  //           prompt: true,
  //           content: true,
  //           fullPageUrl: true,
  //           leftUrl: true,
  //           rightUrl: true,
  //         },
  //       },
  //     },
  //   });

  //   console.log(book?.pages?.[0]);

  //   // =============== book response
  //   //     {
  //   //   id: '696b0cecee6fac5f118c21c8',
  //   //   name: 'page 4',
  //   //   prompt: 'The main character Polash, still dressed in his red t-shirt and blue jeans, stands in the garden waving his hands frantically in front of his face, trying to push away the thick, stinky green mist. His nose is wrinkled and his eyes are squeezed shut. The flowers in the background look wilted, and the area is filled with animated stink lines. The mood is humorous and a bit frantic. Maintain exact facial features, eyebrows, hair style, and overall character appearance. No changes to face structure, eye shape, or hair color.',
  //   //   content: 'Polash coughed and waved his hands, trying to get rid of the horrible stink.',
  //   //   fullPageUrl: 'https://mycvconnect.s3.eu-north-1.amazonaws.com/facetoon/3158f7bb-f0e6-4b66-b10c-1a94ce5a8ae6/full/image_4.png',
  //   //   leftUrl: 'https://mycvconnect.s3.eu-north-1.amazonaws.com/facetoon/3158f7bb-f0e6-4b66-b10c-1a94ce5a8ae6/splitted/page_7.png',
  //   //   rightUrl: 'https://mycvconnect.s3.eu-north-1.amazonaws.com/facetoon/3158f7bb-f0e6-4b66-b10c-1a94ce5a8ae6/splitted/page_8.png'
  //   // }

  //   if (!book) {
  //     throw new ApiError(status.NOT_FOUND, "Book Not Found ");
  //   }

  //   const isCoverPage = pageName === "page 0";

  //   let promptForAI = "";
  //   let storyForAI = "";
  //   let imageUrlForAI = "";

  //   if (isCoverPage) {
  //     // ✅ cover info Book model theke nibo
  //     promptForAI = book.coverImagePrompt || "";
  //     storyForAI = book.title || "";
  //     imageUrlForAI = book.coverImageUrl || "";
  //   } else {
  //     const targetPage = book.pages?.[0];

  //     if (!targetPage) {
  //       throw new ApiError(
  //         status.NOT_FOUND,
  //         `${pageName} not found in this book`
  //       );
  //     }

  //     promptForAI = targetPage.prompt;
  //     storyForAI = targetPage.content;
  //     imageUrlForAI = targetPage.fullPageUrl || "";
  //   }

  //   // need to send body like this
  //   // prompt :
  //   //  story :
  //   //   iamge_url": "https://mycvconnect.s3.eu-north-1.amazonaws.com/facetoon/c6b16198-0bb4-405c-bf32-0178400b159c/full/image_1.png",
  //   // "gender": "male",
  //   // "age": 8,
  //   // "image_style": "Pixar3d",
  //   // "page_type": "normal",
  //   // "page_number": 1,
  //   // "pdf_url":"https://mycvconnect.s3.eu-north-1.amazonaws.com/facetoon/c6b16198-0bb4-405c-bf32-0178400b159c/book_20260114_064620_6593adec.pdf"

  //   const data = {
  //     prompt: promptForAI,
  //     story: storyForAI,
  //     iamge_url: imageUrlForAI,
  //     // iamge_url: targetPage?.fullPageUrl,
  //     gender: book?.gender,
  //     age: book?.characterAge,
  //     image_style: book?.style,
  //     pdf_url: book.pdfUrl,
  //     page_type: isCoverPage ? "cover" : "normal",
  //     page_number: Number(pageName.split(" ")[1]),
  //   };

  //   console.log(data,'ai body')

  //   try {
  //     // const res = await axios.post(
  //     //   `${config.ai_base_url}/regenerate_image`,
  //     //   {},
  //     // );
  //   } catch (error) {}
  // },

  regenerateBook: async (bookId: string, pageName: string) => {
    if (!pageName) {
      throw new ApiError(status.BAD_REQUEST, "Page Name is required");
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        gender: true,
        characterAge: true,
        style: true,
        pdfUrl: true,
        title: true,
        coverImageUrl: true,
        coverImagePrompt: true,
        pages: {
          where: { name: pageName },
          select: {
            id: true,
            name: true,
            prompt: true,
            content: true,
            fullPageUrl: true,
            leftUrl: true,
            rightUrl: true,
          },
        },
      },
    });

    if (!book) {
      throw new ApiError(status.NOT_FOUND, "Book Not Found");
    }

    const isCoverPage = pageName === "page 0";

    let promptForAI = "";
    let storyForAI = "";
    let imageUrlForAI = "";

    if (isCoverPage) {
      promptForAI = book.coverImagePrompt || "";
      storyForAI = book.title || "";
      imageUrlForAI = book.coverImageUrl || "";
    } else {
      const targetPage = book.pages?.[0];

      if (!targetPage) {
        throw new ApiError(
          status.NOT_FOUND,
          `${pageName} not found in this book`,
        );
      }

      promptForAI = targetPage.prompt || "";
      storyForAI = targetPage.content || "";
      imageUrlForAI = targetPage.fullPageUrl || "";
    }

    const pageNumber = Number(pageName.split(" ")[1]);

    if (Number.isNaN(pageNumber)) {
      throw new ApiError(status.BAD_REQUEST, "Invalid pageName format");
    }

    const aiBody = {
      prompt: promptForAI,
      story: storyForAI,
      iamge_url: imageUrlForAI,
      gender: book.gender,
      age: book.characterAge,
      image_style: book.style,
      page_type: isCoverPage ? "cover" : "normal",
      page_number: pageNumber,
      pdf_url: book.pdfUrl,
    };

    let res;
    try {
      res = await axios.post(`${config.ai_base_url}/regenerate_image`, aiBody, {
        headers: { accept: "application/json" },
        timeout: 6000000,
      });
    } catch (error) {
      console.error("AI regenerate error:", error);
      throw new ApiError(status.BAD_REQUEST, "Failed to regenerate image");
    }

    const regenerated = res.data?.image_url?.[0];
    const newPdfUrl = res.data?.pdf_url || null;

    if (!regenerated?.fullPageUrl) {
      throw new ApiError(status.BAD_REQUEST, "Invalid AI regenerate response");
    }

    if (newPdfUrl) {
      await prisma.book.update({
        where: { id: bookId },
        data: { pdfUrl: newPdfUrl },
      });
    }

    if (isCoverPage) {
      await prisma.book.update({
        where: { id: bookId },
        data: {
          coverImageUrl: regenerated.fullPageUrl,
        },
      });

      return {
        bookId,
        pageName,
        coverImageUrl: regenerated.fullPageUrl,
        pdfUrl: newPdfUrl || book.pdfUrl,
      };
    }

    // update the new data in the book page collectoin
    await prisma.bookPage.updateMany({
      where: { bookId, name: pageName },
      data: {
        fullPageUrl: regenerated.fullPageUrl,
        leftUrl: regenerated.leftUrl ?? null,
        rightUrl: regenerated.rightUrl ?? null,
      },
    });

    return {
      bookId,
      pageName,
      fullPageUrl: regenerated.fullPageUrl,
      leftUrl: regenerated.leftUrl ?? null,
      rightUrl: regenerated.rightUrl ?? null,
      pdfUrl: newPdfUrl || book.pdfUrl,
    };
  },

  // single book

  getSingleBook: async (bookId: string) => {
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
        title: true,
        characterName: true,
        coverImageUrl: true,
        coverImagePrompt: true,
        pages: {
          select: {
            id: true,
            name: true,
            prompt: true,
            content: true,
            fullPageUrl: true,
            leftUrl: true,
            rightUrl: true,
          },
        },
      },
    });

    if (!book) {
      throw new ApiError(status.NOT_FOUND, "Book not found");
    }

    const coverPage = {
      id: "page_0",
      name: "page 0",
      content: book.title,
      prompt: null,
      fullPageUrl: book.coverImageUrl,
      leftUrl: null,
      rightUrl: null,
    };

    const pages = [coverPage, ...book.pages];

    return { ...book, pages };
  },

  // auto generate book
  getAutoGeneratedDraftBooks: async () => {
    return prisma.book.findMany({
      where: {
        isAutoGenerated: true,
        status: "DRAFT",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        characterName: true,
        coverImageUrl: true,
        createdAt: true,
      },
    });
  },

  toggleAutoGenerate: async (isEnabled: boolean) => {
    let setting = await prisma.autoGenerateSetting.findFirst();

    if (!setting) {
      return prisma.autoGenerateSetting.create({
        data: { isEnabled },
      });
    }

    return prisma.autoGenerateSetting.update({
      where: { id: setting.id },
      data: { isEnabled },
    });
  },

  reviewAutoGeneratedBook: async (bookId: string) => {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        characterName: true,
        characterAge: true,
        gender: true,
        language: true,
        style: true,
        coverImageUrl: true,
        pdfUrl: true,
        status: true,
        isAutoGenerated: true,
        createdAt: true,
        updatedAt: true,
        pages: {
          select: {
            id: true,
            name: true,
            content: true,
            prompt: true,
            fullPageUrl: true,
            leftUrl: true,
            rightUrl: true,
          },
        },
      },
    });

    if (!book) throw new ApiError(status.NOT_FOUND, "Book Not Found");
    if (!book.isAutoGenerated)
      throw new ApiError(status.BAD_REQUEST, "This book is not auto generated");

    const coverPage = {
      id: "page_0",
      name: "page 0",
      content: book.title,
      prompt: null,
      fullPageUrl: book.coverImageUrl,
      leftUrl: null,
      rightUrl: null,
    };

    // const normalizedPages = book.pages.map((p) => {
    //   if (p.name === "page last page") {
    //     return { ...p, name: "page 14" };
    //   }
    //   return p;
    // });

    const filteredPages = book.pages.filter((p) => p.name !== "page last page");

    const sortedPages = filteredPages.sort((a, b) => {
      const an = Number(a.name.split(" ")[1]);
      const bn = Number(b.name.split(" ")[1]);
      return an - bn;
    });

    return {
      ...book,
      pages: [coverPage, ...sortedPages],
    };
  },
};
