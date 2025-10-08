import { Document } from "mongoose";

export interface ISocialLinkedAccount {
    provider: 1 | 2 | 3;
    id: string;
}

export interface IUser extends Document {
    phone?:string;
    countryCode?:string;
    profilePicture?:string;
    status?: string;
    address:string,
    name?: string;
    // lastName?: string
    dob?: Date;
    isEmailVerified?: boolean;
    role?: number;
    lastOtpSentAt?: Date;
    preferredLanguage?: string
    bio?: string;
    socialLinkedAccounts?: ISocialLinkedAccount[];
    email?: string;
    password?: string;
    language?: string;
    location?: {
        type: "Point";
        coordinates: [number, number];
    };
    stripeId?: string,
    deviceToken?: string;
    deviceType?: 1;
    jti?: string;
    otp?: string;
    otpExpiry?: Date;
    otpVerified?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    subscriptionId?: string;
    matchPassword(password: string): Promise<boolean>;
}