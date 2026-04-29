import nodemailer from "nodemailer";
import axios from "axios";

export const sendEmail = async ({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Use Resend HTTP API if key is available (works on Render — no SMTP port blocking)
  if (RESEND_API_KEY) {
    const senderEmail = process.env.SMTP_USER || "noreply@kururent.et";
    const fromAddress = from || `Kuru Rent <onboarding@resend.dev>`;

    await axios.post(
      "https://api.resend.com/emails",
      { from: fromAddress, to, subject, html },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    return;
  }

  // Fallback: nodemailer SMTP (works locally, may be blocked on some cloud hosts)
  const senderEmail = process.env.SMTP_USER;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  } as any);

  await transporter.sendMail({
    from: from || `"Kuru Rent" <${senderEmail}>`,
    to,
    subject,
    html,
  });
};
