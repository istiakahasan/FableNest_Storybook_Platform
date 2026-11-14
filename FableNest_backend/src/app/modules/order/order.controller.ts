import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { OrderService } from "./order.service";
import sendResponse from "../../helpers/sendResponse";
import status from "http-status";

export const OrderController = {
  detailsAdmin: catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.detailsAdmin(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Order details retrieved!",
      data: result,
    });
  }),
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getAll(req.query);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All Orders retrieved!",
      meta: result.meta,
      data: result.data,
    });
  }),
  changeOrderStatus: catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.changeOrderStatus(
      req.params.id,
      req.body.orderStatus,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Order status changed!",
      data: result,
    });
  }),

  getMyOrder: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await OrderService.getMyOrder(userId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "My Orders Retrived",

      data: result,
    });
  }),
};
