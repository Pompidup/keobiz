import express from "express";
import router from "./router/router.js";
import dotenv from "dotenv";
import pinoLogger from "../../../adapters/loggers/pino.js";

dotenv.config();

const createServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", router);

  return app;
};

const startServer = async () => {
  try {
    pinoLogger.info("Server is starting...");
    const app = await createServer();
    const port = process.env.NODE_DOCKER_PORT || 3000;
    app.listen(port, () =>
      pinoLogger.info(`Server is running on port ${port}`)
    );
  } catch (error) {
    pinoLogger.error(error, "Server failed to start");
  }
};

export default startServer;
