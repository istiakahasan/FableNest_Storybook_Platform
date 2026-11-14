import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import { PrivacyPolicyService } from "./privacyPolicy.service";

export const PrivacyPolicyController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await PrivacyPolicyService.create(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Privacy Policy created successfully!",
      data: result,
    });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const result = await PrivacyPolicyService.getById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Privacy Policy fetched successfully!",
      data: result,
    });
  }),

  getAll: catchAsync(async (_req: Request, res: Response) => {
    const result = await PrivacyPolicyService.getAll();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All Privacy Policies fetched successfully!",
      data: result,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const result = await PrivacyPolicyService.update(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Privacy Policy updated successfully!",
      data: result,
    });
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const result = await PrivacyPolicyService.delete(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Privacy Policy deleted successfully!",
      data: result,
    });
  }),
  supportEmail: catchAsync(async (req: Request, res: Response) => {
    const result = await PrivacyPolicyService.supportEmail(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Your mail sent to support team!",
      data: result,
    });
  }),
};
