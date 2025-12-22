// controllers/prize.controller.ts
import { Request, Response, NextFunction } from "express";
import Prize, { IPrize } from "../models/prize.model";
import UserPrize from "../models/userPrize.model";
import ErrorHandler from "../utils/errorHandler";
import { SUCCESS } from "../utils/helpers";

// --- Create Prize ---
export const createPrize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, type, image_url, requirement_type, requirement_value } = req.body;
        const prize = await Prize.create({
            name,
            description,
            type,
            image_url,
            requirement_type,
            requirement_value
        });
        return SUCCESS(res, 201, "Prize created successfully", { prize });
    } catch (error) {
        next(error);
    }
};

// --- Get All Prizes ---
export const getPrizes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prizes = await Prize.find().sort({ createdAt: -1 });
        return SUCCESS(res, 200, "Prizes fetched successfully", { prizes });
    } catch (error) {
        next(error);
    }
};

// --- Update Prize ---
export const updatePrize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const prize = await Prize.findByIdAndUpdate(id, updates, { new: true });
        if (!prize) throw new ErrorHandler("Prize not found", 404);
        return SUCCESS(res, 200, "Prize updated successfully", { prize });
    } catch (error) {
        next(error);
    }
};

// --- Delete Prize ---
export const deletePrize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const prize = await Prize.findByIdAndDelete(id);
        if (!prize) throw new ErrorHandler("Prize not found", 404);
        return SUCCESS(res, 200, "Prize deleted successfully", {});
    } catch (error) {
        next(error);
    }
};

// --- Assign Prize to User ---
export const assignPrizeToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, prizeId } = req.body;
        const userPrize = await UserPrize.create({
            user: userId,
            prize: prizeId,
        });
        return SUCCESS(res, 201, "Prize assigned to user", { userPrize });
    } catch (error) {
        next(error);
    }
};

// --- Get Prizes of a User ---
export const getUserPrizes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const prizes = await UserPrize.find({ user: userId }).populate("prize");
        return SUCCESS(res, 200, "User prizes fetched successfully", { prizes });
    } catch (error) {
        next(error);
    }
};


export default {
    createPrize,
    getPrizes,
    updatePrize,
    deletePrize,
    assignPrizeToUser,
    getUserPrizes

}