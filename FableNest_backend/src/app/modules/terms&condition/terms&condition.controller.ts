import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import { TermsConditionService } from "./terms&condition.service";

export const TermsConditionController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await TermsConditionService.create(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Terms & Condition created successfully!",
      data: result,
    });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const result = await TermsConditionService.getById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Terms & Condition fetched successfully!",
      data: result,
    });
  }),

  getAll: catchAsync(async (_req: Request, res: Response) => {
    const result = await TermsConditionService.getAll();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All Terms & Conditions fetched successfully!",
      data: result,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const result = await TermsConditionService.update(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Terms & Condition updated successfully!",
      data: result,
    });
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const result = await TermsConditionService.delete(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Terms & Condition deleted successfully!",
      data: result,
    });
  }),
};
