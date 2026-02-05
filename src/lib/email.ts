import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInvitationEmail(
  email: string,
  teamName: string,
  link: string,
  inviterName: string
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not set. Email simulation:");
    console.log(`To: ${email}`);
    console.log(`Subject: Join ${teamName} on FlowForge`);
    console.log(`Link: ${link}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"FlowForge" <noreply@flowforge.com>',
    to: email,
    subject: `Join ${teamName} on FlowForge`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited!</h2>
        <p><strong>${inviterName}</strong> has invited you to join the <strong>${teamName}</strong> workspace on FlowForge.</p>
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
