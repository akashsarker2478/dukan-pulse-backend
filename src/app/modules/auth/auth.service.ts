import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { ILoginPayload, IRegisterMerchantPayload } from "./auth.interface";
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { jwtHelper } from "../../../shared/jwtHelper";
import config from "../../../config";
import ApiError from "../../../shared/apiError";
import  HttpStatus  from "http-status";
import { assertStoreAccessible } from "../../../shared/storeAccess";

const registerMerchantIntoDB = async (payload: IRegisterMerchantPayload) => {
  const { name, email, password, phone, storeName } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ApiError(HttpStatus.CONFLICT, "User with this email already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: UserRole.MERCHANT,
        status: UserStatus.PENDING,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const newStore = await tx.store.create({
      data: {
        name: storeName,
        ownerId: newUser.id,
        phone: phone,
      },
    });

    return {
      user: newUser,
      store: newStore,
    };
  });
  return result;
};

const loginMerchantIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      store: true,
    },
  });
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid email or password!");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password!");
  }

  if (user.status === UserStatus.PENDING) {
    throw new ApiError(HttpStatus.FORBIDDEN, "Your account is pending admin approval. Please wait.");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new ApiError(HttpStatus.FORBIDDEN, "Your account has been deactivated. Please contact support.");
  }
// TODO: staff API বানানোর পর এই ব্লকটা চালু করতে হবে
//   if (user.role === UserRole.STAFF && user.storeId) {
//   await assertStoreAccessible(user.storeId);
// }

const tokenPayload = {
  id : user.id,
  email : user.email,
  role : user.role,
  storeId : user.storeId
};

const accessToken = jwtHelper.generateToken(
  tokenPayload,
  config.jwt_access_secret,
  config.jwt_access_expires_in
);

const refreshToken = jwtHelper.generateToken(
  tokenPayload,
  config.jwt_refresh_secret,
  config.jwt_refresh_expires_in
);

const {password: _password, ...userWithoutPassword} = user;
return {user:userWithoutPassword,accessToken,refreshToken}

};

export const authService = {
  registerMerchantIntoDB,
  loginMerchantIntoDB,
};
