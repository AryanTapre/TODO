import {app} from "./config/app.js";
import {ApiError} from "./utiles/ApiError.js";
import {connectDB} from "./config/database.js";

connectDB()
.then(() :void => {
    app.listen(process.env.SERVER_PORT,() => {
        console.log(`HTTP server is running at port:${process.env.SERVER_PORT}`);
    })
})
.catch((error):void => {
    throw new ApiError(500,"unable to connectio to DB",[error]);
})