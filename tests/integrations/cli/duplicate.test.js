import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import DatabaseHelper from "../../testContainers.js";
import SqlClientAggregateRepository from "../../../src/adapters/repositories/sqlClientAggregateRepository.js";
import FindDuplicate from "../../../src/core/useCases/client/findDuplicate.js";

let database;
let sqlClientAggregateRepository;
let connection;
let findDuplicateClient;

before(async () => {
  database = new DatabaseHelper();
  await database.startContainer();
  await database.create();
  connection = await database.getTestContainerConnection();
  sqlClientAggregateRepository = new SqlClientAggregateRepository(connection);
  findDuplicateClient = new FindDuplicate(sqlClientAggregateRepository);
});

after(async () => {
  await database.stopContainer();
});

beforeEach(async () => {
  await database.reset();
});

describe("Find duplicate client test", () => {
  it("should find a duplicate client", async () => {
    // NOTE For this test we use initial data from dump file (src/config/data.sql)
    // Act
    const duplicateClients = await findDuplicateClient.execute();

    // Assert
    assert.strictEqual(duplicateClients.length, 3);
    assert.deepStrictEqual(duplicateClients, [
      {
        name: "Pierre Bernard",
        ids: [3, 25],
      },
      {
        name: "Sophie Richard",
        ids: [10, 18],
      },
      {
        name: "Eric Laurent",
        ids: [15, 21],
      },
    ]);
  });

  it("should return an empty array if no duplicate client", async () => {
    // Arrange
    await database.truncate();

    const queries = [
      "INSERT INTO clients (id, first_name, last_name) VALUES (1, 'Pierre', 'Bernard'),(2, 'Pierre', 'Bernard');",
      "INSERT INTO balance_sheets (client_id, year, result) VALUES (1, 2020, 1234),(1, 2021, 556),(2, 2020, 1234),(2, 2021, -999);",
    ];

    for (const query of queries) {
      await connection.execute(query);
    }

    // Act
    const duplicateClients = await findDuplicateClient.execute();

    // Assert
    assert.strictEqual(duplicateClients.length, 0);
  });
});
