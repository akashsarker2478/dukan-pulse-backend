import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { storeService } from "./store.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { StoreStatus } from "../../../../generated/prisma/enums";

const createStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await storeService.createStoreIntoDB(
    userId as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Store request submitted successfully. Awaiting admin approval.",
    data: result,
  });
});

const getMyStores = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const status = req.query.status as StoreStatus | undefined;
  const result = await storeService.getMyStoreIntoDB(userId as string, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stores retrieved successfully.",
    data: result,
  });
});

const updateStore = catchAsync(async(req: Request, res: Response)=>{
    const userId = req.user?.id as string;
    const storeId = req.params.id as string;
    const payload = req.body;
    const result = await storeService.updateStoreIntoDB(userId,storeId,payload)

    sendResponse(res,{
        statusCode : httpStatus.OK,
        success : true,
        message : "Store settings update successfully",
        data : result
    })
})

const getStoreById = catchAsync(async(req: Request, res: Response)=>{
  const userId = req.user?.id as string;
  const storeId = req.params.id as string;
  const result = await storeService.getSingleStoreIntoDB(storeId,userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Store retrieved successfully.",
    data: result,
  });
})

export const storeController = {
  createStore,
  getMyStores,
  updateStore,
  getStoreById,
};

