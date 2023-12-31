import express from "express";
import container from "../di/container.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  res.status(200).send("OK");
});

router.post("/clients", async (req, res) => {
  const createClient = container.resolve("createClient");
  const client = req.body;
  await createClient.execute(client);
  res.status(201).send();
});

export default router;
