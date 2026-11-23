import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { StoreStatus, UserStatus } from "../../../../generated/prisma/enums";
import { adminService } from "./admin.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getMerchants = catchAsync(async (req: Request, res: Response) => {
  const status = (req.query.status as UserStatus) || undefined;
  const result = await adminService.getMerchantFromDB(status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Merchants retrieved successfully",
    data: result,
  });
});

const updateMerchantStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateMerchantStatusIntoDB(
    req.params.id as string,
    req.body.status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Merchant status updated to ${req.body.status}`,
    data: result,
  });
});

const getStores = catchAsync(async (req: Request, res: Response) => {
  const status = req.query.status as StoreStatus | undefined;
  const result = await adminService.getAllStoresIntoDB(status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stores retrieved successfully",
    data: result,
  });
});

const updateStoreStatus = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id as string;
  const { status } = req.body;

  const result = await adminService.updatedStoreStatusIntoDB(storeId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Store "${result.name}" status changed from ${result.previousStatus} to ${result.status}.`,
    data: result,
  });
});

export const adminController = {
  getMerchants,
  updateMerchantStatus,
  getStores,
  updateStoreStatus
};
