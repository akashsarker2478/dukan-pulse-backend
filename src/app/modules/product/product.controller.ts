import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { IAuthUser, IProductQuery } from "./product.interface";
import { productService } from "./product.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.storeId as string;
  const payload = req.body;
  const user = req.user as IAuthUser;

  const result = await productService.createProductIntoDB(
    storeId,
    payload,
    user,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});
const getProduct = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.storeId as string;
  const query = req.query as IProductQuery;
  const user = req.user as IAuthUser;
  const result = await productService.getProductFromDB(storeId, query, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {});

export const productController = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
