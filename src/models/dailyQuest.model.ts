import mongoose, { Schema, Document } from "mongoose";

interface Quest {
  title: string;
  description: string;
}

export interface DailyQuestDocument extends Document {
  userId: mongoose.Types.ObjectId;
  status: "pending" | "completed" | "in-progress";
  quests: Quest[];
  createdAt: Date;
  updatedAt: Date;
}

const questSchema = new Schema<Quest>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
//   { _id: false } // no separate _id for each quest
);

const dailyQuestSchema = new Schema<DailyQuestDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "in-progress"],
      default: "pending",
    },
    quests: { type: [questSchema], required: true },
  },
  { timestamps: true }
);

const DailyQuestModel = mongoose.model<DailyQuestDocument>(
  "DailyQuest",
  dailyQuestSchema,
  "DailyQuests"
);

export default DailyQuestModel;