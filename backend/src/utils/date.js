function formatDateWithDay(dt) {
  const day = dt.getUTCDate();
  const mod = day % 10;
  let suffix = "th";
  if (day % 100 < 10 || day % 100 > 20) {
    if (mod === 1) suffix = "st";
    else if (mod === 2) suffix = "nd";
    else if (mod === 3) suffix = "rd";
  }
  const options = { year: "numeric", month: "long", day: "2-digit", weekday: "long", timeZone: "UTC" };
  const formatted = new Intl.DateTimeFormat("en-US", options).format(dt);
  const [weekday, month, dayNum, year] = formatted.replace(",", "").split(" ");
  return `${dayNum}${suffix} ${month} ${year}, ${weekday}`;
}

function getHiringTypeLabel(hiringType) {
  return { "1": "Sales", "2": "IT", "3": "Non-Sales", "4": "Sales Support" }[hiringType] || hiringType;
}

function getLevelLabel(level) {
  return { "1": "Fresher", "2": "Experienced" }[level] || level;
}

module.exports = {
  formatDateWithDay,
  getHiringTypeLabel,
  getLevelLabel,
};
