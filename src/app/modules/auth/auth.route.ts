import { Router } from "express";
import validationRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router()
router.post("/register-merchant",
    validationRequest(authValidation.registerZodSchema),authController.registerMerchant)

export const authRouter = router;