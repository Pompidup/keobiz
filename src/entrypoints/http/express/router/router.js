import express from "express";
import clientRouter from "./client/index.js";
import balanceSheetRouter from "./balanceSheet/index.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  res.status(200).send("OK");
});

router.use(clientRouter);
router.use(balanceSheetRouter);
router.use(errorHandler);

export default router;
