import { Request, Response } from "express";
import TeamModel from "../models/team.model";
import Joi from "joi";

/**
 * ✅ Joi validation schema for creating a team
 */
const createTeamSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Team name is required",
  }),
  members: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required().messages({
          "any.required": "userId is required for each member",
        }),
        status: Joi.string()
          .valid("active", "completed", "left", "pending")
          .default("active"),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one team member is required",
    }),
  createdBy: Joi.string().required().messages({
    "string.empty": "createdBy (User ID) is required",
  }),
});

/**
 * ✅ Controller to create a new team
 */
export const createTeam = async (req: Request, res: Response) => {
  try {
    // Validate incoming data
    const { error, value } = createTeamSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, members, createdBy } = value;

    // Create new team document
    const newTeam = await TeamModel.create({
      name,
      members,
      createdBy,
    });

    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
    });
  } catch (err: any) {
    console.error("Error creating team:", err);
    res.status(500).json({
      message: "Server error while creating team",
      error: err.message,
    });
  }
};
