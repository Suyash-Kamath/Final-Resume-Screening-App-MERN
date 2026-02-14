function validateAnalyzeResumes(payload, files) {
  const errors = [];
  const { job_description: jobDescription, hiring_type: hiringType, level } = payload || {};

  if (!jobDescription || !hiringType || !level) {
    errors.push("Missing job_description, hiring_type, or level");
  }
  if (!files || !files.length) {
    errors.push("Missing files");
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = {
  validateAnalyzeResumes,
};
