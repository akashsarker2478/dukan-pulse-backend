import {
  StoreStatus,
  UserRole,
  UserStatus,
} from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../shared/apiError";
import httpStatus from "http-status";

const getMerchantFromDB = async (status?: UserStatus) => {
  return prisma.user.findMany({
    where: {
      role: UserRole.MERCHANT,
      ...(status && { status }),
    },
    omit: {
      password: true,
    },
    include: {
      ownedStores: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateMerchantStatusIntoDB = async (id: string, status: UserStatus) => {
  if (status !== UserStatus.ACTIVE && status !== UserStatus.BLOCKED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Status must be ACTIVE or BLOCKED",
    );
  }

  const merchant = await prisma.user.findUnique({
    where: { id },
  });

  if (!merchant || merchant.role !== UserRole.MERCHANT) {
    throw new ApiError(httpStatus.NOT_FOUND, "Merchant not found");
  }

  return prisma.$transaction(async (tx) => {
    const updatedMerchant = await tx.user.update({
      where: { id },
      data: { status },
      omit: { password: true },
    });

    if (status === UserStatus.ACTIVE) {
      await tx.store.updateMany({
        where: { ownerId: id, status: StoreStatus.PENDING },
        data: { status: StoreStatus.ACTIVE },
      });
    }

    return updatedMerchant;
  });
};

const getAllStoresIntoDB = async (status?: StoreStatus) => {
  const stores = await prisma.store.findMany({
    where: { ...(status && { status }) },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return stores;
};

const updatedStoreStatusIntoDB = async (
  storeId: string,
  status: StoreStatus,
) => {
  if (status !== StoreStatus.ACTIVE && status !== StoreStatus.BLOCKED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Store status can only be updated to ACTIVE or BLOCKED.",
    );
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },
  });

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found!");
  }

   if (store.status === status) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Store is already ${status}.`);
  }

  if (status === StoreStatus.ACTIVE && store.owner.status !== UserStatus.ACTIVE) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot activate store because the owner is not ACTIVE.",
    );
  }

  const previousStatus = store.status;
  const updateStore = await prisma.store.update({
    where: { id: storeId },
    data: { status },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },
  });

  return {
    ...updateStore,previousStatus
  }
};

export const adminService = {
  getMerchantFromDB,
  updateMerchantStatusIntoDB,
  getAllStoresIntoDB,
  updatedStoreStatusIntoDB
};
