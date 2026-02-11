import { createTransport, Transporter, TransportOptions } from "nodemailer";
import { SendEmailOptions } from "../interfaces/index.js";
import Mail from "nodemailer/lib/mailer/index.js";
import { NextFunction } from "express";
import { throwError } from "../utils/error.js";

export const sendEmail = async (
  { email, message, subject }: SendEmailOptions,
  next: NextFunction,
) => {
  // create an email service provider (transporter)
  const transporter: Transporter = createTransport({
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
  });

  // create transportOptions
  const transporterOptions: Mail.Options & Partial<TransportOptions> = {
    from: "Phinehas <phinehasoseitutu@gmail.com>",
    to: email,
    subject,
    text: message,
  };

  console.log(transporterOptions);

  // send email using transporter.sendMail()
  try {
    const results = await transporter.sendMail(transporterOptions);
    console.log("Starting...");
    console.log(results);
  } catch (error) {
    return throwError("Error occurred at the transporter", 500, next);
  }
};
