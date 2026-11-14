import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PrivacyPolicyValidation } from "./privacyPolicy.validation";
import { PrivacyPolicyController } from "./privacyPolicy.controller";

const router = Router();

router.post(
  "/add",
  auth(),
  validateRequest(PrivacyPolicyValidation.createSchema),
  PrivacyPolicyController.create
);

router.get("/get-all", auth(), PrivacyPolicyController.getAll);

router.get("/:id", auth(), PrivacyPolicyController.getById);

router.patch(
  "/update/:id",
  auth(),
  validateRequest(PrivacyPolicyValidation.updateSchema),
  PrivacyPolicyController.update
);

router.delete("/delete/:id", auth(), PrivacyPolicyController.delete);

router.post(
  "/send-support-mail",
  PrivacyPolicyController.supportEmail
)

export const PrivacyPolicyRoutes = router;
