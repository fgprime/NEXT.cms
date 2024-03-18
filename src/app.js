const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

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

  if (!pathParam || pathParam.includes(".")) {
    res.status(404).send({ status: "notok", error: "File not found" });
    return;
  }

  fs.readFile(`data/structure/${pathParam}.json`, (err, data) => {
    if (err) {
      res.status(404).send({ status: "notok", error: "File not found" });
      return;
    }
    res.status(200).send(data);
  });
});

app.post("/structure/:path*", (req, res) => {
  res.header("Content-Type", "application/json");
  const pathParam = req.params?.path;
  const content = JSON.stringify(req.body);

  if (guard(pathParam, res)) return;
  //TODO: verify json content

  fs.writeFile("data/structure/hubert.json", content, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send({ status: "notok", error: "File not found" });
      return;
    }

    res.status(201).send({ status: "ok", content: JSON.parse(content) });
  });
});

module.exports = app;
