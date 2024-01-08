import express from "express";
import container from "../../../../di/container.js";

const router = express.Router();

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
