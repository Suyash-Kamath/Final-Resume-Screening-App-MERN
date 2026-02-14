module.exports = {
  SECRET_KEY: "supersecretkey",
  ALGORITHM: "HS256",
  ACCESS_TOKEN_EXPIRE_MINUTES: 60 * 24 * 7,
  RESET_TOKEN_EXPIRE_MINUTES: 30,
  CORS_ORIGINS: [
    "http://localhost:5173",
    "https://final-resume-screening-app.vercel.app",
    "http://localhost:4173",
    "https://prohire.probusinsurance.com",
  ],
};
