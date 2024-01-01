import { describe, it } from "node:test";
import assert from "node:assert";

import CreateBalanceSheet from "./create.js";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import InMemoryBalanceSheetRepository from "../../../adapters/repositories/inMemoryBalanceSheetRepository.js";

describe("Create BalanceSheet", () => {
  it("should create a new balanceSheet", async () => {
    // Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    const createBalanceSheet = new CreateBalanceSheet(
      inMemoryClientRepository,
      inMemoryBalanceSheetRepository
    );

    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    // Act
    await createBalanceSheet.execute({
      year: 2021,
      clientId: 1,
      result: 4099.42,
    });

    // Assert
    const bs = await inMemoryBalanceSheetRepository.getBalanceSheets();
    assert.strictEqual(bs.length, 1);
  });

  it("should throw an error if client does not exist", async () => {
    // Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    const createBalanceSheet = new CreateBalanceSheet(
      inMemoryClientRepository,
      inMemoryBalanceSheetRepository
    );

    // Act
    const promise = createBalanceSheet.execute({
      year: 2021,
      clientId: 1,
      result: 4099.42,
    });

    // Assert
    await assert.rejects(promise, {
      message: "Client not found",
    });
  });

  const testCases = [
    {
      case: "invalid year",
      payload: {
        year: 202,
        clientId: 1,
        result: 4099.42,
      },
      expected: "Invalid year",
    },
    {
      case: "invalid result",
      payload: {
        year: 2021,
        clientId: 1,
        result: "4099.42",
      },
      expected: "Invalid result",
    },
  ];

  for (const testCase of testCases) {
    it(`when the balanceSheet have ${testCase.case}, should return an error ${testCase.expected}`, async () => {
      // Arrange
      const inMemoryClientRepository = new InMemoryClientRepository();
      const inMemoryBalanceSheetRepository =
        new InMemoryBalanceSheetRepository();
      const createBalanceSheet = new CreateBalanceSheet(
        inMemoryClientRepository,
        inMemoryBalanceSheetRepository
      );
      await inMemoryClientRepository.save({
        firstName: "John",
        lastName: "Doe",
      });

      // Act
      try {
        await createBalanceSheet.execute(testCase.payload);
      } catch (error) {
        // Assert
        assert.strictEqual(error.message, testCase.expected);
      }
    });
  }

  it("should throw an error if balanceSheet already exists", async () => {
    // Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    const createBalanceSheet = new CreateBalanceSheet(
      inMemoryClientRepository,
      inMemoryBalanceSheetRepository
    );

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
    const promise = createBalanceSheet.execute({
      year: 2021,
      clientId: 1,
      result: 4099.42,
    });

    // Assert
    await assert.rejects(promise, {
      message: "Balance sheet already exists",
    });
  });
});
