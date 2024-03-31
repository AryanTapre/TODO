import {User} from "../models/user.model.js";
import {ApiError} from "../utiles/ApiError.js";
import {ApiResponse} from "../utiles/ApiResponse.js";
import {asyncHandler,AsyncHandleType} from "../utiles/AsyncHandler.js";
import {Request,Response} from 'express';

const signup = asyncHandler(async (request:Request, response:Response):Promise<void> => {
    const newUser = new User({
        phoneNumber:request.body?.phoneNumber,
        password:request.body?.password
    })
     await newUser.save().then((savedUser) => {
         console.log("user created successfully",savedUser)
     }).catch((error) => {
         console.log("error while creating user ",error);
     })

    //@ts-ignore
     newUser.password = undefined;
    response.status(201).json(
        new ApiResponse(201,newUser)
    )
})


export {signup};