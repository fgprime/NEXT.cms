const { logger } = require("./logger");

const error = (err, req, res, next) => {
  logger.error(`Error:`, err.stack);

  res.status(500);
  res.send("Internal Server Error");
};

module.exports = error;
