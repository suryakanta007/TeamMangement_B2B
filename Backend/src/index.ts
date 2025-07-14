import "dotenv/config";
import express , {NextFunction, Request, Response} from "express";
import cors from "cors";
import session from "cookie-session"
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
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


app.use(
    cors({
        origin:config.FRONTEND_ORIGIN,
        credentials:true
    })
)

app.get("/",(req : Request,res: Response,next:NextFunction)=>{
    res.status(200).json({
        message:"Hello to Team Mangaement System"
    })
})

app.listen(config.PORT,async ()=>{
    console.log(`Server is running at http://localhost:${config.PORT}`)
    connectDatabase();
})  