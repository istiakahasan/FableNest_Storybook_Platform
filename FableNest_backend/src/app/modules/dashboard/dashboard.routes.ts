import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();


router.get(
    "/overview",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    dashboardController.overview
);
router.get(
    "/all-users",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    dashboardController.allUsers
);
router.get(
    "/user/details/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    dashboardController.userDetails
);



export const DashboardRoutes = router;