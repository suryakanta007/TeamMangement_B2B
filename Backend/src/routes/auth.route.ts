import { config } from "../config/app.config";
import { Router } from "express";
import passport from "passport";
import { googleLoginCallback, registerUserController } from "../controllers/auth.controller";


const failedUrl  = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes = Router();

authRoutes.post("/register", registerUserController)

authRoutes.get("/google",passport.authenticate("google",{
    scope:["profile","email"],
    session:false
})
);

authRoutes.get("/google/callback",passport.authenticate("google",{
    failureRedirect:failedUrl
}),googleLoginCallback)


export default authRoutes
