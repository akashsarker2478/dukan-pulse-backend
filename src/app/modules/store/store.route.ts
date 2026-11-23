import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { storeValidation } from "./store.validation";
import validationRequest from "../../middlewares/validateRequest";
import { storeController } from "./store.controller";

const router = Router();
//create store
router.post(
  "/",
  auth(UserRole.MERCHANT),
  validationRequest(storeValidation.createStoreZodSchema),
  storeController.createStore,
);

//get my store
router.get("/my", auth(UserRole.MERCHANT), storeController.getMyStores);

//update store
router.patch(
  "/:id",
  auth(UserRole.MERCHANT),
  validationRequest(storeValidation.updateStoreZodSchema),
  storeController.updateStore,
);
//get single store by id
router.get("/:id", auth(UserRole.MERCHANT), storeController.getStoreById);

export const storeRoutes = router;
