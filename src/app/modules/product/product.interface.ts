import { UserRole } from "../../../../generated/prisma/enums";

export interface IAuthUser {
  id: string;
  role: UserRole;
  storeId?: string | null;
}

export interface ICreateProductPayload {
  name: string;
  description?: string;
  sku: string;
  buyPrice: number;
  sellPrice: number;
  stock?: number;
  lowStockThreshold?: number;
  categoryId: string;
}

export interface IUpdateProductPayload {
  name?: string;
  description?: string;
  sku?: string;
  buyPrice?: number;
  sellPrice?: number;
  lowStockThreshold?: number;
  categoryId?: string;
  isActive?: boolean;
}

export interface IProductQuery {
  search?: string;
  categoryId?: string;
  page?: string;
  limit?: string;
}
