import status from "http-status";
import { PromoCodeService } from "./promoCode.service";
import catchAsync from "../../helpers/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../helpers/sendResponse";

export const PromoCodeController = {
    createPromoCode: catchAsync(async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await PromoCodeService.createPromoCode(payload);

        sendResponse(res, {
            success: true,
            statusCode: status.CREATED,
            message: "Promo code created successfully!",
            data: result,
        });
    }),
    getAll: catchAsync(async (req: Request, res: Response) => {
        const result = await PromoCodeService.getAll();
        sendResponse(res, {
            success: true,
            statusCode: status.CREATED,
            message: "All Promo code added successfully!",
            data: result,
        });
    }),

    applyPromoCode: catchAsync(async (req: Request, res: Response) => {
        const result = await PromoCodeService.applyPromoCode(req.body);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Promo code applied successfully!",
            data: result,
        });
    }),

    getPromoCodeById: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await PromoCodeService.getPromoCodeById(id);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Promo code retrieved successfully!",
            data: result,
        });
    }),

    updatePromoCode: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const result = await PromoCodeService.updatePromoCode(id, data);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Promo code updated successfully!",
            data: result,
        });
    }),

    deletePromoCode: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await PromoCodeService.deletePromoCode(id);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Promo code deleted successfully!",
            data: result,
        });
    }),

    activatePromoCode: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await PromoCodeService.activatePromoCode(id);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: result.message,
            data: result.promo,
        });
    }),

    deactivatePromoCode: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await PromoCodeService.deactivatePromoCode(id);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: result.message,
            data: result.promo,
        });
    }),
};
