import UserDailyQuestModel from "../models/userDailyQuest.model";
import UserResponseModel from "../models/userAnswer.model";
import Prize from "../models/prize.model";
import { Types } from "mongoose";

/**
 * Calculate the current streak for a user based on daily quest completion
 * @param userId - The user's ID
 * @returns The current streak count
 */
export const calculateStreak = async (userId: string | Types.ObjectId): Promise<number> => {
    try {
        // Get all completed quests for the user, sorted by completion date (most recent first)
        const completedQuests = await UserDailyQuestModel.find({
            userId,
            status: "completed",
            completedAt: { $exists: true }
        })
            .sort({ completedAt: -1 })
            .lean()
            .exec();

        if (completedQuests.length === 0) {
            return 0;
        }

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset to start of day

        // Check each day backwards from today
        for (let i = 0; i < completedQuests.length; i++) {
            const questCompletedDate = new Date(completedQuests[i].completedAt!);
            questCompletedDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(currentDate);
            expectedDate.setDate(expectedDate.getDate() - streak);

            // Check if there's a quest completed on the expected date
            const hasQuestOnDate = completedQuests.some(quest => {
                const qDate = new Date(quest.completedAt!);
                qDate.setHours(0, 0, 0, 0);
                return qDate.getTime() === expectedDate.getTime();
            });

            if (hasQuestOnDate) {
                streak++;
            } else {
                // Streak is broken
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error("Error calculating streak:", error);
        return 0;
    }
};

/**
 * Calculate total XP earned by a user from quiz/test responses
 * @param userId - The user's ID
 * @returns The total XP (points) earned
 */
export const calculateXP = async (userId: string | Types.ObjectId): Promise<number> => {
    try {
        // Aggregate all points from completed quizzes and tests
        const result = await UserResponseModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalXP: { $sum: "$points" }
                }
            }
        ]);

        return result.length > 0 ? result[0].totalXP : 0;
    } catch (error) {
        console.error("Error calculating XP:", error);
        return 0;
    }
};

/**
 * Calculate badges dynamically based on user achievements
 * Badges are NOT stored in database - they are calculated on-the-fly
 * @param userId - The user's ID
 * @returns Array of earned badges with details
 */
export const calculateBadges = async (userId: string | Types.ObjectId) => {
    try {
        const userObjectId = new Types.ObjectId(userId);

        // Get all available prizes/badges from the Prize collection
        const allPrizes = await Prize.find().lean().exec();

        // Calculate user's current achievements
        const [quizCount, readingCount, projectCount, currentStreak] = await Promise.all([
            // Count completed quizzes
            UserResponseModel.countDocuments({
                userId: userObjectId,
                status: "completed",
                type: "quiz"
            }),
            // Count completed reading quests
            UserDailyQuestModel.countDocuments({
                userId: userObjectId,
                status: "completed",
                type: "questReading"
            }),
            // Count completed projects (if you have a creative project model)
            // For now, we'll use 0 or you can add the actual count
            0,
            // Get current streak
            calculateStreak(userId)
        ]);

        const achievements = {
            quiz_count: quizCount,
            reading_count: readingCount,
            project_count: projectCount,
            streak: currentStreak
        };

        // Dynamically determine which badges the user has earned
        const earnedBadges = allPrizes
            .filter(prize => {
                // Check if user meets the requirement for this badge
                const userAchievement = achievements[prize.requirement_type as keyof typeof achievements];
                return userAchievement >= prize.requirement_value;
            })
            .map(prize => ({
                id: prize._id.toString(),
                name: prize.name,
                description: prize.description,
                type: prize.type,
                image_url: prize.image_url,
                requirement_type: prize.requirement_type,
                requirement_value: prize.requirement_value,
                // Calculate when this badge would have been earned (for display purposes)
                // This is an approximation - you could make this more precise if needed
                earnedAt: new Date() // You can enhance this logic if you want to track when they first qualified
            }));

        return {
            badges: earnedBadges,
            totalBadges: earnedBadges.length,
            // For dynamic calculation, there are no "newly earned" badges
            // since we're not tracking historical state
            newlyEarned: []
        };
    } catch (error) {
        console.error("Error calculating badges:", error);
        return {
            badges: [],
            newlyEarned: [],
            totalBadges: 0
        };
    }
};

/**
 * Get complete profile statistics for a user
 * @param userId - The user's ID
 * @returns Object containing streak, XP, and badges information
 */
export const getProfileStats = async (userId: string | Types.ObjectId) => {
    try {
        const [streak, xp, badgesData] = await Promise.all([
            calculateStreak(userId),
            calculateXP(userId),
            calculateBadges(userId)
        ]);

        return {
            streak,
            xp,
            badges: badgesData.badges,
            newlyEarnedBadges: badgesData.newlyEarned,
            totalBadges: badgesData.totalBadges
        };
    } catch (error) {
        console.error("Error getting profile stats:", error);
        return {
            streak: 0,
            xp: 0,
            badges: [],
            newlyEarnedBadges: [],
            totalBadges: 0
        };
    }
};
