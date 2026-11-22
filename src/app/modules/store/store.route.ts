import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { storeValidation } from "./store.validation";
import validationRequest from "../../middlewares/validateRequest";
import { storeController } from "./store.controller";

const router = Router();
router.post("/",
auth(UserRole.MERCHANT),
validationRequest(storeValidation.createStoreZodSchema),
storeController.createStore
);

router.get("/my",auth(UserRole.MERCHANT),storeController.getMyStores)

export const storeRoutes = router;