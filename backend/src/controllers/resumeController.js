const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { getCollections } = require("../config/db");
const { uploadToGridFS, openDownloadStream } = require("../services/gridfsService");
const { analyzeResume } = require("../services/analysisService");
const { extractTextFromPdf, extractTextFromDocx, extractTextFromDoc, extractTextFromImage } = require("../utils/textExtract");
const { formatDateWithDay, getHiringTypeLabel, getLevelLabel } = require("../utils/date");
const { validateAnalyzeResumes } = require("../validators/resumeValidators");

async function analyzeResumes(req, res) {
  const files = req.files || [];
  const { isValid, errors } = validateAnalyzeResumes(req.body, files);
  if (!isValid) {
    return res.status(400).json({ detail: errors[0] });
  }

  const { job_description: jobDescription, hiring_type: hiringType, level } = req.body || {};
  const recruiter = req.recruiter;

  const { mis } = getCollections();
  const results = [];
  let shortlisted = 0;
  let rejected = 0;
  const history = [];
  const currentDate = new Date();
  const hiringTypeLabel = getHiringTypeLabel(hiringType);
  const levelLabel = getLevelLabel(level);

  for (const file of files) {
    const filename = file.originalname || "Unknown";
    const suffix = path.extname(filename).toLowerCase();
    const supportedImages = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"];

    let fileId = null;
    try {
      fileId = await uploadToGridFS(filename, file.buffer, {
        content_type: file.mimetype || "application/octet-stream",
        upload_date: currentDate,
        recruiter_name: recruiter.username,
        file_size: file.size,
      });
    } catch (err) {
      // continue even if GridFS fails
    }

    const tmpPath = path.join(os.tmpdir(), `${crypto.randomUUID()}${suffix}`);
    await fs.promises.writeFile(tmpPath, file.buffer);

    let resumeText = "";
    if (suffix === ".pdf") {
      resumeText = await extractTextFromPdf(tmpPath);
    } else if (suffix === ".docx") {
      resumeText = await extractTextFromDocx(tmpPath);
    } else if (suffix === ".doc") {
      resumeText = await extractTextFromDoc(tmpPath);
    } else if (supportedImages.includes(suffix)) {
      resumeText = await extractTextFromImage(tmpPath);
    } else {
      await fs.promises.unlink(tmpPath);
      const errorMsg = `Unsupported file type: ${suffix}. Only PDF, DOCX, and image files (JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP) are allowed.`;
      results.push({ filename, error: errorMsg });
      history.push({
        resume_name: filename,
        hiring_type: hiringTypeLabel,
        level: levelLabel,
        match_percent: null,
        decision: "Error",
        details: errorMsg,
        upload_date: formatDateWithDay(currentDate),
        file_id: fileId ? String(fileId) : null,
      });
      continue;
    }

    const analysis = await analyzeResume(jobDescription, resumeText, hiringType, level);
    if (analysis && typeof analysis === "object") {
      analysis.filename = filename;
      let decision = analysis.decision;
      if (!decision && analysis.result_text) {
        const match = analysis.result_text.match(/Decision:\s*(✅ Shortlist|❌ Reject)/);
        if (match) decision = match[1];
      }
      if (decision && decision.includes("Shortlist")) shortlisted += 1;
      if (decision && decision.includes("Reject")) rejected += 1;
      const decisionLabel = decision && decision.includes("Shortlist") ? "Shortlisted" : decision && decision.includes("Reject") ? "Rejected" : "-";
      analysis.decision = decisionLabel;
      results.push(analysis);
      history.push({
        resume_name: filename,
        hiring_type: hiringTypeLabel,
        level: levelLabel,
        match_percent: analysis.match_percent,
        decision: decisionLabel,
        details: analysis.result_text || analysis.error || "",
        upload_date: formatDateWithDay(currentDate),
        file_id: fileId ? String(fileId) : null,
      });
    } else {
      results.push({ filename, error: analysis });
      history.push({
        resume_name: filename,
        hiring_type: hiringTypeLabel,
        level: levelLabel,
        match_percent: null,
        decision: "Error",
        details: analysis,
        upload_date: formatDateWithDay(currentDate),
        file_id: fileId ? String(fileId) : null,
      });
    }

    await fs.promises.unlink(tmpPath);
  }

  await mis.insertOne({
    recruiter_name: recruiter.username,
    total_resumes: files.length,
    shortlisted,
    rejected,
    timestamp: currentDate,
    history,
  });

  return res.json({ results });
}

async function downloadResume(req, res) {
  try {
    const fileId = req.params.file_id;
    const gridOut = openDownloadStream(fileId);
    gridOut.on("file", (file) => {
      res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
      res.setHeader("Content-Type", file.metadata?.content_type || "application/octet-stream");
    });
    gridOut.on("error", () => res.status(404).json({ detail: "File not found" }));
    gridOut.pipe(res);
  } catch (err) {
    return res.status(404).json({ detail: "File not found" });
  }
}

async function viewResume(req, res) {
  try {
    const fileId = req.params.file_id;
    const gridOut = openDownloadStream(fileId);
    const chunks = [];
    gridOut.on("data", (chunk) => chunks.push(chunk));
    gridOut.on("error", () => res.status(404).json({ detail: "File not found" }));
    gridOut.on("end", () => {
      const fileContent = Buffer.concat(chunks);
      return res.json({
        filename: gridOut.filename,
        content_type: gridOut.s?.metadata?.content_type || "application/octet-stream",
        size: fileContent.length,
        content: fileContent.toString("base64"),
      });
    });
  } catch (err) {
    return res.status(404).json({ detail: "File not found" });
  }
}

module.exports = {
  analyzeResumes,
  downloadResume,
  viewResume,
};
