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

userSchema.method('validatePassword',function (userPassword:string) {
    return bcrypt.compare(userPassword,this.password);
})

userSchema.method('generateAccessToken', function () {
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn:process.env.JWT_EXPIRY as string,
        }
    )
})

userSchema.method('generateRefreshToken', function () {
    const refreshToken = crypto.randomBytes(20).toString("hex");
    this.refreshToken.token = crypto.createHash('sha256').update(refreshToken).digest("hex");

    return jwt.sign(
        {id:this._id,refreshToken:refreshToken},
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn:process.env.JWT_EXPIRY as string,
        }
    )
})

const User = model<IUser,UserModel>('user',userSchema);
export {User};