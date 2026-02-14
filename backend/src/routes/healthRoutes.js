const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

router.get("/health", healthController.health);
router.get("/", healthController.backendRoot);

module.exports = router;
