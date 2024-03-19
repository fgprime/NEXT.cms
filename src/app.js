const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const file = require("./file");

app.use(express.static("static"));
app.use(express.json());

const guard = (path, res) => {
  if (!path || path.includes(".")) {
    res.status(404).send({ status: "notok", error: "File not found" });
    return true;
  }
  return false;
};

app.get("/structure/:path*", (req, res) => {
  res.header("Content-Type", "application/json");
  const pathParam = req.params?.path;

  if (guard(pathParam, res)) return;

  //TODO: improve error handling

  const data = file.read(`structure/${pathParam}`);

  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send({ status: "notok", error: "File not found" });
  }
});

app.post("/structure/:path*", (req, res) => {
  res.header("Content-Type", "application/json");
  const pathParam = req.params?.path;
  const content = JSON.stringify(req.body);

  if (guard(pathParam, res)) return;
  //TODO: verify json content

  const data = file.read(`structure/${pathParam}`);

  if (file.write(`structure/${pathParam}`)) {
    res.status(201).send({ status: "ok", content: JSON.parse(content) });
  } else {
    res.status(404).send({ status: "notok", error: "File not found" });
  }
});

module.exports = app;
