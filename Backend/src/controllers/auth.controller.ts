import { Request,Response} from "express";

import { asyncHandler } from "../middlewares/asynsHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../Validation/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";




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
        console.log("Registering user...");
        
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