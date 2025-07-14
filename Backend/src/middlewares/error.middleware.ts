import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";

export const errorHandeler:ErrorRequestHandler = (error,req,res,next):any=>{

    if(error instanceof SyntaxError){

        console.log(`Error Occured on PATH: ${req.path}`,error);

        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message:"Invalid JSON fromat,Please check your request .", 
        })
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
        error:error?.message || "Unknown error occurred."
    })
}