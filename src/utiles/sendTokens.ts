import {User} from "../models/user.model.js";
import {Response} from  'express';
//@ts-ignore
const sendTokens = async (user: User,response:Response) => {
    try{
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

    }catch (error) {

    }
}