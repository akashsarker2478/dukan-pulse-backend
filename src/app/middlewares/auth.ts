import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../shared/catchAsync";
import ApiError from "../../shared/apiError";
import httpStatus from "http-status";
import { jwtHelper } from "../../shared/jwtHelper";
import config from "../../config";
import { prisma } from "../../lib/prisma";

export const auth = (...allowedRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check if access token exists in cookies
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not logged in!");
    }

    // Verify token signature and expiration
    let decoded;
    try {
      decoded = jwtHelper.verifyToken(token, config.jwt_access_secret);
    } catch {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token!");
    }

    // Ensure user still exists in database and has an ACTIVE status
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        storeId: true,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Your account is not active!",
      );
    }

    // Check if the user's role is permitted for this route
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission!");
    }

    // Attach authenticated user info to request and proceed
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
    };

    next();
  });
};