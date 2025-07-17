import { Document,model,Schema, Types } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider";

export interface AccountDocument extends Document{
   provider : ProviderEnumType;
   providerId : string;
   userId : Types.ObjectId;
   refreshToken ?: string | null;
   tokenExpiry:Date|null;
   createdAt:Date
}

 const accountSchema  = new Schema<AccountDocument>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        provider:{
            type:String,
            enum:Object.values(ProviderEnum),
            required:true
        },
        providerId:{
            type:String,
            required:true,
            unique:true
        },
        refreshToken:{
            type:String,
            default:null,
        },
        tokenExpiry:{
            type:Date,
            default:null
        }
    },
    {
        timestamps: true,
        toJSON: {
          transform(doc, ret) {
            delete ret.refreshToken;
          },
        },
      }
)

const AccountModel  = model<AccountDocument>("Account",accountSchema);

export default AccountModel