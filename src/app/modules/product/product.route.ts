import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validateRequest";
import { productValidation } from "./product.validation";
import { productController } from "./product.controller";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(UserRole.MERCHANT, UserRole.STAFF),
  validationRequest(productValidation.createProductZodSchema),
  productController.createProduct,
);

router.get(
  "/",
  auth(UserRole.MERCHANT, UserRole.STAFF),
  productController.getProduct,
);

export const productRoutes = router;
