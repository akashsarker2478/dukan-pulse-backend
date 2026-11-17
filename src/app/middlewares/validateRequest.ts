import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

const validationRequest = (schema:ZodObject<ZodRawShape>)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try {
            await schema.parseAsync({
                body:req.body,
                cookies:req.cookies
            });
            next()
        } catch (error) {
            next(error)
        }
    };
};

export default validationRequest;