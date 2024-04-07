const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

const fs = require("fs");
const path = require("path");
const file = require("./file");
const RESULT = require("./file-result");
const error = require("./error");

const { logger, start } = require("./logger");
const {
  OK,
  NOT_FOUND,
  CREATED,
  CONFLICT,
  BAD_REQUEST,
} = require("./http-status");


app.use(helmet());
// FIXME: set origin via env
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.static("static"));
app.use(express.json());

start();

const guardPath = (last, path, res) => {
  if (!last || last.includes(".") || (path && path.includes("."))) {
    res.status(NOT_FOUND).send({ status: "notok", error: "File not found" });
    return false;
  }
  return true;
};

const guardContent = (content, res) => {
  if (!content) {
    res.status(BAD_REQUEST).send({ status: "notok", error: "Invalid content" });
    return false;
  }
  return true;
};

app.get("/structure/:path*", (req, res) => {
  res.header("Content-Type", "application/json");
  const last = req.params?.path;
  const path = req.params[0];

  if (!guardPath(last, path, res)) return;

  const data = file.read("structure", path, last);

  if (data !== RESULT.error) {
    res.status(OK).send(data);
  } else {
    res
      .status(NOT_FOUND)
      .send({ status: "notok", error: "Resource not found" });
  }
});

app.post("/structure/:path*", async (req, res) => {
  res.header("Content-Type", "application/json");

  const resource = req.params?.path;
  const path = req.params[0];

  var rawContent = req.body;

  const content = JSON.stringify(rawContent);

  if (!guardPath(resource, path, res)) return;
  if (!guardContent(content)) return;

  const result = await file.write("structure", path, resource, content);

  if (result === RESULT.success) {
    res.status(CREATED).send({ status: "ok", content: JSON.parse(content) });
  } else if (result === RESULT.exist) {
    res
      .status(CONFLICT)
      .send({ status: "notok", error: "Ressource exists already" });
  } else {
    res
      .status(NOT_FOUND)
      .send({ status: "notok", error: "Resource not found" });
  }
});

app.put("/structure/:path*", async (req, res) => {
  res.header("Content-Type", "application/json");

  const resource = req.params?.path;
  const path = req.params[0];

  var rawContent = req.body;

  const content = JSON.stringify(rawContent);

  if (!guardPath(resource, path, res)) return;
  if (!guardContent(content)) return;

  const result = await file.update("structure", path, resource, content);
  if (result === RESULT.success) {
    res.status(CREATED).send({ status: "ok", content: JSON.parse(content) });
  } else {
    res
      .status(NOT_FOUND)
      .send({ status: "notok", error: "Resource not found" });
  }
});

app.delete("/structure/:path*", async (req, res) => {
  res.header("Content-Type", "application/json");

  const resource = req.params?.path;
  const path = req.params[0];

  if (!guardPath(resource, path, res)) return;

  const result = await file.delete("structure", path, resource);

  if (result === RESULT.success) {
    res.status(OK).send({ status: "ok" });
  } else {
    res
      .status(NOT_FOUND)
      .send({ status: "notok", error: "Resource not found" });
  }
});

app.use(error);

module.exports = app;
