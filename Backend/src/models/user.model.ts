

import { hash } from "crypto";
import { Document,model,Schema, Types } from "mongoose";
import { hashValue } from "../utils/bcrypt";

export interface UserDocument extends Document{
    name:string;
    email:string;
    password?:string;
    profilePicture?:string|null;
    isActive:boolean;
    lastLogin:Date | null;
    createdAt:Date;
    updatedAt:Date;
    currentWorkspace:Types.ObjectId |null;
    comparePassword(value : string):Promise<boolean>;
    omitPassword():Omit<UserDocument,"password">;
}

const userSchema = new Schema<UserDocument>(
    {
        name:{
            type:String,
            required:false,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        password:{
            type:String,
            select:true
        },
        profilePicture:{
            type:String,
            default:null
        },
        currentWorkspace:{
            type:Schema.Types.ObjectId,
            ref:"Workspace"
        },
        isActive:{type:Boolean,default:true},
        lastLogin:{type:Date,default:null},
    },{
        timestamps:true
    }
)

userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
        if(this.password){
            this.password = await hashValue(this.password);
        }
    }
    next();
})

userSchema.methods.omitPassword = function():Omit<UserDocument,"password">{
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}


const UserModel = model<UserDocument>("User",userSchema);
export default UserModel;
