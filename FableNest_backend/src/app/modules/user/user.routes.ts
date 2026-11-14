import { Router } from "express";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { parseBody } from "../../middlewares/parseBody";
import { uploadFile } from "../../helpers/uploadFile";
import { UserRole } from "@prisma/client";
const router = Router();


router.get("/get-all", auth(), UserController.getAll);

router.get(
  "/details/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.details
);

router.post(
  "/register",
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.register
); // ✅

router.post(
  "/add-admin",
  validateRequest(UserValidation.createAdminValidationSchema),
  UserController.addAdmin

)
router.patch(
  "/change-role/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.changeRoleValidation),
  UserController.changeRole
)

router.get(
  "/my-profile",
  auth(),
  UserController.myProfile
); // ✅

router.patch(
  "/update-profile",
  uploadFile.uploadProfileImage,
  parseBody,
  validateRequest(UserValidation.updateUserValidationSchema),
  auth(),
  UserController.updateProfile
);

router.patch(
  "/block-user/:userId",
  auth(),
  UserController.blockUser
);
router.patch(
  "/unblock-user/:userId",
  auth(),
  UserController.unblockUser
);
router.delete(
  "/delete-user/:userId",
  auth(),
  UserController.deleteUser
);


export const UserRoutes = router;
