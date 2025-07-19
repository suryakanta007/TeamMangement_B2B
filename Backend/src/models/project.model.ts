import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProjectDocument extends Document {
    name: string;
    workspace: Types.ObjectId;
    description: string;
    emoji: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        emoji: {
            type: String,
            required: false,
            trim: true,
            default: "📋"
        },
        description: {
            type: String,
            required: false
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, {
    timestamps: true
}
)
const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel