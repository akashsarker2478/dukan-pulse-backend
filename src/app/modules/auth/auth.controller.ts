import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const registerMerchant = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerMerchantIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      "Merchant and Store registered successfully! Please wait for admin approval.",
    data: result,
  });
});

export const authController = {
  registerMerchant,
};
