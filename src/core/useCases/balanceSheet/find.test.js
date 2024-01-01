import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import InMemoryBalanceSheetRepository from "../../../adapters/repositories/inMemoryBalanceSheetRepository.js";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import FindBalanceSheet from "./find.js";
import BalanceSheet from "../../entities/balanceSheet.js";

describe("Find Balance Sheet", () => {
  let findBalanceSheet;
  let inMemoryBalanceSheetRepository;
  let inMemoryClientRepository;

  beforeEach(() => {
    inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    inMemoryClientRepository = new InMemoryClientRepository();
    findBalanceSheet = new FindBalanceSheet(
      inMemoryClientRepository,
      inMemoryBalanceSheetRepository
    );
  });

  it("should retrieve all balance sheets for a given client", async () => {
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

    await inMemoryBalanceSheetRepository.save({
      year: 2020,
      clientId: 1,
      result: 3099.42,
    });

    // Act
    const balanceSheets = await findBalanceSheet.execute(1);
    const expectedBalanceSheets = [
      BalanceSheet.create({
        year: 2021,
        clientId: 1,
        result: 4099.42,
      }),
      BalanceSheet.create({
        year: 2020,
        clientId: 1,
        result: 3099.42,
      }),
    ];

    // Assert
    assert.strictEqual(balanceSheets.length, 2);
    assert.deepStrictEqual(balanceSheets, expectedBalanceSheets);
  });

  it("should return an empty array if no balance sheets are found", async () => {
    // Arrange
    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    // Act
    const balanceSheets = await findBalanceSheet.execute(1);

    // Assert
    assert.strictEqual(balanceSheets.length, 0);
  });

  it("should throw an error if client does not exist", async () => {
    // Act
    const promise = findBalanceSheet.execute(2);

    // Assert
    await assert.rejects(promise, {
      message: "Client not found",
    });
  });
});
