import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITeamMember {
  userId: Types.ObjectId; // reference to User
  status: "active" | "completed" | "left" | "pending"; // progress/status of member in the quest
}

export interface ITeam extends Document {
  name: string; // team name or code
  members: ITeamMember[]; // list of users and their statuses
  createdBy: Types.ObjectId; // user who created the team
  createdAt?: Date;
  updatedAt?: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "completed", "left", "pending"],
      default: "active",
    },
  },
  { _id: false }
);

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    members: {
      type: [teamMemberSchema],
      required: true,
      validate: [(v: ITeamMember[]) => v.length > 0, "At least one member is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TeamModel = mongoose.model<ITeam>("Team", teamSchema);

export default TeamModel;
