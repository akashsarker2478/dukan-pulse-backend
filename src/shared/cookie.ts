import { CookieOptions, Response } from "express";
import config from "../config";

const isProduction = config.node_env === "production";
const baseOption: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const ACCESS_MAX_AGE = 15 * 60 * 1000; // 15m
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7days

export const setAuthCookies = (
  res: Response,
  tokens: { accessToken?: string; refreshToken?: string },
) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      ...baseOption,
      maxAge: ACCESS_MAX_AGE,
    });
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      ...baseOption,
      maxAge: REFRESH_MAX_AGE,
    });
  }
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", baseOption);
  res.clearCookie("refreshToken", baseOption);
};
