const dotenv = require("dotenv");

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: (process.env.OPENAI_API_KEY || "").trim(),
  SMTP_SERVER: process.env.SMTP_SERVER,
  SMTP_PORT: process.env.SMTP_PORT,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
};

if (!env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in .env");
}

module.exports = env;
