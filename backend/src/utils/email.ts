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
  const transporter = nodemailer.createTransport({
    service: "gmail", // you can use any (e.g., smtp.mailtrap.io for dev)
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // app password or mailtrap credentials
    },
  });

  const mailOptions = {
    from: `"Property Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
