import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { IAuthUser } from "./category.interface";
import { categoryService } from "./category.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async(req: Request, res: Response)=>{
    const storeId = req.params.storeId as string;
    const {name} = req.body;
    const user = req.user as IAuthUser;

    const result = await categoryService.createCategoryIntoDB(storeId,name,user);

    sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

const getCategories = catchAsync(async(req: Request, res: Response)=>{
    const storeId = req.params.storeId as string;
  const user = req.user as IAuthUser;

  const result = await categoryService.getCategoryFromDB(storeId, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async(req: Request, res: Response)=>{
  const storeId = req.params.storeId as string;
  const categoryId = req.params.categoryId as string;
  const {name} = req.body;
  const user = req.user as IAuthUser;
  const result = await categoryService.updateCategoryIntoDB(categoryId,storeId,name,user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async(req: Request, res: Response)=>{
  const storeId = req.params.storeId as string;
  const categoryId = req.params.categoryId as string;
  const user = req.user as IAuthUser;

  const result = await categoryService.deleteCategoryFromDB(storeId,categoryId,user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};