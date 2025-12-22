// models/userPrize.model.ts
import { Schema, model } from "mongoose";
import { IPrize } from "./prize.model";

export interface IUserPrize {
    user: Schema.Types.ObjectId;   // Reference to User
    prize: Schema.Types.ObjectId;  // Reference to Prize
    earnedAt: Date;
}

const userPrizeSchema = new Schema<IUserPrize>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        prize: { type: Schema.Types.ObjectId, ref: "Prize", required: true },
        earnedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const UserPrize = model<IUserPrize>("UserPrize", userPrizeSchema);
export default UserPrize;
