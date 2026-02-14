const { getCollections } = require("../config/db");
const { formatDateWithDay } = require("../utils/date");

async function misSummary(req, res) {
  const { mis } = getCollections();
  const pipeline = [
    {
      $group: {
        _id: "$recruiter_name",
        uploads: { $sum: 1 },
        total_resumes: { $sum: "$total_resumes" },
        shortlisted: { $sum: "$shortlisted" },
        rejected: { $sum: "$rejected" },
        history: { $push: "$history" },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const summary = await mis.aggregate(pipeline).toArray();
  const formattedSummary = summary.map((row) => ({
    recruiter_name: row._id,
    uploads: row.uploads,
    resumes: row.total_resumes,
    shortlisted: row.shortlisted,
    rejected: row.rejected,
    history: row.history.flat(),
  }));

  const allRecords = await mis.find({}).sort({ timestamp: -1 }).toArray();
  const recruiterHistory = {};
  for (const record of allRecords) {
    const recruiter = record.recruiter_name;
    if (!recruiterHistory[recruiter]) recruiterHistory[recruiter] = [];
    for (const item of record.history || []) {
      recruiterHistory[recruiter].push(item);
    }
  }

  for (const summaryItem of formattedSummary) {
    const recruiter = summaryItem.recruiter_name;
    const flatHistory = recruiterHistory[recruiter] || [];
    const dailyCounts = {};
    for (const item of flatHistory) {
      const uploadDate = item.upload_date || "";
      if (uploadDate) {
        const datePart = uploadDate.includes(",") ? uploadDate.split(",")[0] : uploadDate;
        dailyCounts[datePart] = (dailyCounts[datePart] || 0) + 1;
      }
    }
    for (const item of flatHistory) {
      const uploadDate = item.upload_date || "";
      if (uploadDate) {
        const datePart = uploadDate.includes(",") ? uploadDate.split(",")[0] : uploadDate;
        item.counts_per_day = dailyCounts[datePart] || 0;
      } else {
        item.counts_per_day = 0;
      }
    }
    summaryItem.history = flatHistory;
  }

  return res.json({ summary: formattedSummary });
}

async function dailyReports(req, res) {
  const { mis } = getCollections();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const pipeline = [
    { $match: { timestamp: { $gte: today, $lt: tomorrow } } },
    {
      $group: {
        _id: "$recruiter_name",
        total_resumes: { $sum: "$total_resumes" },
        shortlisted: { $sum: "$shortlisted" },
        rejected: { $sum: "$rejected" },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const dailyData = await mis.aggregate(pipeline).toArray();
  const todayFormatted = formatDateWithDay(today);
  return res.json({
    date: todayFormatted,
    reports: dailyData.map((row) => ({
      recruiter_name: row._id,
      total_resumes: row.total_resumes,
      shortlisted: row.shortlisted,
      rejected: row.rejected,
    })),
  });
}

async function previousDayReports(req, res) {
  const { mis } = getCollections();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const pipeline = [
    { $match: { timestamp: { $gte: yesterday, $lt: today } } },
    {
      $group: {
        _id: "$recruiter_name",
        total_resumes: { $sum: "$total_resumes" },
        shortlisted: { $sum: "$shortlisted" },
        rejected: { $sum: "$rejected" },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const previousDayData = await mis.aggregate(pipeline).toArray();
  const yesterdayFormatted = formatDateWithDay(yesterday);
  return res.json({
    date: yesterdayFormatted,
    reports: previousDayData.map((row) => ({
      recruiter_name: row._id,
      total_resumes: row.total_resumes,
      shortlisted: row.shortlisted,
      rejected: row.rejected,
    })),
  });
}

async function getReportsByDate(req, res) {
  const { mis } = getCollections();
  const dateType = req.params.date_type;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let startDate;
  let endDate;
  if (dateType === "today") {
    startDate = today;
    endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  } else if (dateType === "yesterday") {
    startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    endDate = today;
  } else {
    const parsed = new Date(`${dateType}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ detail: "Invalid date format. Use 'today', 'yesterday', or YYYY-MM-DD" });
    }
    startDate = parsed;
    endDate = new Date(parsed.getTime() + 24 * 60 * 60 * 1000);
  }

  const pipeline = [
    { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: "$recruiter_name",
        total_resumes: { $sum: "$total_resumes" },
        shortlisted: { $sum: "$shortlisted" },
        rejected: { $sum: "$rejected" },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const reportData = await mis.aggregate(pipeline).toArray();
  const dateFormatted = formatDateWithDay(startDate);
  return res.json({
    date: dateFormatted,
    date_type: dateType,
    reports: reportData.map((row) => ({
      recruiter_name: row._id,
      total_resumes: row.total_resumes,
      shortlisted: row.shortlisted,
      rejected: row.rejected,
    })),
  });
}

module.exports = {
  misSummary,
  dailyReports,
  previousDayReports,
  getReportsByDate,
};
