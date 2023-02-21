"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailLogin = exports.emailSignup = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const template_1 = require("./template");
const email_address = process.env.EMAIL_ADDRESS;
const email_password = process.env.EMAIL_PASSWORD;
const Email = () => nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: email_address,
        pass: email_password,
    }
});
;
const emailSignup = async (data) => {
    const transporter = Email();
    const mailOptions = {
        from: `${email_address} <${email_address}>`,
        to: data.email,
        subject: "Confirm Email",
        html: `
            ${(0, template_1.authTemplate)("Confirm Email", data.url, data.code)}
        `
    };
    await transporter.sendMail(mailOptions);
};
exports.emailSignup = emailSignup;
const emailLogin = async (data) => {
    const transporter = Email();
    const mailOptions = {
        from: `${email_address} <${email_address}>`,
        to: data.email,
        subject: "Magic Link",
        html: `
            ${(0, template_1.authTemplate)("Login now", data.url, data.code)}
        `
    };
    await transporter.sendMail(mailOptions);
};
exports.emailLogin = emailLogin;
