import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserDailyQuest extends Document {
  userId: Types.ObjectId; // reference to User
  questId: Types.ObjectId; // reference to DailyQuest
  status: "in-progress" | "completed" | "not-started"; // general quest status
  type: "questReading" | "questQuiz"; // copied from DailyQuest for easier filtering
  progress?: number; // for reading quest (percentage)
  userResponseId?: Types.ObjectId; // for quiz/test quests, reference to UserResponse
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userDailyQuestSchema = new Schema<IUserDailyQuest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questId: { type: Schema.Types.ObjectId, ref: "DailyQuest", required: true },
    type: {
      type: String,
      enum: ["questReading", "questQuiz"],
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "not-started"],
      default: "not-started",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
    },
    userResponseId: {
      type: Schema.Types.ObjectId,
      ref: "UserResponse", // link to quiz/test answers
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const UserDailyQuestModel = mongoose.model<IUserDailyQuest>(
  "UserDailyQuest",
  userDailyQuestSchema,
  "UserDailyQuests"
);

export default UserDailyQuestModel;
