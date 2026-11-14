import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import status from "http-status";
import ApiError from "../../errors/ApiError";

const HEYZINE_CLIENT_ID = process.env.HEYZINE_CLIENT_ID || '';
const HEYZINE_API_KEY = process.env.HEYZINE_API_KEY || '';

interface HeyzineResponse {
  id: string;
  url: string;
  thumbnail: string;
  pdf: string;
  meta: {
    num_pages: number;
    aspect_ratio: number;
  };
  state?: string;
}

export const FlipbookService = {
  // Create flipbook from PDF URL (Sync)
  createFromUrl: async (
    pdfUrl: string,
    title?: string,
    subtitle?: string,
    description?: string
  ) => {
    try {
      const response = await axios.post<HeyzineResponse>(
        'https://heyzine.com/api1/rest',
        {
          pdf: pdfUrl,
          client_id: HEYZINE_CLIENT_ID,
          title: title,
          subtitle: subtitle,
          description: description,
          download: true,
          full_screen: true,
          share: true,
          prev_next: true,
          show_info: true
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        error.response?.data?.message || "Failed to create flipbook from URL"
      );
    }
  },

  // Create flipbook from PDF URL (Async)
  createFromUrlAsync: async (
    pdfUrl: string,
    title?: string,
    subtitle?: string,
    description?: string
  ) => {
    try {
      const response = await axios.post<HeyzineResponse>(
        'https://heyzine.com/api1/async',
        {
          pdf: pdfUrl,
          client_id: HEYZINE_CLIENT_ID,
          title: title,
          subtitle: subtitle,
          description: description,
          download: true,
          full_screen: true,
          share: true,
          prev_next: true,
          show_info: true
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        ...response.data,
        note: response.data.state === 'started' 
          ? 'Flipbook is being processed. Check back later.'
          : 'Flipbook is ready'
      };
    } catch (error: any) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        error.response?.data?.message || "Failed to create async flipbook"
      );
    }
  },

  // Upload PDF and create flipbook
  uploadAndCreateFlipbook: async (
    file: Express.Multer.File,
    pdfUrl: string,
    title?: string,
    subtitle?: string,
    description?: string
  ) => {
    try {
      const response = await axios.post<HeyzineResponse>(
        'https://heyzine.com/api1/rest',
        {
          pdf: pdfUrl,
          client_id: HEYZINE_CLIENT_ID,
          title: title || file.originalname,
          subtitle: subtitle,
          description: description,
          download: true,
          full_screen: true,
          share: true,
          prev_next: true,
          show_info: true
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return {
        uploadedFile: {
          originalName: file.originalname,
          size: file.size,
          path: pdfUrl
        },
        flipbook: response.data
      };
    } catch (error: any) {
      // Clean up uploaded file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        error.response?.data?.message || "Failed to upload and create flipbook"
      );
    }
  },

  // Get flipbook details by ID
  getFlipbookById: async (id: string) => {
    try {
      const response = await axios.post(
        'https://heyzine.com/api1/flipbook-details',
        { id },
        {
          headers: {
            'Authorization': `Bearer ${HEYZINE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new ApiError(status.NOT_FOUND, "Flipbook not found");
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        error.response?.data?.message || "Failed to fetch flipbook details"
      );
    }
  },

  // List all flipbooks
  getAllFlipbooks: async () => {
    try {
      const response = await axios.get(
        'https://heyzine.com/api1/flipbook-list',
        {
          headers: {
            'Authorization': `Bearer ${HEYZINE_API_KEY}`
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        error.response?.data?.message || "Failed to list flipbooks"
      );
    }
  },

  // Delete flipbook by ID
  deleteFlipbook: async (id: string) => {
    try {
      const response = await axios.post(
        'https://heyzine.com/api1/flipbook-delete',
        { id },
        {
          headers: {
            'Authorization': `Bearer ${HEYZINE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        error.response?.data?.message || "Failed to delete flipbook"
      );
    }
  }
};