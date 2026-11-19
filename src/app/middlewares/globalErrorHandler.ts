import { ErrorRequestHandler } from "express";
import config from "../../config";
import httpStatus from "http-status";
import { ZodError } from "zod";
import ApiError from "../../shared/apiError";
import { Prisma } from "../../../generated/prisma/client";

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isDev = config.node_env === "development";
  console.error("Error:", err);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errors: { path: string; message: string }[] = [];

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";
    errors = err.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "This record already exists (duplicate value)";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Related record not found";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "Record not found";
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Database request failed";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
    message = "Database connection failed";
  } else if (isDev && err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: isDev && err instanceof Error ? err.stack : undefined,
  });
};