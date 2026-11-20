import { StoreStatus, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma"
import ApiError from "./apiError"
import httpStatus from "http-status";
export const assertStoreAccessible = async(storeId : string)=>{
    const store = await prisma.store.findUnique({
        where:{id:storeId},
        include:{owner:{select:{status:true}}}
    });

    if(!store){
        throw new ApiError(httpStatus.NOT_FOUND,"Store not found")
    }

    if(store.status !== StoreStatus.ACTIVE ||
         store.owner.status !== UserStatus.ACTIVE){
            throw new ApiError(httpStatus.FORBIDDEN, "This store is not active");
         }

         return store;
}