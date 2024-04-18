const { logger } = require("./logger");
const url = require("url");

const getFullUrl = (req) => {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.originalUrl,
  });
};

const notfound = (req, res, next) => {
  logger.info(`Ressource not found: `, getFullUrl(req));
  res.status(404).send({ status: "notok", error: "Not found" });
};

module.exports = notfound;
