import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

import InMemoryBalanceSheetRepository from "../../../adapters/repositories/inMemoryBalanceSheetRepository.js";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import UpdateBalanceSheet from "./update.js";
import BalanceSheet from "../../entities/balanceSheet.js";

describe("Update Balance Sheet", () => {
  let updateBalanceSheet;
  let inMemoryBalanceSheetRepository;
  let inMemoryClientRepository;

  beforeEach(() => {
    inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    inMemoryClientRepository = new InMemoryClientRepository();
    updateBalanceSheet = new UpdateBalanceSheet(
      inMemoryClientRepository,
      inMemoryBalanceSheetRepository
    );
  });

  it("should update a balance sheet result", async () => {
    // Arrange
    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    await inMemoryBalanceSheetRepository.save({
      year: 2021,
      clientId: 1,
      result: 4099.42,
    });

    const payload = BalanceSheet.create({
      year: 2021,
      clientId: 1,
      result: 5099.42,
    });

    // Act
    await updateBalanceSheet.execute(payload);

    // Assert
    const updatedBalanceSheet = await inMemoryBalanceSheetRepository.find(
      2021,
      1
    );

    assert.deepStrictEqual(payload, updatedBalanceSheet);
  });

  it("should throw an error when client does not exist", async () => {
    // Arrange
    const payload = BalanceSheet.create({
      year: 2021,
      clientId: 1,
      result: 5099.42,
    });

    // Act
    const promise = updateBalanceSheet.execute(payload);

    // Assert
    await assert.rejects(promise, {
      message: "Client not found",
    });
  });

  it("should throw an error when balance sheet does not exist", async () => {
    // Arrange
    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    const payload = BalanceSheet.create({
      year: 2021,
      clientId: 1,
      result: 5099.42,
    });

    // Act
    const promise = updateBalanceSheet.execute(payload);

    // Assert
    await assert.rejects(promise, {
      message: "Balance sheet not found",
    });
  });

  it("should throw an error when result is invalid", async () => {
    // Arrange
    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    await inMemoryBalanceSheetRepository.save({
      year: 2021,
      clientId: 1,
      result: 4099.42,
    });

    // Act
    const promise = updateBalanceSheet.execute({
      year: 2021,
      clientId: 1,
      result: "invalid",
    });

    // Assert
    await assert.rejects(promise, {
      message: "Invalid result",
    });
  });
});
