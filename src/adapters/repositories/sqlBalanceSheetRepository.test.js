import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import DatabaseHelper from "../../../tests/testContainers.js";
import SqlBalanceSheetRepository from "./sqlBalanceSheetRepository.js";

let sqlBalanceSheetRepository;
let database;
let connection;

before(async () => {
  database = new DatabaseHelper();
  await database.startContainer();
  await database.create();
  connection = await database.getTestContainerConnection();
  sqlBalanceSheetRepository = new SqlBalanceSheetRepository(connection);
});

after(async () => {
  await database.stopContainer();
});

beforeEach(async () => {
  await database.truncate();
  await database.execute(
    "INSERT INTO clients (first_name, last_name) VALUES ('John', 'Doe')"
  );
});

describe("SqlBalanceSheetRepository integration test", () => {
  it("should save a balance sheet", async () => {
    // Act
    await sqlBalanceSheetRepository.save({
      year: 2020,
      clientId: 1,
      result: 1000,
    });

    // Assert
    const balanceSheetInserted = await database.execute(
      "SELECT * FROM balance_sheets WHERE year = 2020 AND client_id = 1"
    );

    assert.strictEqual(balanceSheetInserted[0][0].year, 2020);
    assert.strictEqual(balanceSheetInserted[0][0].client_id, 1);
    assert.strictEqual(balanceSheetInserted[0][0].result, 1000);
  });

  it("should update a balance sheet", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2020, 1, 1000)"
    );

    const countBalanceSheetsBefore = (
      await database.execute("SELECT * FROM balance_sheets")
    )[0].length;

    // Act
    await sqlBalanceSheetRepository.save({
      year: 2020,
      result: 3000,
      clientId: 1,
    });

    // Assert
    const countBalanceSheetsAfter = (
      await database.execute("SELECT * FROM balance_sheets")
    )[0].length;

    const balanceSheetUpdated = (
      await database.execute(
        `SELECT * FROM balance_sheets WHERE year = 2020 AND client_id = 1`
      )
    )[0][0];

    assert.strictEqual(countBalanceSheetsBefore, countBalanceSheetsAfter);
    assert.strictEqual(balanceSheetUpdated.result, 3000);
  });

  it("should get a balance sheet by year and client id", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2020, 1, 1000)"
    );

    // Act
    const balanceSheet = await sqlBalanceSheetRepository.find(2020, 1);

    // Assert
    assert.strictEqual(balanceSheet.year, 2020);
    assert.strictEqual(balanceSheet.clientId, 1);
    assert.strictEqual(balanceSheet.result, 1000);
  });

  it("should get all balance sheets", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2020, 1, 1000)"
    );
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2021, 1, 2000)"
    );

    // Act
    const balanceSheets = await sqlBalanceSheetRepository.getBalanceSheets();

    // Assert
    assert.strictEqual(balanceSheets.length, 2);
    assert.strictEqual(balanceSheets[0].year, 2020);
    assert.strictEqual(balanceSheets[0].clientId, 1);
    assert.strictEqual(balanceSheets[0].result, 1000);
    assert.strictEqual(balanceSheets[1].year, 2021);
    assert.strictEqual(balanceSheets[1].clientId, 1);
    assert.strictEqual(balanceSheets[1].result, 2000);
  });

  it("should get balance sheets by client id", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2020, 1, 1000)"
    );
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2021, 1, 2000)"
    );

    // Act
    const balanceSheets = await sqlBalanceSheetRepository.findByClientId(1);

    // Assert
    assert.strictEqual(balanceSheets.length, 2);
    assert.strictEqual(balanceSheets[0].year, 2020);
    assert.strictEqual(balanceSheets[0].clientId, 1);
    assert.strictEqual(balanceSheets[0].result, 1000);
    assert.strictEqual(balanceSheets[1].year, 2021);
    assert.strictEqual(balanceSheets[1].clientId, 1);
    assert.strictEqual(balanceSheets[1].result, 2000);
  });

  it("should return null when balance sheet not found", async () => {
    // Act
    const balanceSheet = await sqlBalanceSheetRepository.find(2020, 1);

    // Assert
    assert.strictEqual(balanceSheet, null);
  });

  it("should delete a balance sheet", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2020, 1, 1000)"
    );
    await database.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (2021, 1, 2000)"
    );

    const countBalanceSheetsBefore = (
      await database.execute("SELECT * FROM balance_sheets")
    )[0].length;

    // Act
    await sqlBalanceSheetRepository.delete(2020, 1);

    // Assert
    const countBalanceSheetsAfter = (
      await database.execute("SELECT * FROM balance_sheets")
    )[0].length;

    assert.strictEqual(countBalanceSheetsBefore, countBalanceSheetsAfter + 1);
  });
});
