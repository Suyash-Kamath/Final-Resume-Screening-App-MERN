const authValidators = require("./authValidators");
const resumeValidators = require("./resumeValidators");

module.exports = {
  ...authValidators,
  ...resumeValidators,
};
