// src/modules/cart/cart.controller.ts
import status from "http-status";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import { Request, Response } from "express";
import { CartService } from "./cart.service";

export const CartController = {
    // ➕ Add item or increase quantity
    addItem: catchAsync(async (req: Request, res: Response) => {
        const { bookId, qty } = req.body;
        const { id: userId } = req.user;
        const result = await CartService.addItem(userId, bookId, qty);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Item added to cart successfully!",
            data: result,
        });
    }),

    // ➖ Remove quantity (decrement or delete if zero)
    removeQuantity: catchAsync(async (req: Request, res: Response) => {
        const { cartItemId, qty } = req.body;
        const result = await CartService.removeQuantity(cartItemId, qty);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Cart item quantity updated successfully!",
            data: result,
        });
    }),

    // ❌ Delete cart item
    deleteItem: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await CartService.deleteItem(id);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Cart item deleted successfully!",
            data: result,
        });
    }),

    // 📦 Get full cart with items
    getCart: catchAsync(async (req: Request, res: Response) => {
        const { id: userId } = req.user;
        console.log("id",userId)
        const result = await CartService.myCart(userId);

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Cart retrieved successfully!",
            data: result,
        });
    }),
};
