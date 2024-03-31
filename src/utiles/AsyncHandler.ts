import {NextFunction} from "express";

export const AsyncHandler = (handleRequest:Function) => (request:Request, response:Response, next:NextFunction) => {
    Promise.resolve(handleRequest(request,response,next))
        .catch((error) => {
            console.log(error);
        })
}