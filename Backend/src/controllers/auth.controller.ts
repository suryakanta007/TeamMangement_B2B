import { NextFunction, Request,Response} from "express";

import { asyncHandler } from "../middlewares/asynsHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../Validation/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import passport from "passport";





export const googleLoginCallback = asyncHandler(
    async (req:Request,res:Response)=>{
        const currentWorkspace = req.user?.currentWorkspace;
        if(!currentWorkspace){
            return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            )
        }

        return res.redirect(
            `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
        )
    }
)

export const registerUserController = asyncHandler(
    async (req: Request, res: Response , next:any) => {
      try {
        const result = registerSchema.safeParse({
          ...req.body,
        });

        if(!result.success){
          return next(result.error)
        }

        const body = result.data
        
    
        await registerUserService(body);
    
        return res.status(HTTPSTATUS.CREATED).json({
          message: "User created successfully",
        });
      } catch (error) {
        return next(error)
      }
    }
  );

export const loginController = asyncHandler(
  async (req:Request,res:Response,next:NextFunction)=>{
    
    
     passport.authenticate("local",(err:Error|null,user:Express.User|false,info:{message:string}|undefined)=>{
      
      
      if(err){
        console.log(err);
        return next(err)
      }
      if(!user){
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
          message:info?.message||"Invalid email or password "
        })
      }

      req.login(user,(err)=>{
        if(err){
          return next(err)
        }

        return res.status(HTTPSTATUS.OK).json({
          message:"Logged in successfully",
          user,

        })

      })



     })(req,res,next);

  }
)

export const logOutController = asyncHandler(
  async(req:Request,res:Response,next:NextFunction)=>{
    req.logout((err)=>{
      if(err){
        console.error("Logout error:",err);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
        .json({
          error:"Failed to logout."
        })
      }

    })

    req.session = null;
    return res.status(HTTPSTATUS.OK).json({message:"Logged out successfully"})  
    
  }
)



