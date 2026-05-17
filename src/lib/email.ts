import nodemailer from "nodemailer";

function createTransporter() {
  const port = parseInt(process.env.SMTP_PORT || "587");
  // port 465 = implicit SSL (secure: true), port 587/25 = STARTTLS (secure: false)
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendResetPasswordEmail(email: string, url: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // Dev fallback: log reset link to console so you can test without SMTP
    console.log("\n[DEV] Password reset link for", email, ":\n", url, "\n");
    return;
  }

  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  console.log(`[email] Connecting to ${process.env.SMTP_HOST || "smtp.gmail.com"}:${port} secure=${secure}`);

  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"FlowGent" <noreply@flowforge.com>',
      to: email,
      subject: "Reset your FlowGent password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 24px; font-size: 14px; color: #666;">
            If you didn't request this, you can safely ignore this email.<br><br>
            Or copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #666;">${url}</a>
          </p>
        </div>
      `,
    });
    console.log("[email] Reset password email sent to", email);
  } catch (err) {
    console.error("[email] Failed to send reset password email to", email, err);
    throw err;
  }
}

export async function sendInvitationEmail(
  email: string,
  teamName: string,
  link: string,
  inviterName: string,
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // SMTP not configured — skip email sending silently
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"FlowGent" <noreply@flowforge.com>',
    to: email,
    subject: `Join ${teamName} on FlowGent`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited!</h2>
        <p><strong>${inviterName}</strong> has invited you to join the <strong>${teamName}</strong> workspace on FlowGent.</p>
        <p>Click the button below to accept the invitation:</p>
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Team</a>
        <p style="margin-top: 24px; font-size: 14px; color: #666;">
          Or copy and paste this link into your browser:<br>
          <a href="${link}" style="color: #666;">${link}</a>
        </p>
      </div>
    `,
  });
}
