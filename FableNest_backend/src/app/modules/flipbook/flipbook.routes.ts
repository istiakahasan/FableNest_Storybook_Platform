import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FlipbookController } from "./flipbook.controller";
import { flipBookUpload } from "./flipbook.heplper";
import { FlipbookValidation } from "./flipbook.validation";


const router = Router();



// Upload PDF and create flipbook
router.post(
    "/upload",
    flipBookUpload.single('pdf'),
    validateRequest(FlipbookValidation.uploadAndCreateValidationSchema),
    FlipbookController.uploadAndCreate
);

// Create flipbook from URL (Sync)
router.post(
    "/create-from-url",
    validateRequest(FlipbookValidation.createFromUrlValidationSchema),
    FlipbookController.createFromUrl
);

// Create flipbook from URL (Async)
router.post(
    "/create-from-url-async",
    validateRequest(FlipbookValidation.createFromUrlAsyncValidationSchema),
    FlipbookController.createFromUrlAsync
);

// Get all flipbooks
router.get(
    "/",
    FlipbookController.getAllFlipbooks
);

// Get flipbook by ID
router.get(
    "/:id",
    FlipbookController.getFlipbookById
);

// Delete flipbook
router.delete(
    "/:id",
    FlipbookController.deleteFlipbook
);

export const FlipbookRoutes = router;