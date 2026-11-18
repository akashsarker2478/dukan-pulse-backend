import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import config from "../../../config";

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

const loginMerchant =catchAsync(async(req:Request,res:Response)=>{
    const result = await authService.loginMerchantIntoDB(req.body);
    const {accessToken,refreshToken,user} = result;

    res.cookie("refreshToken",refreshToken,{
      secure:config.node_env === "production",
      httpOnly:true,
      sameSite: config.node_env === "production" ? "none" : "strict",
      maxAge:7 * 24 * 60 * 60 * 1000, //7day
    })

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Merchant logged in successfully!",
        data:{
          user,
          accessToken
        }
    })
})

export const authController = {
  registerMerchant,
  loginMerchant
};
