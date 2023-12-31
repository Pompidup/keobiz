import express from "express";
import routes from "./entrypoints/http/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", routes);

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
