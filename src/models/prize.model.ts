// models/prize.model.ts
import { Schema, model } from "mongoose";

export type PrizeType = "badge" | "trophy" | "certificate" | "reward";
export type RequirementType = "quiz_count" | "reading_count" | "project_count" | "streak";

export interface IPrize {
    name: string;
    description?: string;
    type: PrizeType;
    image_url?: string;
    requirement_type: RequirementType;
    requirement_value: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const prizeSchema = new Schema<IPrize>(
    {
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ["badge", "trophy", "certificate", "reward"], default: "badge" },
        image_url: { type: String },
        requirement_type: { type: String, enum: ["quiz_count","reading_count","project_count","streak"], default: "quiz_count" },
        requirement_value: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Prize = model<IPrize>("Prize", prizeSchema);
export default Prize;
