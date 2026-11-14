import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { DashboardService } from "./dashboard.service";
import sendResponse from "../../helpers/sendResponse";
import status from "http-status"


export const dashboardController = {
    overview: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardService.overview(req.query);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Dashboard overview retrieved!",
            data: result,
        });
    }),
    allUsers: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardService.allUsers(req.query);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "All users retrieved!",
            meta: result.meta,
            stats: result.stats,
            data: result.data,
        });
    }),
    userDetails: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardService.userDetails(req.params.id);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "User Details retrieved!",
            data: result
        });
    }),


}