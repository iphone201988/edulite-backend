import { Request, Response, NextFunction } from "express";
import Video from "../models/video.model";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { successMessages } from "../translations/successMessages.translations";
import { SUCCESS } from "../utils/helpers";


export const createVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const language = req.language || "en";

        const {
            title,
            grade,        // ✅ grade string
            subject,
            time,
            videoUrl,
            thumbnailUrl,
        } = req.body;

        const userId = req.user?._id;

        if (!userId) {
            return next(
                new ErrorHandler(errorMessages[language].UNAUTHORIZED, 401)
            );
        }

        const video = await Video.create({
            title,
            userId,
            grade,
            subject,
            time,
            videoUrl,
            thumbnailUrl,
        });

        SUCCESS(res, 201, successMessages[language].VIDEO_CREATED, {
            video,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ✅ Get All Videos (Filter + Pagination)
 */
export const getAllVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const language = req.language || "en";

        const {
            grade,
            subject,
            search,
            page = "1",
            limit = "10",
        } = req.query;

        // 🔹 Base filter
        const filter: any = { isDeleted: false };

        if (grade) filter.grade  = grade;
        if (subject) filter.subject = subject;

        // 🔍 Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ];
        }

        // 🔢 Pagination
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * pageSize;

        const totalCount = await Video.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pageSize);

        const videos = await Video.find(filter)
            // .populate( "grade icon")
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .select({
                title: 1,
                time: 1,
                subject: 1,
                videoUrl: 1,
                thumbnailUrl: 1,
                grade: 1,
                userId: 1,
                createdAt: 1,
            });

        SUCCESS(res, 200, successMessages[language].VIDEOS_FETCHED, {
            videos,
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

/**
 * ✅ Get Video By ID
 */
export const getVideoById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const language = req.language || "en";

        const video = await Video.findOne({
            _id: req.params.id,
            isDeleted: false,
        })
            .populate("gradeId", "grade icon")
            .populate("userId", "name email");

        if (!video) {
            return next(
                new ErrorHandler(errorMessages[language].NOT_FOUND("Video"), 404)
            );
        }

        SUCCESS(res, 200, successMessages[language].VIDEO_FETCHED, {
            video,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ✅ Update Video
 */
export const updateVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const language = req.language || "en";
        const { id } = req.params;

        const updatedVideo = await Video.findOneAndUpdate(
            { _id: id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedVideo) {
            return next(
                new ErrorHandler(errorMessages[language].NOT_FOUND("Video"), 404)
            );
        }

        SUCCESS(res, 200, successMessages[language].VIDEO_UPDATED, {
            video: updatedVideo,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ✅ Delete Video (Soft Delete)
 */
    export const deleteVideo = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const language = req.language || "en";
            const { id } = req.params;

            const video = await Video.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true }
            );

            if (!video) {
                return next(
                    new ErrorHandler(errorMessages[language].NOT_FOUND("Video"), 404)
                );
            }

            SUCCESS(res, 200, successMessages[language].VIDEO_DELETED);
        } catch (error) {
            next(error);
        }
    };
    
export default {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
};
