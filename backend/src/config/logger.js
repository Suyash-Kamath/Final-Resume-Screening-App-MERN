function logInfo(message, meta) {
  if (meta) {
    console.log(message, meta);
  } else {
    console.log(message);
  }
}

function logError(message, meta) {
  if (meta) {
    console.error(message, meta);
  } else {
    console.error(message);
  }
}

module.exports = {
  logInfo,
  logError,
};
