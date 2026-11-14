// src/modules/cart/cart.routes.ts
import { Router } from "express";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { CartValidations } from "./cart.validation";

const router = Router();

router.get("/get-cart", auth(UserRole.USER), CartController.getCart);

router.post(
    "/add",
    auth(UserRole.USER),
    validateRequest(CartValidations.addToCartSchema),
    CartController.addItem
);

router.post(
    "/remove",
    auth(UserRole.USER),
    validateRequest(CartValidations.removeFromCartSchema),
    CartController.removeQuantity
);

router.delete(
    "/delete-item/:id",
    auth(UserRole.USER),
    CartController.deleteItem
);

export const CartRoutes = router;
