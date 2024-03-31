import {Request,Response} from "express";
import {ApiError} from "./ApiError";
type AsyncHandleType = (request:Request, response:Response) => Promise<void>

export const  asyncHandler = (handle:AsyncHandleType) => async (request:Request,response:Response) => {
    try{
        await handle(request,response);
    } catch (error) {
        throw new ApiError(500,'asyncHanler failed',[error]);
    }
}

