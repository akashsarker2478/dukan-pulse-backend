import { prisma } from "../../../lib/prisma";
import ApiError from "../../../shared/apiError";
import { checkStoreAccess } from "../../../shared/storeAccess";
import { IAuthUser } from "./category.interface";
import httpStatus from "http-status";

const createCategoryIntoDB = async (
  storeId: string,
  name: string,
  user: IAuthUser,
) => {
  //check access
  await checkStoreAccess(storeId, user);

  const existsCategory = await prisma.category.findFirst({
    where: {
      storeId,
      name,
    },
  });

  if (existsCategory) {
    throw new ApiError(httpStatus.CONFLICT, "This category already exists");
  }

  return prisma.category.create({
    data: {
      name,
      storeId,
    },
  });
};

const getCategoryFromDB = async (storeId: string, user: IAuthUser) => {
  //check access
  await checkStoreAccess(storeId, user);

  return prisma.category.findMany({
    where: { storeId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateCategoryIntoDB = async (
  categoryId: string,
  storeId: string,
  name: string,
  user: IAuthUser,
) => {
  await checkStoreAccess(storeId, user);
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      storeId,
    },
  });
  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Category not found in this store",
    );
  }

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      storeId,
      name,
      NOT: {
        id: categoryId,
      },
    },
  });
  if (duplicateCategory) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Another category with this name already exists in this store",
    );
  }

  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });
};

const deleteCategoryFromDB = async (
  storeId: string,
  categoryId: string,
  user: IAuthUser,
) => {
  await checkStoreAccess(storeId, user);
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      storeId,
    },
  });
  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Category not found in this store",
    );
  }
  const productCount = await prisma.product.count({
    where: {
      id: categoryId,
      storeId,
    },
  });

  if (productCount > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete a category that has products",
    );
  }

  return prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  createCategoryIntoDB,
  getCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB
};
