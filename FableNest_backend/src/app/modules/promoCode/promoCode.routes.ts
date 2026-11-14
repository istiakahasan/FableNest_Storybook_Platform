import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PromoCodeController } from "./promoCode.controller";
import { PromoCodeValidation } from "./promoCode.validation";
import { UserRole } from "@prisma/client";

const router = Router();

// Create a new promo code
router.post(
    "/add",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), // protect if only admins can create
    validateRequest(PromoCodeValidation.createPromoCodeSchema),
    PromoCodeController.createPromoCode
);
router.get(
    "/get-all",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    PromoCodeController.getAll
);

// Get promo code by ID
router.post(
    "/apply",
    auth(),
    PromoCodeController.applyPromoCode
);

router.get(
    "/details/:id",
    auth(),
    PromoCodeController.getPromoCodeById
);

// Update promo code
router.patch(
    "/update/:id",
    auth(),
    validateRequest(PromoCodeValidation.updatePromoCodeSchema),
    PromoCodeController.updatePromoCode
);

// Delete promo code
router.delete(
    "/delete/:id",
    auth(),
    PromoCodeController.deletePromoCode
);

// Activate promo code
router.patch(
    "/:id/activate",
    auth(),
    PromoCodeController.activatePromoCode
);

// Deactivate promo code
router.patch(
    "/:id/deactivate",
    auth(),
    PromoCodeController.deactivatePromoCode
);

export const PromoCodeRoutes = router;
