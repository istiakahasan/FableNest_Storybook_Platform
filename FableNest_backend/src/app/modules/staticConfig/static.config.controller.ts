import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import status from "http-status";
import { StaticConfigService } from "./static.config.service";
export const PricingConfigController = {
    getConfig: catchAsync(async (req: Request, res: Response) => {
        const result = await StaticConfigService.getStaticConfig();
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Pricing config retrieved!",
            data: result,
        });
    }),
    changeShippingFee: catchAsync(async (req: Request, res: Response) => {
        const result = await StaticConfigService.changeShippingFee(req.body.healthPlanFee);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Shipping Fee changed!",
            data: result,
        });
    }),
    changeBookPrice: catchAsync(async (req: Request, res: Response) => {
        const result = await StaticConfigService.changeBookPrice(req.body.bookingFee);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Book Price changed!",
            data: result,
        });
    }),
    changeSupportEmail: catchAsync(async (req: Request, res: Response) => {
        const result = await StaticConfigService.changeSupportEmail(req.body.supportEmail);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Support email Changed!",
            data: result,
        });
    }),
}