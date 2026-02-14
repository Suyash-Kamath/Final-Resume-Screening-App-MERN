const express = require("express");
const authRoutes = require("./authRoutes");
const resumeRoutes = require("./resumeRoutes");
const reportRoutes = require("./reportRoutes");
const healthRoutes = require("./healthRoutes");

const router = express.Router();

router.use(authRoutes);
router.use(resumeRoutes);
router.use(reportRoutes);
router.use(healthRoutes);

module.exports = router;
