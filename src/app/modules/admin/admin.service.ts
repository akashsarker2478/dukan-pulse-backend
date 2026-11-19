import { StoreStatus, UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../shared/apiError";
import  httpStatus  from "http-status";

const getMerchantFromDB = async(status?:UserStatus)=>{
    return prisma.user.findMany({
        where:{
            role:UserRole.MERCHANT,...(status && {status})
        },
        omit:{
            password:true
        },
        include:{
            ownedStores:true
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}

const updateMerchantStatusIntoDB =async (id:string, status:UserStatus)=>{
    if(status !== UserStatus.ACTIVE && status !== UserStatus.BLOCKED){
        throw new ApiError(httpStatus.BAD_REQUEST,"Status must be ACTIVE or BLOCKED")
    }

    const merchant = await prisma.user.findUnique({
        where:{id}
    })

    if(!merchant || merchant.role !== UserRole.MERCHANT){
        throw new ApiError(httpStatus.NOT_FOUND, "Merchant not found");
    }

    return prisma.$transaction(async(tx)=>{
        const updatedMerchant = await tx.user.update({
            where:{id},
            data:{status},
            omit:{password : true}
        });

        if(status === UserStatus.ACTIVE){
            await tx.store.updateMany({
                where:{ownerId: id ,status: StoreStatus.PENDING},
                data:{status:StoreStatus.ACTIVE}
            })
        }else{
            await tx.store.updateMany({
                where:{ownerId:id},
                data:{status:StoreStatus.BLOCKED}
            });
        }

        return updatedMerchant;
    })
}

export const adminService = {
    getMerchantFromDB,
    updateMerchantStatusIntoDB
} 