
import express, {Express} from 'express';
import morgan from "morgan";
import {config} from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

config({
    path:'src/environmentVariables/.env'
})

const app:Express = express();


app.use(express.urlencoded({
    limit:'100mb',
    extended:true
}));
app.use(express.json({
    limit: '200kb'
}));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

export {app};