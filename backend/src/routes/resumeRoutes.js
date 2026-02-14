const express = require("express");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth");
const resumeController = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/analyze-resumes/",
  authMiddleware,
  upload.array("files"),
  asyncHandler(resumeController.analyzeResumes)
);

router.get(
  "/download-resume/:file_id",
  authMiddleware,
  asyncHandler(resumeController.downloadResume)
);

router.get(
  "/view-resume/:file_id",
  authMiddleware,
  asyncHandler(resumeController.viewResume)
);

module.exports = router;
