import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TermsConditionValidation } from "./terms&condition.validation";
import { TermsConditionController } from "./terms&condition.controller";


const router = Router();

router.post(
    "/add",
    auth(),
    validateRequest(TermsConditionValidation.createSchema),
    TermsConditionController.create
);

router.get("/get-all", auth(), TermsConditionController.getAll);

router.get("/:id", auth(), TermsConditionController.getById);

router.patch(
    "/update/:id",
    auth(),
    validateRequest(TermsConditionValidation.updateSchema),
    TermsConditionController.update
);

router.delete("/delete/:id", auth(), TermsConditionController.delete);

export const TermsConditionRoutes = router;
