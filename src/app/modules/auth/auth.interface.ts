export interface IRegisterMerchantPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  storeName: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
