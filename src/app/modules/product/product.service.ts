import { UserRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../shared/apiError";
import { checkStoreAccess } from "../../../shared/storeAccess";
import {
  IAuthUser,
  ICreateProductPayload,
  IProductQuery,
} from "./product.interface";
import httpStatus from "http-status";

const createProductIntoDB = async (
  storeId: string,
  payload: ICreateProductPayload,
  user: IAuthUser,
) => {
  await checkStoreAccess(storeId, user);

  const category = await prisma.category.findFirst({
    where: {
      id: payload.categoryId,
      storeId,
    },
  });
  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Category not found in this store",
    );
  }
  const existsSku = await prisma.product.findFirst({
    where: {
      storeId,
      sku: payload.sku,
    },
  });

  if (existsSku) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "A product with this SKU already exists in this store",
    );
  }
  const isStaff = user.role === UserRole.STAFF;
  return prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      sku: payload.sku,
      buyPrice: payload.buyPrice,
      sellPrice: payload.sellPrice,
      stock: payload.stock,
      lowStockThreshold: payload.lowStockThreshold,
      storeId,
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
    },
    omit:{
        buyPrice : isStaff
    }
  });
};

const getProductFromDB = async (
  storeId: string,
  query: IProductQuery,
  user: IAuthUser,
) => {
  await checkStoreAccess(storeId, user);
  //pagination
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Math.min(Number(query.limit) || 10, 100),1);
  const skip = (page - 1) * limit;

  const isStaff = user.role === UserRole.STAFF;

  //filter and search
  const where = {
    storeId,
    categoryId: query.categoryId,
    isActive: isStaff ? true : undefined,
    OR: query.search
      ? [
          { name: { contains: query.search, mode: "insensitive" as const } },
          { sku: { contains: query.search, mode: "insensitive" as const } },
          {
            description: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
        ]
      : undefined,
  };
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      omit: { buyPrice: isStaff },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: products,
  };
};

export const productService = {
  createProductIntoDB,
  getProductFromDB,
};
