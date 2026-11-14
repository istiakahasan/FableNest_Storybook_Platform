import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { AddressService } from "./address.service";
import status from "http-status"
import sendResponse from "../../helpers/sendResponse";

export const AddressController = {
    update: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = await AddressService.update(id, req.body,userId);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Address Updated!",
            data: result,
        });
    }),
    delete: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = await AddressService.delete(id,userId);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Address Deleted!",
            data: result,
        });
    }),
}