import { Request, Response, NextFunction } from "express";
import QuizTestModel, { QuizTestDocument } from "../models/testQuiz.model";
import { create } from "node:domain";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { language, NotificationType } from "../utils/enums";
import { SUCCESS } from "../utils/helpers";
import { successMessages } from "../translations/successMessages.translations";
import UserResponseModel from "../models/userAnswer.model";
import { sendNotificationToAllUsers } from "../utils/notification.helper";
import { not } from "joi";

// ✅ Create Quiz/Test
export const createQuizTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, grade, subject, type, time, numberOfQuestions, questions } = req.body as QuizTestDocument;
    const language = req.language || "en"
    // Ensure numberOfQuestions matches questions length
    if (questions.length !== numberOfQuestions) {
      return next(new ErrorHandler(errorMessages[language].NUMBEROFQUESTIONSNOTMACTHED, 400))
    }

    const quizTest = new QuizTestModel({ name, description, grade, subject, type, time, numberOfQuestions, questions });
    await quizTest.save();
    await sendNotificationToAllUsers({
      title: "New Quiz/Test Available!",
      description: `A new ${quizTest.name} quiz/test has been added. Test your knowledge now!`,
      type: NotificationType.QUIZ,
      data: { quizTest },
    });
    SUCCESS(res, 200, successMessages[language].TEST_QUIZ_CREATED, { quizTest })
  } catch (error) {
    next(error);
  }
};


export const getFilteredQuizTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { grade, subject, type, search, page = "1", limit = "10" } = req.query;
    const language = req.language || "en";
console.log("language",language)
    const userId = req.user?._id;
    const filter: any = {};

    if (grade) filter.grade = grade;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    const totalCount = await QuizTestModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    // 1️⃣ Fetch quizzes
    const quizzes = await QuizTestModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .select({
        _id: 1,
        name: 1,
        time: 1,
        description: 1,
        grade: 1,
        subject: 1,
        type: 1,
        questions: 1,
      });

    const quizIds = quizzes.map((q) => q._id);

    // 2️⃣ Fetch user responses (include answers!)
    const userResponses = await UserResponseModel.find({
      quizId: { $in: quizIds },
      userId,
    }).select({
      quizId: 1,
      status: 1,
      points: 1,
      correctCount: 1,
      incorrectCount: 1,
      timeTaken: 1,
      createdAt: 1,
      answers: 1,
    });

    // 3️⃣ Map quizId → response
    const responseMap = new Map(
      userResponses.map((r) => [r.quizId.toString(), r])
    );

    // 4️⃣ Attach mapped questions + selectedOption
    const quizzesWithResponse = quizzes.map((quiz) => {
      const quizObj = quiz.toObject();
      const response = responseMap.get(quiz._id.toString());

      const mappedQuestions = quizObj.questions?.map((q: any) => {
        const userAnswer = response?.answers?.find(
          (a: any) => a?.questionId.toString() === q._id.toString()
        );

        const selectedOption =
          q.options?.find(
            (opt: any) =>
              opt._id.toString() === userAnswer?.selectedOptionId?.toString()
          ) || null;

        return {
          _id: q._id,
          question: q.question,
          answer: q.answer, // or q.correctAnswer text depending on schema
          options: q.options?.map((opt: any) => ({
            _id: opt._id,
            text: opt.text,
          })),
          selectedOption: selectedOption
            ? { _id: selectedOption._id, text: selectedOption.text }
            : null,
        };
      });

      return {
        ...quizObj,
        questions: mappedQuestions,
        userResponse: response ? response.toObject() : null,
      };
    });

    SUCCESS(res, 200, successMessages[language].QUIZZES_FETCHED, {
      quizzes: quizzesWithResponse,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalCount,
        pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
// export const getQuizTestById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const quiz = await QuizTestModel.findById(req.params.id);
//     const language = req.language || "en"
//     if (!quiz) {
//       return next(
//         new ErrorHandler(errorMessages[language].NOT_FOUND("Quiz/Test"), 404)
//       )
//     }
//     SUCCESS(res,200,successMessages[language].QUIZ_FETCHED,{quiz})

//     res.json(quiz);
//   } catch (error) {
//     next(error);
//   }
// };


// export const getQuizTestById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const quizId = req.params.id;
//     const userId = req.user?.id; // Assuming user ID comes from authentication middleware
//     const language = req.language || "en";

//     // Fetch the quiz
//     const quiz:any = await QuizTestModel.findById(quizId);

//     if (!quiz) {
//       return next(
//         new ErrorHandler(errorMessages[language].NOT_FOUND("Quiz/Test"), 404)
//       );
//     }

//     let userResponse = null;

//     // If user is authenticated, fetch their response for this quiz
//     if (userId) {
//       userResponse = await UserResponseModel.findOne({
//         userId: userId,
//         quizId: quizId
//       });
//     }

//     // Transform quiz data to include userSelectedOptionId
//     const transformedQuiz = {
//       ...quiz.toObject(),
//       questions: quiz.questions.map((question) => {
//         // Find user's answer for this question
//         const userAnswer = userResponse?.answers.find(
//           (answer) => answer.questionId.toString() === question._id.toString()
//         );

//         return {
//           ...question.toObject(),
//           options: question.options.map((option) => ({
//             ...option.toObject(),
//             userSelectedOptionId: userAnswer && 
//               userAnswer.selectedOptionId.toString() === option._id.toString() 
//               ? option._id.toString() 
//               : null
//           }))
//         };
//       })
//     };

//     SUCCESS(res, 200, successMessages[language].QUIZ_FETCHED, {
//       quiz: transformedQuiz
//     });

//   } catch (error) {
//     next(error);
//   }
// };




export const getQuizTestById = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Fetching quiz/test by ID:", req.params.id);
  try {
    const quiz: any = await QuizTestModel.findById(req.params.id);
    const language = req.language || "en";
    console.log("Quiz found:", language);

    if (!quiz) {
      console.log("Quiz not found for ID:", req.params.id);
      return next(
        new ErrorHandler(errorMessages[language].NOT_FOUND("Quiz/Test"), 404)
      );
    }

    // Check if the user has already submitted answers for this quiz
    const userId = req.user?._id; // assuming auth middleware sets req.user
    let userAnswersMap = new Map<string, string>(); // questionId -> selectedOptionId
    let responseData = null
    if (userId) {
      const userResponse = await UserResponseModel.findOne({
        userId,
        quizId: quiz._id,
      });

      if (userResponse) {
        responseData = userResponse
        console.log("User has previous responses:", userResponse);
        userResponse.answers.forEach(ans => {
          userAnswersMap.set(ans?.questionId.toString(), ans?.selectedOptionId?.toString());
        });
      }
    }

    // Build quiz object with userSelectedOptionId for each question
    const quizWithUserSelections = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        ...q.toObject(),
        userSelectedOptionId: userAnswersMap.get(q._id.toString()) || null
      })),
    };

    SUCCESS(res, 200, successMessages[language].QUIZ_FETCHED, {
      quiz: quizWithUserSelections,
      responseData
    });
  } catch (error) {
    next(error);
  }
};







export const updateQuizTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.questions && updateData.numberOfQuestions && updateData.questions.length !== updateData.numberOfQuestions) {
      return res.status(400).json({
        message: "numberOfQuestions does not match the length of questions array",
      });
    }

    const updatedQuiz = await QuizTestModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz/Test not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    next(error);
  }
};


export const deleteQuizTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await QuizTestModel.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz/Test not found" });
    }

    res.json({ message: "Quiz/Test deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export default {
  createQuizTest,
  getQuizTestById,
  getFilteredQuizTests,
  updateQuizTest,
  deleteQuizTest
}