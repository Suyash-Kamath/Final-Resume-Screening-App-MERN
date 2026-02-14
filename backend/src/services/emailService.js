const nodemailer = require("nodemailer");
const env = require("../config/env");

async function sendEmail(toEmail, subject, body, isHtml = false) {
  if (!env.EMAIL_USERNAME || !env.EMAIL_PASSWORD) {
    throw new Error("Email configuration not set up properly");
  }
  const transporter = nodemailer.createTransport({
    host: env.SMTP_SERVER,
    port: Number(env.SMTP_PORT),
    secure: false,
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
    to: toEmail,
    subject,
    html: isHtml ? body : undefined,
    text: isHtml ? undefined : body,
  });
}

module.exports = {
  sendEmail,
};
