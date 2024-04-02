import {User} from "../models/user.model.js";
import {ApiError} from "../utiles/ApiError.js";
import {ApiResponse} from "../utiles/ApiResponse.js";
import {asyncHandler,AsyncHandleType} from "../utiles/AsyncHandler.js";
import {Request,Response} from 'express';
import {sendTokens} from "../utiles/sendTokens.js";



const signup = asyncHandler(async (request:Request, response:Response):Promise<void> => {
    try {

        console.log("response object:",response);
        console.log("request object:",request);
        const {phoneNumber,password}  = request.body;

        if([phoneNumber,password].some(element => element.trim() === "")) {
            response.status(400).json(new ApiError(400,"phone-number and password are mandatory",["phone-number and password are mandatory"]));
        }

        const existingUser = await User.findOne({
            phoneNumber:phoneNumber
        })

        if(existingUser) {
             response.status(400).json(new ApiResponse(400,null,"user already exists"));
             return;
        }


        const newUser = new User({
            phoneNumber:phoneNumber,
            password:password
        })


        await newUser.save().then((savedUser) => {
            console.log(`user created successfully with id:${savedUser._id}`);
        }).catch((error) => {
            throw new ApiError(500,"failed to create new user",[error]);
        })

        await sendTokens(newUser,response);

    } catch (error) {
        throw new ApiError(500,"error at signup controller",[error]);
    }

})




export {signup};