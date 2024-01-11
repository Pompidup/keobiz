import express from "express";
import container from "../../../../di/container.js";

const router = express.Router();

/**
 * @swagger
 * /api/balance_sheet/{clientId}:
 *   get:
 *     summary: Retrieve a balance sheet by clientId.
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the client to retrieve.
 *     responses:
 *       200:
 *         description: Balance sheets attach to a client.
 */
router.get("/balance_sheet/:clientId", async (req, res, next) => {
  const findBS = container.resolve("findBS");
  const { clientId } = req.params;

  try {
    const balanceSheet = await findBS.execute(+clientId);
    res.status(200).send(balanceSheet);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/balance_sheet:
 *   post:
 *     summary: Create a new balance sheet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *                 description: The ID of the client
 *                 required: true
 *               year:
 *                 type: integer
 *                 description: The year of the balance sheet
 *                 required: true
 *               result:
 *                 type: integer
 *                 description: The result of the balance sheet
 *                 required: true
 *     responses:
 *       201: {}
 */
router.post("/balance_sheet", async (req, res, next) => {
  const createBalanceSheet = container.resolve("createBS");
  const { year, clientId, result } = req.body;

  try {
    await createBalanceSheet.execute({
      year,
      clientId,
      result,
    });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/balance_sheet/{clientId}/{year}:
 *   patch:
 *     summary: Update a balance sheet by clientId and year
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
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
 *               result:
 *                 type: integer
 *                 description: The new result of the balance sheet
 *                 required: true
 *     responses:
 *       201: {}
 */
router.patch("/balance_sheet/:clientId/:year", async (req, res, next) => {
  const updateBalanceSheet = container.resolve("updateBS");
  const { clientId, year } = req.params;
  const { result } = req.body;

  try {
    await updateBalanceSheet.execute({
      year: +year,
      clientId: +clientId,
      result,
    });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/balance_sheet/{clientId}/{year}:
 *   delete:
 *     summary: Delete a balance sheet by clientId and year
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204: {}
 */
router.delete("/balance_sheet/:clientId/:year", async (req, res, next) => {
  const deleteBalanceSheet = container.resolve("deleteBS");
  const { clientId, year } = req.params;

  try {
    await deleteBalanceSheet.execute(+year, +clientId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
