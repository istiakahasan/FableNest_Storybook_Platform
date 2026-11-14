import { Request, Response } from "express";
import status from "http-status";
import { FlipbookService } from "./flipbook.service";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import config from "../../../config";

export const FlipbookController = {
  // Upload PDF and create flipbook
  uploadAndCreate: catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    const { title, subtitle, description } = req.body;

    if (!file) {
      return sendResponse(res, {
        success: false,
        statusCode: status.BAD_REQUEST,
        message: "No PDF file uploaded!",
        data: null,
      });
    }

    // Construct the URL where the file will be accessible
    const pdfUrl = `${config.base_url}/uploads/${file.filename}`;

    const result = await FlipbookService.uploadAndCreateFlipbook(
      file,
      pdfUrl,
      title,
      subtitle,
      description
    );

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "PDF uploaded and flipbook created successfully!",
      data: result,
    });
  }),

  // Create flipbook from URL (Sync)
  createFromUrl: catchAsync(async (req: Request, res: Response) => {
    const { pdfUrl, title, subtitle, description } = req.body;
    
    const result = await FlipbookService.createFromUrl(
      pdfUrl,
      title,
      subtitle,
      description
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Flipbook created successfully from URL!",
      data: result,
    });
  }),

  // Create flipbook from URL (Async)
  createFromUrlAsync: catchAsync(async (req: Request, res: Response) => {
    const { pdfUrl, title, subtitle, description } = req.body;
    
    const result = await FlipbookService.createFromUrlAsync(
      pdfUrl,
      title,
      subtitle,
      description
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Flipbook creation started successfully!",
      data: result,
    });
  }),

  // Get all flipbooks
  getAllFlipbooks: catchAsync(async (req: Request, res: Response) => {
    const result = await FlipbookService.getAllFlipbooks();

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Flipbooks retrieved successfully!",
      data: result,
    });
  }),

  // Get flipbook by ID
  getFlipbookById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const result = await FlipbookService.getFlipbookById(id);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Flipbook retrieved successfully!",
      data: result,
    });
  }),

  // Delete flipbook
  deleteFlipbook: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const result = await FlipbookService.deleteFlipbook(id);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Flipbook deleted successfully!",
      data: result,
    });
  }),
};