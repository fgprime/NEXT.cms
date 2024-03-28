const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "NEXT.cms" },
  transports: [
    new winston.transports.File({ filename: "log/error.log", level: "error" }),
    new winston.transports.File({ filename: "log/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: "debug",
    }),
  );
}

const start = () => {
  logger.log({
    level: "info",
    message: "⚡️ Application is starting",
  });
};

module.exports = { logger, start };
