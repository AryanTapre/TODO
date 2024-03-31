
import express,{Express} from "express";
import {ApiError} from "../utiles/ApiError.js";
import  mongoose from "mongoose";
import {DB_NAME} from "../constants/constant.js";

const app:Express = express();

const connectDB = async():Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_NAME}`);
        app.on('error',(error):void => {
            console.log(`Express can not talk to database! because: ${error}`);
            process.exit(1);
        })
        console.log(`CONNECTED WITH MONGOdb!!
            host:${connectionInstance.connection?.host} 
            port:${connectionInstance.connection?.port} 
            name:${connectionInstance.connection?.name}
        `);
    } catch (error) {
        throw new ApiError(500,"connection to database failed",[error]);
    }
}

export {connectDB};