import { Request, Response } from "express";

import status from "http-status";
import { PaymentService } from "./payment.service";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming auth middleware sets req.user
    const data = req.body;
    const result = await PaymentService.createPayment(userId, data);
    sendResponse(res, {
        success: result.success,
        statusCode: result.success ? status.OK : status.PAYMENT_REQUIRED,
        message: result.message,
        data: result,
    });
});

// const getOrderById = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   const { orderId } = req.params;

//   const result = await PaymentService.getOrderById(userId, orderId);

//   sendResponse(res, {
//     success: true,
//     statusCode: status.OK,
//     message: "Order retrieved successfully",
//     data: result,
//   });
// });

// const getUserOrders = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id;

//   const result = await PaymentService.getUserOrders(userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: status.OK,
//     message: "Orders retrieved successfully",
//     data: result,
//   });
// });

export const PaymentController = {
    createPayment,
    //   getOrderById,
    //   getUserOrders,
};