import { BooksApiResponseTypes } from "@/types/bookTypes";
import baseApi from "./baseApi";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/book/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Books"],
    }),

    createFirstTwoPages: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: {
          imageData: Array<{
            name: string;
            fullPageUrl: string;
            leftUrl: string | null;
            rightUrl: string | null;
          }>;
          pdfUrl: string;
        };
      },
      string
    >({
      query: (bookId) => ({
        url: `/book/create/rest-book/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ["Books"],
    }),

    regenerateBookCover: builder.mutation<any, any>({
      query: ({ bodyData, storyImage, id }) => ({
        url: `/book/regenerate/cover/${id}`,
        method: "POST",
        body: { bodyData, storyImage },
      }),
      invalidatesTags: ["Books"],
    }),

    regenerateCoverImage: builder.mutation<any, any>({
      query: (requestBody) => ({
        url: "/book/generateImagesFirst",
        method: "POST",
        body: requestBody,
      }),
      invalidatesTags: ["Books"],
    }),

    createBookPage: builder.mutation<any, any>({
      query: (id) => ({
        url: `/book/create-page/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Books"],
    }),

    getAllBook: builder.query<BooksApiResponseTypes, Record<string, string>>({
      query: (params) => ({
        url: `/book/get-all`,
        method: "GET",
        params,
      }),
      providesTags: ["Books"],
    }),

    createRestBook: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: {
          imageData: Array<{
            name: string;
            fullPageUrl: string;
            leftUrl: string | null;
            rightUrl: string | null;
          }>;
          pdfUrl: string;
        };
      },
      string
    >({
      query: (bookId) => ({
        url: `/book/create/rest-book/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ["Books"],
    }),

    regeneratePage: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: {
          bookId: string;
          pageName: string;
          fullPageUrl: string;
          leftUrl: string;
          rightUrl: string;
          pdfUrl: string;
        };
      },
      string
    >({
      query: (bookId) => ({
        url: `/book/${bookId}/regenerate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Books"],
    }),
  }),
});

export const {
  useGetAllBookQuery,
  useCreateBookMutation,
  useCreateBookPageMutation,
  useRegenerateBookCoverMutation,
  useRegenerateCoverImageMutation,
  useCreateFirstTwoPagesMutation,
  useCreateRestBookMutation,
  useRegeneratePageMutation,
} = bookApi;
