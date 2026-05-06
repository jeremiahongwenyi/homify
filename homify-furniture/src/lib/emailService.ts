// src/lib/emailService.ts

import nodemailer from "nodemailer";
import {
  customOrderUnderReviewTemplate,
  customOrderVerificationTemplate,
  verifiedOrderOwnerNotificationTemplate,
} from "@/templates/orderConfirmation";
// import { welcomeTemplate } from "@/templates/welcome";

type VerifyCustomOrderEmail = {
  email: string;
  name: string;
  orderId: string;
  verificationUrl: string;
};

type CustomOrderUnderReviewEmail = {
  email: string;
  name: string;
  orderId: string;
  trackingUrl: string;
};

type VerifiedOrderOwnerNotification = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  category?: string | null;
  dashboardUrl?: string;
};

const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
const smtpRejectUnauthorized = process.env.SMTP_REJECT_UNAUTHORIZED !== "false";

if (!smtpRejectUnauthorized) {
  console.warn(
    "[emailService] WARNING: SMTP_REJECT_UNAUTHORIZED=false. TLS certificate verification is disabled. Use only in local/dev.",
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  tls: {
    rejectUnauthorized: smtpRejectUnauthorized,
  },
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const send = async (to: string, subject: string, html: string) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};

export const emailService = {
  sendCustomOrderVerification: ({
    email,
    name,
    orderId,
    verificationUrl,
  }: VerifyCustomOrderEmail) => {
    return send(
      email,
      "Verify your email to complete your request",
      customOrderVerificationTemplate({ name, orderId, verificationUrl }),
    );
  },

  sendCustomOrderUnderReview: ({
    email,
    name,
    orderId,
    trackingUrl,
  }: CustomOrderUnderReviewEmail) => {
    return send(
      email,
      "Your request is now under review",
      customOrderUnderReviewTemplate({ name, orderId, trackingUrl }),
    );
  },

  notifyBusinessOwnerOfVerifiedOrder: ({
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    category,
    dashboardUrl,
  }: VerifiedOrderOwnerNotification) => {
    return send(
      process.env.BUSINESS_OWNER_EMAIL || process.env.GMAIL_USER || "",
      "A new verified custom order is ready for review",
      verifiedOrderOwnerNotificationTemplate({
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        category,
        dashboardUrl: dashboardUrl || process.env.BUSINESS_OWNER_DASHBOARD_URL,
      }),
    );
  },

  //   sendWelcomeEmail: (email: string, name: string) => {
  //     return send(
  //       email,
  //       "Welcome 🎉",
  //       welcomeTemplate(name)
  //     );
  //   },

  sendPasswordReset: (email: string, resetLink: string) => {
    return send(
      email,
      "Reset Your Password",
      `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    );
  },
};
