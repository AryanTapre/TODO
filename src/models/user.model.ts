import {Schema,model,Model,HydratedDocument} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as crypto from "crypto";
import {stringify} from "node:querystring";
import exp from "node:constants";

interface IUser {
    phoneNumber:number;
    password:string;
    priority:number;
    refreshToken:{
        token:string,
        revoke:string
    };
}

interface IUserMethods {
    validatePassword(userPassword:string):any;
    generateAccessToken():any;
    generateRefreshToken():any;
}

type UserModel = Model<IUser,{},IUserMethods>;
const userSchema = new Schema<IUser,UserModel,IUserMethods>({
    phoneNumber: {
        type:Number,
        minLength:[10,'mobile number should be  of 10 digits'],
        required: true
    },
    password: {
        type:String,
        select:false,
        minLength:[6,'Password should be atleast of 6 characters'],
        required:true
    },
    priority:{
        type:Number
    },
    refreshToken:{
        token: {
            type:String
        },
        revoke: {
            type:String
        }
    }
})

userSchema.pre('save',async function () {
    this.password = await bcrypt.hash(this.password,10);
})

const User = model<IUser,UserModel>('user',userSchema);
export {User};