import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

const validationRequest = (schema: ZodObject<ZodRawShape>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parseData = await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });

      if (parseData.body !== undefined) {
        req.body = parseData.body;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validationRequest;
