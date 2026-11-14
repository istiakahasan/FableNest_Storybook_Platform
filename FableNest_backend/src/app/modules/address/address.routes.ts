import { Router } from "express";
import { AddressController } from "./address.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AddressValidation } from "./address.validation";


const router = Router();

router.patch(
    "/update/:id",
    auth(),
    validateRequest(AddressValidation.update),
    AddressController.update,
);
router.delete(
    "/delete/:id",
    auth(),
    AddressController.delete,
);

export const AddressRoutes = router;