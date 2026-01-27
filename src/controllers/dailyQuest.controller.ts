import { Request, Response } from "express";
import QuizTestModel from "../models/testQuiz.model";
import { ReadingModel } from "../models/reading.model";
import DailyQuestModel from "../models/quest.model";
import UserDailyQuestModel from "../models/userDailyQuest.model";
import UserResponseModel from "../models/userAnswer.model";

export const createDailyQuest = async (req: Request, res: Response) => {
  try {

    const { date, type, questType, name, class: className, testQuizId, readingId } = req.body;

    // ✅ Type-specific validation
    if (type === "questQuiz" && !testQuizId) {
      return res.status(400).json({ message: "testQuizId is required for questQuiz type." });
    }
    if (type === "questReading" && !readingId) {
      return res.status(400).json({ message: "readingId is required for reading type." });
    }

    // ✅ Check existence of referenced document
    if (type === "questQuiz") {
      const quizExists = await QuizTestModel.findById(testQuizId);
      if (!quizExists) return res.status(404).json({ message: "Quiz/Test not found." });
    }

    if (type === "questReading") {
      const readingExists = await ReadingModel.findById(readingId);
      if (!readingExists) return res.status(404).json({ message: "Reading not found." });
    }

    // ✅ Create Daily Quest
    const newQuest = await DailyQuestModel.create({
      date,
      type,
      questType,
      name,
      class: className,
      testQuizId: type === "questQuiz" ? testQuizId : undefined,
      readingId: type === "reading" ? readingId : undefined,
    });
    console.log("readingQuest....",newQuest)

    res.status(201).json({
      message: "Daily Quest created successfully",
      quest: newQuest,
    });
  } catch (error: any) {
    console.error("Error creating Daily Quest:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getDailyQuest = async (req: Request, res: Response) => {
  try {
    const { date, class: className } = req.query;
    const userId = req.userId;

    if (!date || !className) {
      return res.status(400).json({
        message:
          "Query parameters 'date', 'class' are required. Example: ?date=2025-11-04&class=Grade5",
      });
    }

    const startOfDay = new Date(date as string);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date as string);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyQuests = await DailyQuestModel.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      class: className,
    })
      .populate("testQuizId", "name type ")
      .populate("readingId", "title content type")
      .sort({ createdAt: -1 })
      .lean();

    if (!dailyQuests.length) {
      return res.status(200).json({
        message: `No daily quests found for class '${className}' on ${date}.`,
      });
    }

    // ------------------------------
    // 1️⃣ Get User Quest Progress
    // ------------------------------
    const questIds = dailyQuests.map(q => q._id);

    const userProgressList = await UserDailyQuestModel.find({
      userId,
      questId: { $in: questIds },
    })
      // .populate("userResponseId", "points correctCount incorrectCount")
      .lean();

    // ------------------------------
    // 2️⃣ Get all quizIds in quests
    // ------------------------------
    const quizIds = dailyQuests
      .map(q => q.testQuizId?._id || q.testQuizId)
      .filter(Boolean);

    // ------------------------------
    // 3️⃣ Fetch user answers per quiz
    // ------------------------------
    const userQuizResponses = await UserResponseModel.find({
      userId,
      quizId: { $in: quizIds },
    }).lean().select({
      quizId: 1,
      status: 1,
      points: 1,
      correctCount: 1,
      incorrectCount: 1,
      // answers: 1,

    });

    // ------------------------------
    // 4️⃣ Merge everything together
    // ------------------------------
    const questsWithProgress = dailyQuests.map(quest => {
      const progress = userProgressList.find(
        p => p.questId.toString() === quest._id.toString()
      );

      const quizResponse = userQuizResponses.find(
        r => r.quizId.toString() === quest?.testQuizId?._id?.toString()
      );

      return {
        ...quest,

        

        // ⭐ NEW FIELD — safe to add (does NOT break old clients)
        userProgress: quizResponse
          ? {
            status: quizResponse.status,
            points: quizResponse.points,
            correctCount: quizResponse.correctCount,
            incorrectCount: quizResponse.incorrectCount,
            answers: quizResponse.answers,
          }
          : null,
      };
    });

    res.status(200).json({
      message: "Daily quests fetched successfully",
      count: questsWithProgress.length,
      quests: questsWithProgress,
    });
  } catch (error: any) {
    console.error("Error fetching daily quests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllDailyQuestsForAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      date,
      class: className,
      questType,
      search
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // 🔎 Build dynamic filter
    const filter: any = {};

    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (className) {
      filter.class = className;
    }

    if (questType) {
      filter.questType = questType;
    }

    if (search) {
      const regex = new RegExp(search as string, "i");

      filter.$or = [
        { "testQuizId.name": regex },
        { "readingId.title": regex },
      ];
    }

    // 📊 Fetch paginated data + count
    const [quests, total] = await Promise.all([
      DailyQuestModel.find(filter)
        .populate("testQuizId", "name type")
        .populate("readingId", "title type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      DailyQuestModel.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Daily quests fetched successfully",
      quests,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: skip + quests.length < total,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error: any) {
    console.error("Admin daily quest fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch daily quests",
      error: error.message,
    });
  }
};




export const updateDailyQuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      date,
      type,
      questType,
      name,
      class: className,
      testQuizId,
      readingId,
    } = req.body;

    const quest = await DailyQuestModel.findById(id);
    if (!quest) {
      return res.status(404).json({ message: "Daily quest not found." });
    }

    // ✅ Type-specific validation
    if (type === "questQuiz" && !testQuizId) {
      return res.status(400).json({
        message: "testQuizId is required for questQuiz type.",
      });
    }

    if (type === "questReading" && !readingId) {
      return res.status(400).json({
        message: "readingId is required for questReading type.",
      });
    }

    // ✅ Validate referenced documents
    if (type === "questQuiz") {
      const quizExists = await QuizTestModel.findById(testQuizId);
      if (!quizExists) {
        return res.status(404).json({ message: "Quiz/Test not found." });
      }
    }

    if (type === "questReading") {
      const readingExists = await ReadingModel.findById(readingId);
      if (!readingExists) {
        return res.status(404).json({ message: "Reading not found." });
      }
    }

    // ✅ Update quest
    quest.name = name ?? quest.name;
    quest.date = date ?? quest.date;
    quest.type = type ?? quest.type;
    quest.questType = questType ?? quest.questType;
    quest.class = className ?? quest.class;

    quest.testQuizId = type === "questQuiz" ? testQuizId : undefined;
    quest.readingId = type === "questReading" ? readingId : undefined;

    await quest.save();

    res.status(200).json({
      message: "Daily quest updated successfully",
      quest,
    });
  } catch (error: any) {
    console.error("Error updating Daily Quest:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const deleteDailyQuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quest = await DailyQuestModel.findById(id);
    if (!quest) {
      return res.status(404).json({ message: "Daily quest not found." });
    }

    // ❗ Optional: remove user progress records
    await UserDailyQuestModel.deleteMany({ questId: id });

    await quest.deleteOne();

    res.status(200).json({
      message: "Daily quest deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Daily Quest:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  createDailyQuest,
  getDailyQuest,
  getAllDailyQuestsForAdmin,
  updateDailyQuest,
  deleteDailyQuest

}
