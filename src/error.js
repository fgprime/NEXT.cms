const { logger } = require("./logger");

const error = (err, req, res, next) => {
  logger.fatal(`Server error: `, err.stack);

  res.status(500).send({ status: "notok", error: "Internal server error" });
};

module.exports = error;
