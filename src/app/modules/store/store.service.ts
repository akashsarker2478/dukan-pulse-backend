import { StoreStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../shared/apiError";
import { ICreateStorePayload } from "./store.interface";

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

export const storeService = {
  createStoreIntoDB,
  getMyStoreIntoDB
};