import mongoose,{Schema,Document} from "mongoose";
import { Permissions, PermissionType, Roles, RoleType } from "../enums/role.enum";
import { RolePermissions } from "../utils/roles-permissions";

export interface RoleDocument extends Document{
    name:RoleType;
    permissions:Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>({
    name:{
        type:String,
        required:true,
        enum:Object.values(Roles),
        unique:true
    },
    permissions:{
        type:[String],
        enum:Object.values(Permissions),
        required:true,
        default:function (this:RoleDocument){
            return  RolePermissions[this.name]
        }
    }
    
},{
    timestamps:true
})


const RoleModel = mongoose.model<RoleDocument>("Role",roleSchema);
export default RoleModel