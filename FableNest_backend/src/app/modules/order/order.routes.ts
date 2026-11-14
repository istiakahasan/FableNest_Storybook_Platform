import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { OrderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { changeOrderStatus } from "./order.validation";

const router = Router();

router.get(
  "/admin/details/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.detailsAdmin,
);

router.get(
  "/get-all",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getAll,
);
router.post(
  "/change-status/:id",
  validateRequest(changeOrderStatus),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.changeOrderStatus,
);

router.get("/my-orders", auth(), OrderController.getMyOrder);

export const OrderRoutes = router;
