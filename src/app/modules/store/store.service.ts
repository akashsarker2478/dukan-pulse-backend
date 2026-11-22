import { StoreStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../shared/apiError";
import { ICreateStorePayload } from "./store.interface";
import httpStatus from "http-status";
const createStoreIntoDB = async (
  userId: string,
  payload: ICreateStorePayload,
) => {
  return prisma.store.create({
    data: {
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      businessType: payload.businessType,
      logo: payload.logo,
      vatRate: payload.vatRate ?? 0,
      ownerId: userId,
      status: "PENDING",
    },
  });
};

const getMyStoreIntoDB = async(userId : string, status?: StoreStatus)=>{
    const stores = await prisma.store.findMany({
        where:{ownerId: userId, ...(status && {status})},
        orderBy:{createdAt: "desc"}
    });
    return stores;
}

const updateStoreIntoDB = async(userId:string, storeId:string, payload:Partial<ICreateStorePayload>)=>{
    const existingStore = await prisma.store.findUnique({
        where:{id:storeId},
    });

    if(!existingStore){
        throw new ApiError(httpStatus.NOT_FOUND, "Store not found!");
    }

    if(existingStore.ownerId !== userId){
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to update this store!");
    }

    if (existingStore.status === "BLOCKED") {
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    "Blocked stores cannot be updated. Please contact support.",
  );
}

    const updatedStore = await prisma.store.update({
        where:{id:storeId},
        data:{
            ...payload
        }
    })
    return updatedStore;
}

export const storeService = {
  createStoreIntoDB,
  getMyStoreIntoDB,
  updateStoreIntoDB
};