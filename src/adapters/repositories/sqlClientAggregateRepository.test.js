import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import DatabaseHelper from "../../../tests/testContainers.js";
import SqlClientAggregateRepository from "./sqlClientAggregateRepository.js";

let sqlClientAggregateRepository;
let database;
let connection;

before(async () => {
  database = new DatabaseHelper();
  await database.startContainer();
  await database.create();
  connection = await database.getTestContainerConnection();
  sqlClientAggregateRepository = new SqlClientAggregateRepository(connection);
});

after(async () => {
  await database.stopContainer();
});

beforeEach(async () => {
  await database.truncate();
  const queries = [
    "INSERT INTO clients (id, first_name, last_name) VALUES (1, 'Pierre', 'Bernard'),(2, 'Pierre', 'Bernard');",
    "INSERT INTO balance_sheets (client_id, year, result) VALUES (1, 2020, 1234),(1, 2021, 556),(2, 2020, 1234),(2, 2021, -999);",
  ];

  for (const query of queries) {
    await database.execute(query);
  }
});

describe("SqlClientAggregateRepository integration test", () => {
  it("should get all clients with balance sheets", async () => {
    // Act
    const clients = await sqlClientAggregateRepository.getAll();

    // Assert
    assert.strictEqual(clients.length, 2);
    assert.deepStrictEqual(clients, [
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        balance_sheets: [
          {
            year: 2020,
            result: 1234,
          },
          {
            year: 2021,
            result: 556,
          },
        ],
      },
      {
        id: 2,
        first_name: "Pierre",
        last_name: "Bernard",
        balance_sheets: [
          {
            year: 2020,
            result: 1234,
          },
          {
            year: 2021,
            result: -999,
          },
        ],
      },
    ]);
  });
});
