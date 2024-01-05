import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  level: process.env.LOG_LEVEL || "info",
});
const pinoLogger = pino(stream);

export default pinoLogger;
