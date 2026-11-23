import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { clearAuthCookies, setAuthCookies } from "../../../shared/cookie";
import ApiError from "../../../shared/apiError";
import { UserRole } from "../../../../generated/prisma/enums";

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

const loginMerchant = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginMerchantIntoDB(req.body);
  const { accessToken, refreshToken, user } = result;

  setAuthCookies(res, { accessToken, refreshToken });
  const roleLabel = user?.role === UserRole.SUPER_ADMIN?"Super Admin" : "Merchant";
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${roleLabel} logged in successfully!`,
    data: {
      user,
      accessToken,
    },
  });
});


const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await authService.getMe(userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
  clearAuthCookies(res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: null,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token not found!");
  }

  const { accessToken } = await authService.refreshToken(token);
  setAuthCookies(res,{accessToken})
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully!",
    data: null,
  });
});

export const authController = {
  registerMerchant,
  loginMerchant,
  getMe,
  logOut,
  refreshToken
};
