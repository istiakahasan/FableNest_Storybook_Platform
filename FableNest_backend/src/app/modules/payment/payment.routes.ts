import express from "express";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Create payment (process order)
router.post(
  "/create",
  auth(UserRole.USER), // Only authenticated users
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentController.createPayment
);

// // Get specific order
// router.get(
//   "/orders/:orderId",
//   auth(UserRole.USER, UserRole.ADMIN),
//   PaymentController.getOrderById
// );

// // Get all user orders
// router.get(
//   "/orders",
//   auth(UserRole.USER, UserRole.ADMIN),
//   PaymentController.getUserOrders
// );

export const PaymentRoutes = router;