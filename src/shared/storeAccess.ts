import { StoreStatus, UserRole, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import ApiError from "./apiError";
import httpStatus from "http-status";

// Checks only that the store exists and its store and owner are ACTIVE.
export const assertStoreAccessible = async (storeId: string) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: { owner: { select: { status: true } } },
  });

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
  }

  if (
    store.status !== StoreStatus.ACTIVE ||
    store.owner.status !== UserStatus.ACTIVE
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "This store is not active");
  }

  return store;
};

// Full check for store-scoped APIs: store exists, user belongs to it, store and owner are ACTIVE.
export const checkStoreAccess = async(storeId: string,
  user:{id:string, role: UserRole, storeId?: string | null})=>{
    const store = await prisma.store.findUnique({
      where:{id : storeId},
      include:{owner:{select :{status : true } } }
    });

    if(!store){
       throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
    }

    const isOwner = user.role === UserRole.MERCHANT && store.ownerId === user.id;

    const isStaff = user.role === UserRole.STAFF && user.storeId === store.id;

    if (!isOwner && !isStaff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
  }

  if(store.status !== StoreStatus.ACTIVE || store.owner.status !== UserStatus.ACTIVE ){
    throw new ApiError(httpStatus.FORBIDDEN, "This store is not active");
  }

  return store;
}