const jwt = require("jsonwebtoken");
const { SECRET_KEY, ALGORITHM } = require("../config/constants");
const { getCollections } = require("../config/db");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Could not validate credentials" });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });
    const username = payload.sub;
    if (!username) {
      return res.status(401).json({ detail: "Could not validate credentials" });
    }
    const { recruiters } = getCollections();
    const recruiter = await recruiters.findOne({ username });
    if (!recruiter) {
      return res.status(401).json({ detail: "Could not validate credentials" });
    }
    req.recruiter = recruiter;
    return next();
  } catch (err) {
    return res.status(401).json({ detail: "Could not validate credentials" });
  }
}

module.exports = authMiddleware;
