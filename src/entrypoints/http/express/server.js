import express from "express";
import router from "./router/router.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import pinoLogger from "../../../adapters/loggers/pino.js";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clients API",
      version: "1.0.0",
      description: "A simple Express API",
    },
  },
  apis: [
    "./src/entrypoints/http/express/router/client/index.js",
    "./src/entrypoints/http/express/router/balanceSheet/index.js",
  ],
};

const specs = swaggerJsdoc(options);

console.log(specs);

const createServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", router);
  app.use("/docs-api", swaggerUi.serve, swaggerUi.setup(specs));
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
