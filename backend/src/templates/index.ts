export const underReviewTemplate = (contactName, companyName, redirectUrl) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Request is Under Review</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f7f8fa;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        padding: 30px;
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #007bff;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      h1 {
        color: #007bff;
        font-size: 24px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .footer {
        margin-top: 25px;
        text-align: center;
        color: #777;
        font-size: 13px;
      }
      .btn {
        display: inline-block;
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border-radius: 6px;
        text-decoration: none;
        margin-top: 20px;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Registration Request Received</h1>
      </div>
      <p>Hi <strong>${contactName}</strong>,</p>
      <p>Thank you for submitting your registration request for <strong>${companyName}</strong>.</p>
      <p>Your request is currently <strong>under review</strong>. Our team will verify your details and contact you once it’s approved.</p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <a class="btn" href="${redirectUrl}">View Request Status</a>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Property Booking Team</p>
      </div>
    </div>
  </body>
  </html>
`;

export const registrationStatusEmailTemplate = (status, name, redirectUrl) => {
  const getMessage = () => {
    if (status === "APPROVED")
      return `
        <h2 style="color:#16a34a;">🎉 Congratulations!</h2>
        <p>Your company registration has been <strong>approved</strong>. You can now log in and start using the Property Booking System.</p>
      `;
    if (status === "REJECTED")
      return `
        <h2 style="color:#dc2626;">😔 Request Rejected</h2>
        <p>Unfortunately, your registration request has been <strong>rejected</strong>. You can contact our support team for more details.</p>
      `;
    return `
        <h2 style="color:#2563eb;">📋 Request Under Review</h2>
        <p>Your registration request is <strong>currently under review</strong>. We’ll notify you once the process is complete.</p>
      `;
  };

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <div style="background-color: #1d4ed8; padding: 20px; color: white; text-align: center;">
      <h1>Property Portal</h1>
    </div>
    <div style="padding: 25px; background-color: #f9fafb;">
      <p>Dear <strong>${name}</strong>,</p>
      ${getMessage()}
      <a class="btn" href="${redirectUrl}">View Request Status</a>
      <p>Thank you for choosing our platform.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>The Property Team</strong></p>
    </div>

    <div style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 13px; color: #6b7280;">
      &copy; ${new Date().getFullYear()} Property Portal. All rights reserved.
    </div>
  </div>
  `;
};

export const resetPasswordTemplate = ({
  otp,
  typeLabel = "password reset",
  expiryMinutes = 10,
  appName = "Solomongetnet",
}) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${appName} — OTP</title>
  <style>
    /* Basic reset for most email clients */
    body,table,td,a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    table { border-collapse:collapse !important; }
    body { margin:0 !important; padding:0 !important; width:100% !important; background-color:#f4f6f8; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }

    /* Container */
    .email-wrapper { width:100%; max-width:680px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }

    /* Header */
    .header { padding:20px 28px; text-align:center; background: linear-gradient(90deg,#0ea5e9 0%, #3b82f6 100%); color:#ffffff; }
    .logo { font-weight:700; font-size:20px; letter-spacing:0.2px; }

    /* Body */
    .body { padding:28px; color:#0f172a; }
    .h1 { font-size:20px; font-weight:700; margin:0 0 8px; color:#0f172a; }
    .p { font-size:15px; line-height:1.5; margin:0 0 18px; color:#334155; }

    /* OTP box */
    .otp-container { display:block; text-align:center; margin:16px auto 18px; }
    .otp { display:inline-block; padding:14px 22px; border-radius:10px; background:#0f172a; color:#fff; font-size:28px; letter-spacing:6px; font-weight:700; }
    .otp-small { display:block; font-size:13px; margin-top:8px; color:#64748b; }

    /* CTA (optional) */
    .cta { display:block; margin:18px 0; text-align:center; }
    .btn { display:inline-block; text-decoration:none; background:#0ea5e9; color:#fff; padding:12px 20px; border-radius:8px; font-weight:600; }

    /* Footer */
    .footer { padding:18px 28px; font-size:13px; color:#94a3b8; text-align:center; background:#fbfdff; }
    .muted { color:#94a3b8; font-size:13px; margin-top:8px; }

    /* Mobile */
    @media screen and (max-width:480px) {
      .email-wrapper { margin: 12px; width: auto !important; }
      .otp { font-size:22px; padding:12px 16px; letter-spacing:4px; }
    }
  </style>
</head>
<body>
  <center style="width:100%;background-color:#f4f6f8;padding:28px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <div class="email-wrapper" role="article" aria-roledescription="email">
            <!-- Header -->
            <div class="header">
              <div class="logo">${appName}</div>
            </div>

            <!-- Body -->
            <div class="body">
              <div style="text-align:center;">
                <h1 class="h1">Your ${typeLabel} code</h1>
                <p class="p">Use the verification code below to continue. This code is valid for ${expiryMinutes} minutes. If you didn't request this, please ignore this email.</p>

                <div class="otp-container" aria-hidden="true">
                  <div class="otp">${otp}</div>
                  <div class="otp-small">One-time code — do not share with anyone</div>
                </div>

                <!-- Optional CTA: some flows include a "Verify in app" link -->
                <div class="cta">
                  <a href="#" class="btn" target="_blank" rel="noopener noreferrer">Open App to Verify</a>
                </div>

                <p class="p" style="margin-top:8px;">Not working? Copy & paste the code where asked in the app.</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div>If you need help, reply to this email or contact our support.</div>
              <div class="muted">${appName} • This is an automated message — please do not reply directly to this address.</div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`;
