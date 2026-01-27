import { Request, Response, NextFunction } from "express";
import { ReadingModel } from "../models/reading.model";
import mongoose from "mongoose";

const createReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, type, readingType, class: className, subject } = req.body;

    // Validate input
    if (!title || !content || !type || !readingType || !className || !subject) {
      return res.status(400).json({ message: "All fields (title, content, type, readingType, class, subject) are required." });
    }

    const reading = await ReadingModel.create({
      title,
      content,
      type,
      readingType,
      class: className,
      subject,
    });

    res.status(201).json({
      success: true,
      message: "Reading created successfully",
      data: reading,
    });
  } catch (error) {
    console.error("Error creating reading:", error);
    next(error);
  }
};


const getReadings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const { class: className, subject, type, readingType } = req.query;

    const filter: any = {};

    if (className) filter.class = className;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (readingType) filter.readingType = readingType;

    const [readings, total] = await Promise.all([
      ReadingModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReadingModel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: readings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching readings:", error);
    next(error);
  }
};

/**
 * GET SINGLE READING BY ID
 */
const getReadingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reading ID" });
    }

    const reading = await ReadingModel.findById(id);

    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    res.status(200).json({
      success: true,
      data: reading,
    });
  } catch (error) {
    console.error("Error fetching reading:", error);
    next(error);
  }
};

/**
 * UPDATE READING
 */
const updateReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reading ID" });
    }

    const updatedReading = await ReadingModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    res.status(200).json({
      success: true,
      message: "Reading updated successfully",
      data: updatedReading,
    });
  } catch (error) {
    console.error("Error updating reading:", error);
    next(error);
  }
};

/**
 * DELETE READING
 */
const deleteReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reading ID" });
    }

    const deletedReading = await ReadingModel.findByIdAndDelete(id);

    if (!deletedReading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    res.status(200).json({
      success: true,
      message: "Reading deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reading:", error);
    next(error);
  }
};

const readingProgressController = async (req: Request, res: Response, next: NextFunction) => {
  
}

export default {
  createReading,
  getReadings,
  getReadingById,
  updateReading,
  deleteReading,
}
