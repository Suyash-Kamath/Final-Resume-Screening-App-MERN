const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { CORS_ORIGINS } = require("./config/constants");
const errorHandler = require("./middlewares/error");
const requestLogger = require("./middlewares/requestLogger");
const { root } = require("./controllers/healthController");

const app = express();

app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/backend", routes);
app.get("/", root);

app.use(errorHandler);

module.exports = app;
