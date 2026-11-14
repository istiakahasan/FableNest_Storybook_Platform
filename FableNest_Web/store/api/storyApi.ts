import baseApi from "./baseApi";

/* =====================
   Request / Response Types
===================== */

export interface GenerateStoryRequest {
  gender: string;
  name: string;
  age: number;
  image_style: string;
  language: string;
  user_input: string;
}

export interface GenerateStoryResponse {
  story: {
    [key: string]: string; // "page 0": "title", "page 1": "story text", etc.
  };
  prompt: {
    [key: string]: string; // "page 0": "prompt text", etc.
  };
  page_connections: {
    [key: string]: string; // "page 2": "page 1", etc.
  };
}

export interface GenerateImagesFirstRequest {
  reference_image: File;
  story: string; // JSON stringified
  prompt: string; // JSON stringified
  page_connections: string; // JSON stringified
  gender: string;
  age: number;
  image_style: string;
  sequential?: "yes" | "no";
}

export interface GenerateImagesFirstResponse {
  image_urls: {
    "page 0": string;
    "page 1": string;
  };
}

export interface GenerateImagesFullRequest {
  reference_image: File;
  story: string; // JSON stringified
  prompt: string; // JSON stringified
  page_connections: string; // JSON stringified
  gender: string;
  age: number;
  image_style: string;
  page_1_url: string;
  coverpage?: "yes" | "no";
  sequential?: "yes" | "no";
}

export interface GenerateImagesFullResponse {
  image_urls: {
    [key: string]: string; // "page 1": "url", "page 2": "url", etc.
  };
}

/* =====================
   API Endpoints
===================== */

// External API base URL for story generation
const STORY_API_BASE_URL = "http://77.37.125.90:8000/api/v1";

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate Story
    generateStory: builder.mutation<GenerateStoryResponse, GenerateStoryRequest>({
      queryFn: async (body) => {
        try {
          const response = await fetch(`${STORY_API_BASE_URL}/generate_story`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const error = await response.json();
            return { error: { status: response.status, data: error } };
          }

          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),

    // Generate First Two Pages
    generateImagesFirst: builder.mutation<
      GenerateImagesFirstResponse,
      GenerateImagesFirstRequest
    >({
      queryFn: async (body) => {
        try {
          const formData = new FormData();
          formData.append("reference_image", body.reference_image);
          formData.append("story", body.story);
          formData.append("prompt", body.prompt);
          formData.append("page_connections", body.page_connections);
          formData.append("gender", body.gender);
          formData.append("age", body.age.toString());
          formData.append("image_style", body.image_style);

          const sequential = body.sequential || "yes";
          const url = `${STORY_API_BASE_URL}/generate_images_first?sequential=${sequential}`;

          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            return { error: { status: response.status, data: error } };
          }

          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),

    // Generate Full Book
    generateImagesFull: builder.mutation<
      GenerateImagesFullResponse,
      GenerateImagesFullRequest
    >({
      queryFn: async (body) => {
        try {
          const formData = new FormData();
          formData.append("reference_image", body.reference_image);
          formData.append("story", body.story);
          formData.append("prompt", body.prompt);
          formData.append("page_connections", body.page_connections);
          formData.append("gender", body.gender);
          formData.append("age", body.age.toString());
          formData.append("image_style", body.image_style);
          formData.append("page_1_url", body.page_1_url);

          const coverpage = body.coverpage || "yes";
          const sequential = body.sequential || "yes";
          const url = `${STORY_API_BASE_URL}/generate_images_full?coverpage=${coverpage}&sequential=${sequential}`;

          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            return { error: { status: response.status, data: error } };
          }

          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),
  }),
});

export const {
  useGenerateStoryMutation,
  useGenerateImagesFirstMutation,
  useGenerateImagesFullMutation,
} = storyApi;

