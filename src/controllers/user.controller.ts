import { NextFunction, Request, Response } from "express";
import { findUserByEmail, findUserBySocialId, userData } from "../services/user.service";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { comparePassword, generateOtp, hashPassword, sendEmail, sendLocalizedEmail, signToken, SUCCESS } from "../utils/helpers";
import User from "../models/user.model";
import { successMessages } from "../translations/successMessages.translations";
import { AccountStatus, roleType } from "../utils/enums";
import { IUser } from "../types/user.types";



const socialLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { socialId, provider, email, deviceToken, deviceType } = req.body;
        let user = await findUserBySocialId(socialId, provider);
        const language = "English"
        const lowercaseEmail = email?.toLowerCase();
        if (!user) {
            user = await findUserByEmail(lowercaseEmail);


            if (user) {
                user.socialLinkedAccounts.push({ provider, id: socialId });
            } else {
                user = new User({
                    email: lowercaseEmail,
                    socialLinkedAccounts: [{ provider, id: socialId }],
                    deviceToken,
                    deviceType,
                });
            }

        }
        user.deviceToken = deviceToken ?? null;
        user.deviceType = deviceType ?? null;
        

        await user.save();

        const token = signToken({ id: user._id});
        SUCCESS(res, 200, successMessages[language].LOGIN_SUCCESS, {
            user: userData(user),
            token,
        });
    } catch (error) {
        console.log("error in socialLogin", error);
        next(error);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { name, dob, email, password, deviceToken, deviceType, language = "en", role, phone,countryCode} = req.body;
        const lowercaseEmail = email?.toLowerCase().trim();
        const existingUser = await findUserByEmail(lowercaseEmail);

        if (existingUser && existingUser.isEmailVerified) {
            return next(
                new ErrorHandler(
                    errorMessages[language].ALREADY_EXISTS("User"),
                    400
                )
            );
        }

        const [hashedPassword, otp] = await Promise.all([
            hashPassword(password),
            Promise.resolve(generateOtp(4)),
        ]);

        // const jti = generateRandomString(10);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        let user: any;
        try {


            if (existingUser && !existingUser.isEmailVerified) {
                Object.assign(existingUser, {
                    role,
                    name,
                    // lastName,
                    dob: new Date(dob),
                    countryCode,
                    phone,
                    password: hashedPassword,
                    email: lowercaseEmail,
                    otp,
                    otpExpiry,
                    otpVerified: false,
                    updatedAt: new Date(),
                    deviceToken, deviceType
                });
                user = await existingUser.save();
            } else {

                user = await User.create({
                    countryCode,
                    phone,
                    role,
                    name,
                    // lastName,
                    email: lowercaseEmail,
                    dob: new Date(dob),
                    // countryCode,
                    // phoneNumber,
                    password: hashedPassword,
                    otp,
                    otpExpiry,
                    otpVerified: false,
                    deviceToken, deviceType
                });
            }
        } catch (dbError: any) {
            console.log(dbError)
            if (dbError.code === 11000) {
                return next(
                    new ErrorHandler(
                        errorMessages[language].ALREADY_EXISTS("Email"),
                        400
                    )
                );
            }
            return next(
                new ErrorHandler(
                    errorMessages[language].INTERNAL_SERVER_ERROR,
                    400
                )
            );
        }

        await sendLocalizedEmail(email, otp, "verify", language)
        // await sendEmail({    
        //     userEmail: lowercaseEmail,
        //     subject: 'Verify Your Account',
        //     text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        //     html: verifyOTPTemplate(otp),
        // });


        SUCCESS(res, 201, successMessages[language].OTP_SENT, {
            user: userData(user),
        }, language);
    } catch (error) {
        console.log(error)
        next(error);
    }
};


const verifyUserEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, otp, type, language = "en" } = req.body; // type can be  1 : 'email' or  2  : 'forgetPassword'

        const normalizedEmail = email.toLowerCase().trim();

        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            throw new ErrorHandler(
                errorMessages[language].NOT_FOUND("User"),
                404
            )
        }

        if (user.isEmailVerified && (type === 1 || type=="1")) {
            return SUCCESS(res, 200, successMessages[language].EMAIL_ALREADY_VERIFIED,
                { user: userData(user) });
        }
        console.log(user?.otp, "expiry...", user?.otpExpiry)
        if (user.otp !== otp) {
            console.log("otp", otp, "userotp..", user.otp)
            console.log("a")
        }
        if (!user.otpExpiry) {
            console.log("b")
        }
        if (user.otpExpiry < new Date()) {
            console.log("c")
        }
        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            throw new ErrorHandler(
                errorMessages[language].INVALID("OTP"),
                400
            )
        }

        if (type === 1 || type=="1") {
            user.isEmailVerified = true;
        }
        user.otp = null;
        user.otpExpiry = null;
        user.otpVerified = true;
        user.status = AccountStatus.ACTIVE

        await user.save();
        let token: string;
        token = signToken({ id: user._id });
        const message =
            type === 1
                ? successMessages[language].EMAIL_VERIFIED
                : successMessages[language].OTP_VERIFIED;

        return SUCCESS(res, 200, message, {
            user: userData(user, token),
            // token,
        });
    } catch (error) {
        next(error);
    }
}


const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { email, password, deviceType, deviceToken, language = "en" } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            throw new ErrorHandler(
                errorMessages[language].NOT_FOUND("Email"),
                404
            );
        }

        if (user.status === AccountStatus.SUSPENDED) {
            throw new ErrorHandler(
                errorMessages[language].ACCOUNT_SUSPENDED || "Your account is suspended",
                403
            );
        }

        // you can also block other statuses:
        // if (user.accountStatus === AccountStatus.REJECTED) { ... }
        // if (user.accountStatus === AccountStatus.PENDING) { ... }

        if (user.password === null || user.password === undefined) {
            throw new ErrorHandler(
                errorMessages[language].WRONG("Password"),
                400
            );
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new ErrorHandler(
                errorMessages[language].WRONG("Password"),
                400
            );
        }

        if (!user.isEmailVerified) {
            const otp = await generateOtp(4);
            await sendLocalizedEmail(email, otp, "verify", language);

            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();

            return SUCCESS(
                res,
                200,
                successMessages[language].OTP_SENT,
                {
                    user: userData(user),
                    // token
                }
            );
        }

        const token = signToken({ id: user._id, role: user.role });

        await User.findByIdAndUpdate(user._id, {
            deviceToken,
            deviceType,
        });

        return SUCCESS(
            res,
            200,
            successMessages[language].USER_LOGIN,
            {
                user: userData(user, token),
                // token
            }
        );
    } catch (error) {
        next(error);
    }
};




export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req;
        const { name, dob, bio, preferredLanguage, location, address, profilePicture } = req.body;
        const user: IUser = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        if (name !== undefined) user.name = name;
        // if (lastName !== undefined) user.lastName = lastName;
        if (dob !== undefined) user.dob = new Date(dob);
        if (bio !== undefined) user.bio = bio;
        if (address !== undefined) user.address = address;
        if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
        if (profilePicture !== undefined) user.profilePicture = profilePicture
        if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
            user.location = {
                type: "Point",
                coordinates: [location.longitude, location.latitude], // GeoJSON expects [lng, lat]
            };
        }

        await user.save();

        const language = user.preferredLanguage || "en";
        return SUCCESS(res, 201, successMessages[language].PROFILE_UPDATED, { user: userData(user) });

    } catch (error) {
        next(error);
    }
};



const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const language = req.language || "en"
    try {
        const userId = req.user?._id;
        const { oldPassword, newPassword } = req.body;


        const user = await User.findById(userId);
        const isOldPasswordCorrect = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordCorrect) {

            throw new ErrorHandler(
                errorMessages[language].WRONG("Password"),
                400
            )
        }

        const isSameAsPrevious = await comparePassword(newPassword, user.password);
        if (isSameAsPrevious) {
            throw new ErrorHandler(
                errorMessages[language].NEW_PASSWORD_SAME,
                400
            )
        }

        const newHashedPassword = await hashPassword(newPassword);
        user.password = newHashedPassword;
        await user.save();

        return SUCCESS(res, 200, successMessages[language].PASSWORD_CHANGED, {
            user: userData(user)
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const language = req.body.language || "en";
    try {
        const { email, newPassword } = req.body;

        // Find user by email
        const user = await findUserByEmail(email);
        if (!user || !user.isEmailVerified) {
            throw new ErrorHandler(
                errorMessages[language].userNotExistOrEmailNotVerified,
                400
            );
        }

        // Ensure OTP is verified
        if (!user.otpVerified) {
            throw new ErrorHandler(
                errorMessages[language].OTP_NOT_VERIFIED,
                400
            );
        }

        // Prevent using the same password
        const isSamePassword = await comparePassword(newPassword, user.password);
        if (isSamePassword) {
            throw new ErrorHandler(
                errorMessages[language].NEW_PASSWORD_SAME,
                400
            );
        }

        // Hash and update password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        console.log("lan...", language)
        console.log("aaaaaa...", successMessages[language].PASSWORD_CHANGED)
        return SUCCESS(
            res,
            200,
            successMessages[language].PASSWORD_CHANGED,
            { user: userData(user) }
        );

    } catch (error) {
        next(error);
    }
};



const forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, language = "en" } = req.body;

        const user = await findUserByEmail(email);
        if (!user || !user.isEmailVerified) {
            throw new ErrorHandler(
                errorMessages[language].userNotExistOrEmailNotVerified,
                400
            )
        }

        const otp = generateOtp(4);
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otpVerified = false;
        await user.save();

        await sendLocalizedEmail(email, otp, "forgot", language)

        return SUCCESS(res, 201, successMessages[language].OTPSENTFORPASSWORDRESET);
    } catch (error) {
        next(error);
    }
}



const accountLogout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.userId;
        const language = req.language || "en"
        const user = await User.findById(userId);

        if (!user) {
            throw new ErrorHandler(errorMessages[language].userNotExistOrEmailNotVerified, 404);
        }

        user.deviceToken = null;
        user.deviceType = null;
        // user.isSocialLogin = false;


        await user.save();

        return SUCCESS(res, 200, successMessages[language].USER_LOGOUT_SUCCESS, {});
    } catch (error) {
        next(error);
    }
}



const accountDelete = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const language = req.language || "en"
        await User.findByIdAndDelete(req.user._id);
        return SUCCESS(res, 200, successMessages[language].USER_DELETED_SUCCESS, {});
    } catch (error) {
        next(error);
    }
}


// const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email } = req.body
//         const user = await findUserByEmail(email)
//         if (!user) {
//             throw new ErrorHandler("User not Found", 400);
//         }
//         const otp = generateOtp(4);
//         user.otp = otp;
//         user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//         user.otpVerified = false;
//         await user.save();
//         await sendEmail({
//             userEmail: email,
//             subject: "Password Reset OTP Verification sent to your email",
//             text: "",
//             html: forgetPasswordTempla(otp),
//         });
//         return SUCCESS(res, 200, "OTP sent to your email", {
//             user: userData(user)
//         });
//     }
//     catch (error) {
//         next(error);
//     }
// }


export default {
    register,
    verifyUserEmail,
    loginUser,
    updateProfile,
    changePassword,
    resetPassword,
    forgetPassword,
    accountLogout,
    accountDelete,
    socialLogin
}