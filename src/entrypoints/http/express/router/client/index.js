import express from "express";
import container from "../../../../di/container.js";

const router = express.Router();
/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Retrieve a Client by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the client to retrieve.
 *     responses:
 *       200:
 *         description: A Client.
 */
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

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Create a new client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the client
 *                 required: true
 *               lastName:
 *                 type: string
 *                 description: The last name of the client
 *                 required: true
 *     responses:
 *       201: {}
 */
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

/**
 * @swagger
 * /api/client/{id}:
 *   patch:
 *     summary: Update a client by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the client
 *               lastName:
 *                 type: string
 *                 description: The last name of the client
 *     responses:
 *       200: {}
 */
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

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204: {}
 */
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
