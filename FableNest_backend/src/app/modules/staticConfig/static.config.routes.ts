import { Router } from "express";
import { PricingConfigController } from "./static.config.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { StaticConfigValidations } from "./static.config.validations";


const router = Router();

router.get(
    "/get-config",
    auth(UserRole.ADMIN),
    PricingConfigController.getConfig
);
router.patch(
    "/change/shipping-cost",
    auth(UserRole.ADMIN),
    validateRequest(StaticConfigValidations.changeHealthPlanFee),
    PricingConfigController.changeShippingFee
);
router.patch(
    "/change/book-price",
    auth(UserRole.ADMIN),
    validateRequest(StaticConfigValidations.changeBookingFee),
    PricingConfigController.changeBookPrice
);
router.patch(
    "/change/support-email",
    auth(UserRole.ADMIN),
    validateRequest(StaticConfigValidations.changeSupportEmail),
    PricingConfigController.changeBookPrice
);

export const StaticConfigRoutes = router;