const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.get("/mis-summary", asyncHandler(reportController.misSummary));
router.get("/daily-reports", asyncHandler(reportController.dailyReports));
router.get("/previous-day-reports", asyncHandler(reportController.previousDayReports));
router.get("/reports/:date_type", asyncHandler(reportController.getReportsByDate));

module.exports = router;
