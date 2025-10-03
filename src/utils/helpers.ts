import { NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";
import { Response } from "express";
import nodemailer from 'nodemailer';
import { Language } from "../translations/successMessages.translations";
import { emailTexts } from "../translations/emailText";

export const connectToDB = () => mongoose.connect(process.env.MONGO_URI);

export const TryCatch =
  (func: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch(next);

export const generateJwtToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};
type ResponseData = Record<string, any>;

export const SUCCESS = (
  res: Response,
  status: number,
  message: string,
  data?: ResponseData,
  lang: Language = "en"
) => {
  // console.log(key)
  return res.status(status).json({
    success: true,
    message,
    ...(data ? data : {}),
  });
};

export const generateOtp = (length: number): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString(); // Random digit between 0 and 9
  }
  return otp;
};

export interface IsendEmail {
  userEmail: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
export const sendEmail = async ({ userEmail, subject, text, html }: IsendEmail) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: userEmail,
    subject: subject,
    text: text,
    html: html
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
        reject(error);
      } else {
    
        console.log(`Email sent: ${info.response}`);
        resolve(info.response);
      }
    });
  });
}
export const sendLocalizedEmail = async (
  userEmail: string,
  otp: string,
  type: "verify" | "forgot" | "update",
  lang: Language = "en"
) => {
  const t = emailTexts[lang];

  let subject: string;
  let text: string;
  let html: string;

  switch (type) {
    case "verify":
      subject = t.verifySubject;
      text = `${t.verifyIntro}\nOTP: ${otp}\n${t.verifyExpiry}`;
      html = `
        <div>
          <h2>${t.verifyTitle}</h2>
          <p>${t.verifyIntro}</p>
          <div style="font-weight:bold; font-size:24px">${otp}</div>
          <p>${t.verifyExpiry}</p>
          <p>${t.footer}</p>
        </div>
      `;
      break;

    case "forgot":
      subject = t.forgotSubject;
      text = `${t.forgotIntro}\nOTP: ${otp}\n${t.forgotExpiry}`;
      html = `
        <div>
          <h2>${t.forgotTitle}</h2>
          <p>${t.forgotIntro}</p>
          <div style="font-weight:bold; font-size:24px">${otp}</div>
          <p>${t.forgotExpiry}</p>
          <p>${t.footer}</p>
        </div>
      `;
      break;

    case "update":
      subject = t.updateSubject;
      text = `${t.updateIntro}\nOTP: ${otp}\n${t.updateExpiry}`;
      html = `
        <div>
          <h2>${t.updateTitle}</h2>
          <p>${t.updateIntro}</p>
          <div style="font-weight:bold; font-size:24px">${otp}</div>
          <p>${t.updateExpiry}</p>
          <p>${t.footer}</p>
        </div>
      `;
      break;
  }

  return await sendEmail({ userEmail, subject, text, html });
};



export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);
export const signToken = (payload: any) => jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
export const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string);



