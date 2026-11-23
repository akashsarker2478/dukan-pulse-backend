import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { adminController } from "./admin.controller";



const router = Router()
router.get("/merchants",auth(UserRole.SUPER_ADMIN),adminController.getMerchants);

router.patch("/merchants/:id/status",auth(UserRole.SUPER_ADMIN),adminController.updateMerchantStatus);

router.get("/stores",auth(UserRole.SUPER_ADMIN),adminController.getStores);

router.patch("/stores/:id/status",auth(UserRole.SUPER_ADMIN),adminController.updateStoreStatus);

export const adminRoutes = router;