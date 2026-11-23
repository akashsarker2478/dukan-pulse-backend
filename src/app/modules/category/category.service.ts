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

const getCategoryIntoDB = async(storeId: string , user: IAuthUser)=>{
    //check access
  await checkStoreAccess(storeId, user);

  return prisma.category.findMany({
    where:{storeId},
    orderBy:{
        createdAt:"desc"
    }
  })
}

export const categoryService = {
  createCategoryIntoDB,
  getCategoryIntoDB
};
