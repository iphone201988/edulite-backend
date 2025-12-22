import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import QuizTestModel from "../models/testQuiz.model";
import { SUCCESS } from "../utils/helpers";
import { successMessages } from "../translations/successMessages.translations";
import { userData } from "../services/user.service";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { AccountStatus } from "../utils/enums";
import { ReadingModel } from "../models/reading.model";
import creativeProjectProjectModel from "../models/creativeProject.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Run all count queries in parallel for better performance
    const [totalUsers, totalQuizTests, totalTests, totalQuizzes,totalReadings,totalProjects] = 
      await Promise.all([
        User.countDocuments({ isDeleted: false }),
        QuizTestModel.countDocuments(),
        QuizTestModel.countDocuments({ type: "test" }),
        QuizTestModel.countDocuments({ type: "quiz" }),
        ReadingModel.countDocuments(),
        creativeProjectProjectModel.countDocuments()
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalQuizTests,
        totalTests,
        totalQuizzes,
        totalReadings,
        totalProjects
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};


export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { page = 1, limit = 10, status, search, role } = req.query;
        const language = req.language || "en";

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const filter: any = { isDeleted: false };

        // Filter by status
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Filter by role
        if (role) {
            filter.role = parseInt(role as string);
        }

        // Search by name or email
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const totalCount = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select('-password -otp -otpExpiry -jti')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        console.log("user....................",users)

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalCount,
            pageSize: limitNum,
            hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
            hasPrevPage: pageNum > 1
        };

        SUCCESS(res, 200,  "Users fetched successfully", {
            users: users.map(user => userData(user)),
            pagination
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const language = req.language || "en";

        const user = await User.findOne({ _id: id, isDeleted: false })
            .select('-password -otp -otpExpiry -jti');

        if (!user) {
            return next(new ErrorHandler(errorMessages[language].NOT_FOUND("User"), 404));
        }

        SUCCESS(res, 200, successMessages[language].USER_FETCHED || "User fetched successfully", {
            user: userData(user)
        });
    } catch (error) {
        next(error);
    }
};

// Update user by admin
export const updateUserByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            countryCode,
            bio,
            dob,
            preferredLanguage,
            status,
            role,
            profilePicture,
            address
        } = req.body;
        const language = req.language || "en";

        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return next(new ErrorHandler(errorMessages[language].NOT_FOUND("User"), 404));
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ 
                email: email.toLowerCase().trim(), 
                _id: { $ne: id },
                isDeleted: false 
            });
            
            if (existingUser) {
                return next(new ErrorHandler(errorMessages[language].ALREADY_EXISTS("Email"), 409));
            }
            user.email = email.toLowerCase().trim();
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (countryCode !== undefined) user.countryCode = countryCode;
        if (bio !== undefined) user.bio = bio;
        if (dob !== undefined) user.dob = new Date(dob);
        if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
        if (status !== undefined) user.status = status;
        if (role !== undefined) user.role = role;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        if (address !== undefined) user.address = address;

        await user.save();

        SUCCESS(res, 200, successMessages[language].USER_UPDATED || "User updated successfully", {
            user: userData(user)
        });
    } catch (error) {
        next(error);
    }
};

// Change user status (activate/block/suspend)
export const changeUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const language = req.language || "en";

        if (!Object.values(AccountStatus).includes(status)) {
            return next(new ErrorHandler(errorMessages[language].INVALID("Status"), 400));
        }

        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return next(new ErrorHandler(errorMessages[language].NOT_FOUND("User"), 404));
        }

        user.status = status;
        await user.save();

        const statusMessage = status === AccountStatus.ACTIVE 
            ? "User activated successfully"
            : status === AccountStatus.SUSPENDED 
            ? "User blocked successfully"
            : "User suspended successfully";

        SUCCESS(res, 200,  statusMessage, {
            user: userData(user)
        });
    } catch (error) {
        next(error);
    }
};

// Delete user (soft delete)
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const language = req.language || "en";

        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return next(new ErrorHandler(errorMessages[language].NOT_FOUND("User"), 404));
        }

        // Soft delete
        user.isDeleted = true;
        await user.save();

        // Or hard delete
        // await User.findByIdAndDelete(id);

        SUCCESS(res, 200, successMessages[language].USER_DELETED_SUCCESS, {
            deletedUser: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const language = req.language || "en";

        const [totalUsers, activeUsers, blockedUsers, pendingUsers, suspendedUsers] = await Promise.all([
            User.countDocuments({ isDeleted: false }),
            User.countDocuments({ status: AccountStatus.ACTIVE, isDeleted: false }),
            User.countDocuments({ status: AccountStatus.SUSPENDED, isDeleted: false }),
            User.countDocuments({ status: AccountStatus.PENDING, isDeleted: false }),
            User.countDocuments({ status: AccountStatus.SUSPENDED, isDeleted: false })
        ]);

        SUCCESS(res, 200, successMessages[language].STATS_FETCHED || "Stats fetched successfully", {
            stats: {
                total: totalUsers,
                active: activeUsers,
                blocked: blockedUsers,
                pending: pendingUsers,
                suspended: suspendedUsers
            }
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    changeUserStatus,
    deleteUser,
    getUserStats
}
