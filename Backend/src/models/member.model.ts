import mongoose ,{Document,Schema} from "mongoose";
import { ref } from "process";
import { RoleDocument } from "./roles-permission.model";

export interface MemberDocument extends Document{
    userId : mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    role:RoleDocument
    joinedAt:Date;
}


const memberSchema = new Schema<MemberDocument>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:Schema.Types.ObjectId,
        ref:"Role",
        require:true
    },
    workspaceId:{
        type:Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    joinedAt:{
        type:Date,
        default:Date.now,
    }
},{
    timestamps:true
})

const MemberModel = mongoose.model<MemberDocument>("Member",memberSchema);
export default MemberModel