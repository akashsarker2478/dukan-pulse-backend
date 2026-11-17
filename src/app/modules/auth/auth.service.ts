import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { ILoginPayload, IRegisterMerchantPayload } from "./auth.interface";
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";

const registerMerchantIntoDB = async (payload: IRegisterMerchantPayload) => {
  const { name, email, password, phone, storeName } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists!");
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
    throw new Error("Invalid email or password!");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password!");
  }

  if (user.status === "PENDING") {
    throw new Error("Your account is pending admin approval. Please wait.");
  }

  if (user.status === "BLOCKED") {
    throw new Error(
      "Your account has been deactivated. Please contact support.",
    );
  }

  const userWithoutPassword = await prisma.user.findUnique({
    where: { email },
    omit: {
      password: true,
    },
    include: {
      store: true,
    },
  });
  return {
    user: userWithoutPassword
  }
};

export const authService = {
  registerMerchantIntoDB,
  loginMerchantIntoDB,
};
