import axios from "axios";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../helpers/s3";
import config from "../../../config";
import fs from "fs";
import path from "path";
import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status"
import FormData from "form-data";
import { BookPage } from "@prisma/client";
/**
 * Download image from a URL and upload it to S3
 */
export const uploadAiImageToS3 = async (imageUrl: string, folder = "book-pages", bookPageId: string) => {
  if (!imageUrl.startsWith("http")) {
    throw new Error("Invalid image URL");
  }

  // 1 Download the AI image as a buffer
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(response.data);

  // 2 Generate S3 key
  const fileKey = `${folder}/${bookPageId}.png`;

  // 3 Upload to S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.S3.bucketName!,
      Key: fileKey,
      Body: imageBuffer,
      ContentType: response.headers["content-type"] || "image/png",
      ACL: "public-read",
    })
  );

  // 4 Return public URL
  return `https://mycvconnect.s3.eu-north-1.amazonaws.com/${fileKey}`;
};

// accumulate prompts and story from diversified pages
export const accumulateStoryFromPages = (
  pages: BookPage[],
  storyTitle: string,
  promptString: string
) => {
  const story: Record<string, string> = {};
  const prompt: Record<string, string> = {};

  // 🔹 Force add page 0
  story["page 0"] = storyTitle;
  prompt["page 0"] = promptString;

  // 🔹 Sort pages safely (do not mutate original array)
  const sortedPages = [...pages].sort(
    (a, b) =>
      Number(a.name.split(" ")[1]) -
      Number(b.name.split(" ")[1])
  );

  for (const page of sortedPages) {
    // ⛔ Skip page 0 if it exists in DB to avoid overwrite
    if (page.name === "page 0") continue;

    story[page.name] = page.content;

    if (page.prompt) {
      prompt[page.name] = page.prompt;
    }
  }


  return { story, prompt };
};

// download image from s3
export const downloadImageAsStream = async (
  imageUrl: string,
  tempFileName: string = "temp_image.jpg"
): Promise<fs.ReadStream> => {
  const tempPath = path.resolve(__dirname, tempFileName);

  // Download the image
  const response = await axios.get(imageUrl, { responseType: "stream" });
  const writer = fs.createWriteStream(tempPath);
  response.data.pipe(writer);

  await new Promise<void>((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
  return fs.createReadStream(tempPath);
}

// organize form-data

export const prepareFormData = async (bookId: string, isCoverAdded?: string) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { pages: true }
  });

  if (!book) {
    throw new ApiError(status.NOT_FOUND, "Book not found!");
  }

  // reference_image_1 is required
  if (!book.reference_image_1) {
    throw new ApiError(status.BAD_REQUEST, "Book reference_image_1 URL is not available!");
  }

  const { story, prompt } = accumulateStoryFromPages(book.pages, book.title, book.coverImagePrompt as string);
  const formData = new FormData();

  // Add reference_image_1 (required)
  const stream1 = await downloadImageAsStream(book.reference_image_1);
  formData.append("reference_image_1", stream1);

  // Add additional reference images if available
  const optionalImages = [book.reference_image_2, book.reference_image_3];
  optionalImages.forEach(async (img, idx) => {
    if (img) {
      const stream = await downloadImageAsStream(img);
      formData.append(`reference_image_${idx + 2}`, stream); // reference_image_2, reference_image_3
    }
  });

  // Add story, prompt, page connections, and other info
  formData.append("story", JSON.stringify(story));
  formData.append("prompt", JSON.stringify(prompt));
  formData.append("page_connections", JSON.stringify(book.pageConnections || {}));
  formData.append("gender", book.gender || "male");
  formData.append("age", String(book.characterAge || 8));
  formData.append("image_style", book.style || "storybook");
  if (isCoverAdded) {
    formData.append("page_0_url", book.coverImageUrl);
    formData.append("page_1_url", book.pages[0].fullPageUrl);
  }
  return formData;
};