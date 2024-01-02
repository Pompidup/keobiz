import express from "express";
import routes from "./src/entrypoints/http/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
