import "dotenv/config";
import express , {NextFunction, Request, Response} from "express";
import cors from "cors";
import session from "cookie-session"
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import {HTTPSTATUS} from "./config/http.config";
import {errorHandeler} from "./middlewares/error.middleware";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(
    session({
        name : "session",
        keys:[config.SESSION_SECRET],
        maxAge:1000*60*60*24,
        secure:config.NODE_ENV === "production",
        httpOnly:true,
        sameSite:"lax"
    })
)

// Add compatibility methods for Passport with cookie-session
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (callback: () => void) => {
            callback();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (callback: () => void) => {
            callback();
        };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());



app.use(
    cors({
        origin:config.FRONTEND_ORIGIN,
        credentials:true
    })
)



app.use(`${BASE_PATH}/auth`,authRoutes)
app.get("/",(req : Request,res: Response,next:NextFunction)=>{
    res.status(HTTPSTATUS.OK).json({
        message:"Hello to Team Mangaement System"
    })
})
app.use(errorHandeler);


app.listen(config.PORT,async ()=>{
    console.log(`Server is running at http://localhost:${config.PORT}`)
    connectDatabase();
})  