import nodemailer from "nodemailer";

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
  const senderEmail = process.env.SMTP_USER;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
    socketTimeout: 15000,
  } as any);

  const mailOptions = {
    from: from || `"Kuru Rent" <${senderEmail}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
