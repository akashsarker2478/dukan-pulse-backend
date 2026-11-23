import { UserRole } from "../../../../generated/prisma/enums";

export interface IAuthUser{
    id : string;
    role : UserRole;
    storeId? : string | null;
}