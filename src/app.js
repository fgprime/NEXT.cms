const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const file = require("./file");

const logger = require("./logger");

logger.log({
  level: "info",
  message: "⚡️ Application is starting",
});

app.use(express.static("static"));
app.use(express.json());

const guardPath = (last, path, res) => {
  if (!last || last.includes(".") || (path && path.includes("."))) {
    res.status(404).send({ status: "notok", error: "File not found" });
    return false;
  }
  return true;
};

const guardContent = (content, res) => {
  if (!content) {
    res.status(400).send({ status: "notok", error: "Invalid content" });
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

  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send({ status: "notok", error: "Resource not found" });
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

  if (await file.write("structure", path, resource, content)) {
    res.status(201).send({ status: "ok", content: JSON.parse(content) });
  } else {
    res.status(404).send({ status: "notok", error: "Resource not found" });
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

  if (await file.update("structure", path, resource, content)) {
    res.status(201).send({ status: "ok", content: JSON.parse(content) });
  } else {
    res.status(404).send({ status: "notok", error: "Resource not found" });
  }
});

app.delete("/structure/:path*", async (req, res) => {
  res.header("Content-Type", "application/json");

  const resource = req.params?.path;
  const path = req.params[0];

  if (!guardPath(resource, path, res)) return;

  if (await file.delete("structure", path, resource)) {
    res.status(200).send({ status: "ok" });
  } else {
    res.status(404).send({ status: "notok", error: "Resource not found" });
  }
});

module.exports = app;
