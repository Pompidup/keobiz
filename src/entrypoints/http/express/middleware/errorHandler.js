import pinoLogger from "../../../../adapters/loggers/pino.js";

const errorHandler = (err, req, res, next) => {
  // Log the error
  pinoLogger.error(err);

  // Set the appropriate status code
  res.status(500);

  // Send a JSON response with the error message
  res.json({ error: err.message });
};

export default errorHandler;
