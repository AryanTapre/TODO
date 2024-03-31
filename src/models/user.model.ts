import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {randomBytes,createHash} from "crypto";

const userSchema = new mongoose.Schema({
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
        type: String
    }
});

userSchema.pre('save',async function ():Promise<void> {
    this.password = await bcrypt.hash(this.password,20);
})

userSchema.methods.validatePassword = async function (userPassword:string):Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.generateAccessToken = function ():jwt {
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:process.env.JWT_SECRET_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function ():jwt {
    const refreshToken:string = randomBytes(20).toString();
    this.refreshToken = createHash('sha512').update(refreshToken).digest("hex");

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
}

export default mongoose.model("user",userSchema);