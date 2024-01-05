import express from "express";
import container from "../../../../di/container.js";

const router = express.Router();

router.get("/client/:id", async (req, res, next) => {
  const findClient = container.resolve("findClient");
  const { id } = req.params;

  try {
    const client = await findClient.execute(+id);
    res.status(200).send(client);
  } catch (error) {
    next(error);
  }
});

router.post("/client", async (req, res, next) => {
  const createClient = container.resolve("createClient");
  const client = req.body;

  try {
    await createClient.execute(client);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

router.patch("/client/:id", async (req, res, next) => {
  const updateClient = container.resolve("updateClient");
  const { id } = req.params;
  const client = req.body;

  try {
    await updateClient.execute(+id, client);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.delete("/client/:id", async (req, res, next) => {
  const deleteClient = container.resolve("deleteClient");
  const { id } = req.params;

  try {
    await deleteClient.execute(+id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
