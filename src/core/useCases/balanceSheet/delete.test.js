import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import InMemoryBalanceSheetRepository from "../../../adapters/repositories/inMemoryBalanceSheetRepository.js";
import DeleteBalanceSheet from "./delete.js";

describe("Delete Balance Sheet", () => {
  let deleteBalanceSheet;
  let inMemoryBalanceSheetRepository;

  beforeEach(() => {
    inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    deleteBalanceSheet = new DeleteBalanceSheet(inMemoryBalanceSheetRepository);
  });

  it("should delete a balance sheet result", async () => {
    // Arrange
    await inMemoryBalanceSheetRepository.save({
      year: 2021,
      clientId: 1,
      result: 4099.42,
    });

    // Act
    await deleteBalanceSheet.execute(2021, 1);

    // Assert
    const deletedBalanceSheet = await inMemoryBalanceSheetRepository.find(
      2021,
      1
    );

    assert.strictEqual(deletedBalanceSheet, null);
  });

  it("should throw an error when balance sheet does not exist", async () => {
    // Act
    const deleteBalanceSheetPromise = deleteBalanceSheet.execute(2021, 1);

    // Assert
    await assert.rejects(deleteBalanceSheetPromise, {
      message: "Balance sheet not found",
    });
  });
});
