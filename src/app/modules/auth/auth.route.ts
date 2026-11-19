import { Router } from "express";
import validationRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router()
router.post("/register-merchant",
    validationRequest(authValidation.registerZodSchema),authController.registerMerchant)

router.post("/login",
    validationRequest(authValidation.loginZodSchema),
    authController.loginMerchant
)

router.get("/me", auth(), (req, res) => {
  res.json({ success: true, data: req.user });
});

export const authRouter = router;