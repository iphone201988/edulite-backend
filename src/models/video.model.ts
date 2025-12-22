import mongoose, { Schema, model, Types, Document } from "mongoose";

export interface IVideo extends Document {
    title: string;
    userId: Types.ObjectId;
    grade: string;
    subject: string;
    time: number;
    videoUrl: string;
    thumbnailUrl?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        userId: {
            type: Schema.Types.ObjectId, // ✅ FIX
            ref: "User",
            required: true,
        },


        grade: {
            type: String,          // ✅ grade stored as string
            required: true,
            index: true,
        },

        subject: {
            type: String,
            required: true,
        },

        time: {
            type: Number,
            required: true,
        },

        videoUrl: {
            type: String,
            required: true,
        },

        thumbnailUrl: {
            type: String,
            default: "",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Video = model<IVideo>("Video", videoSchema);

export default Video;
