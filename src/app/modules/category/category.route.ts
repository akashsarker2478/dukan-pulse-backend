import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(UserRole.MERCHANT, UserRole.STAFF),
  validationRequest(categoryValidation.createCategoryZodSchema),
  categoryController.createCategory,
);

router.get(
  "/",
  auth(UserRole.MERCHANT, UserRole.STAFF),
  categoryController.getCategories,
);

export const categoryRoutes = router;
