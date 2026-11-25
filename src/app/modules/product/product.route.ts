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

router.get(
  "/:productId",
  auth(UserRole.MERCHANT, UserRole.STAFF),
  productController.getSingleProduct,
);

router.patch(
  "/:productId",
  auth(UserRole.MERCHANT, UserRole.STAFF),
  validationRequest(productValidation.updateProductZodSchema),
  productController.updateProduct,
)

router.delete(
  "/:productId",
  auth(UserRole.MERCHANT),
  productController.deleteProduct,
);

export const productRoutes = router;
