import { StoreType } from "../../../../generated/prisma/enums";

export interface ICreateStorePayload {
  name: string;
  address: string;
  phone: string;
  businessType: StoreType;
  logo?: string;
  vatRate?: number;
}
