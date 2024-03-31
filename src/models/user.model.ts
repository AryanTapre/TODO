import {Schema,model,Model} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as crypto from "crypto";
import {Mode} from "node:fs";

type UserSchemaType =  {
    phoneNumber:String;
    password:String;
    priority:Number;
    refreshToken: {
        token:String,
        revoke:Boolean
    };
}

type UserSchemaMethodType = {
    validatePassword():Promise<void>;
    generateAccessToken:string;
    generateRefreshToken:string;
}

type UserModel = Model<UserSchemaType,{},UserSchemaMethodType>;

const userSchema:Schema = new Schema<UserSchemaType,UserModel,UserSchemaMethodType>({
    phoneNumber:{
        type: Number,
        minLength:[10,'mobile number must be of 10 digits'],
        required:true
    },
    password: {
        type: String,
        minLength:[6,'password must be atLeast of 6 characters'],
        required: true,
        select:false
    },
    priority: {
        type: Number
    },
    refreshToken: {
        token: {
            type:String
        },
        revoke: {
            type:String
        }
    }
})

userSchema.pre('save',async function ():Promise<void> {
    this.password = await bcrypt.hash(this.password,20);
})


userSchema.method('validatePassword',async function validatePassword (userPassword:string):Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password);
})

userSchema.method('generateAccessToken',function generateAccessToken ():string {
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:process.env.JWT_SECRET_EXPIRY
        }
    )
})


userSchema.method('generateRefreshToken',function generateRefreshToken ():string {
    const refreshToken:string = crypto.randomBytes(20).toString();
    this.refreshToken = crypto.createHash('sha512').update(refreshToken).digest("hex");

    return jwt.sign(
        {
            id: this._id,
            refreshToken
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_SECRET_EXPIRY
        }
    )
})


const User = model<UserSchemaType,UserModel>('user',userSchema);
export {User};