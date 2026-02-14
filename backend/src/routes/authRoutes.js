const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/register-form", asyncHandler(authController.registerForm));
router.post("/login", asyncHandler(authController.login));
router.post("/forgot-password", asyncHandler(authController.forgotPassword));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.get("/verify-reset-token/:token", asyncHandler(authController.verifyResetTokenEndpoint));
router.delete("/cleanup-expired-tokens", asyncHandler(authController.cleanupExpiredTokens));

module.exports = router;
