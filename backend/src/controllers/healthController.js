function health(req, res) {
  return res.json({ status: "ok" });
}

function backendRoot(req, res) {
  return res.json({ message: "Backend API is live!" });
}

function root(req, res) {
  return res.json({ message: "Backend is live!" });
}

module.exports = {
  health,
  backendRoot,
  root,
};
