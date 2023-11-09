import winston from "winston";

const devLogger = winston.createLogger({
  transports: [new winston.transports.Console({ level: "debug" })],
});

const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "./files/errors.log",
      level: "info",
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger =
    process.env.ENVIRONMENT === "PRODUCTION" ? prodLogger : devLogger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
  );
  next();
};
