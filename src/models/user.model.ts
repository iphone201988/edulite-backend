import { Schema, model } from "mongoose";
import { AccountStatus, deviceType, SocialLoginType } from "../utils/enums";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>(
  {
    phone:{type:String,default:""},
    countryCode:{type:String,default:""},
    profilePicture: { type: String , default:"" },
    isEmailVerified: { type: Boolean, default: false },
    socialLinkedAccounts: [{ provider: { type: Number, enum: [SocialLoginType.APPLE, SocialLoginType.GOOGLE] }, id: { type: String } }],
    email: { type: String },
    password: { type: String },
    language: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],           // [lng, lat]
      }
    },
    address: {
      type: String
    },
    bio: { type: String },
    lastOtpSentAt: { type: Date },
    deviceToken: { type: String },
    deviceType: { type: Number, enum: [deviceType.WEB, deviceType.ANDROID, deviceType.IOS] },
    jti: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
    stripeId: { type: String },
    subscriptionId: {
      type: String,
      ref: 'Subscription',
    },
    name: {
      type: String,
    },
    // lastName: {
    //   type: String,
    // },
    preferredLanguage: {
      type: String
    },
    dob: { type: Date },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: "pending",
    },
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });
const User = model<IUser>("User", userSchema);

export default User;
