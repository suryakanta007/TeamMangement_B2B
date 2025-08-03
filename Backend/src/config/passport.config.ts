import passport, { use } from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider";
import { loginOrCreateAccountService, verifyUserService } from "../services/auth.service";
import { userInfo } from "os";


passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            passReqToCallback: true
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;
                console.log(googleId, "GoogleId");
                console.log(profile, "Profile");
                if (!googleId) {
                    throw new NotFoundException("GoogleId not found");
                }
                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email
                });
                done(null, user);

            } catch (error) {
                done(error, false)
            }
        }
    )
)

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        session: true,
    },
    async (email,password,done)=>{
        try {
            const user = await verifyUserService({email,password});
            return done(null,user);
        } catch (error:any) {
            return done(error,false,{message:error?.message})
        }
    }

),)

passport.serializeUser((user: any, done) => done(null, user));


passport.deserializeUser((user: any, done) => done(null, user));

