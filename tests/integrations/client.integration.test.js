import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import DatabaseHelper from "../testContainers.js";
import SqlClientRepository from "../../src/adapters/repositories/sqlClientRepository.js";
import CreateClient from "../../src/core/useCases/client/create.js";

let sqlClientRepository;
let createClient;
let database;
let connection;

before(async () => {
  database = new DatabaseHelper();
  await database.startContainer();
  await database.create();
  connection = await database.getTestContainerConnection();
  sqlClientRepository = new SqlClientRepository(connection);
  createClient = new CreateClient(sqlClientRepository);
});

after(async () => {
  await database.stopContainer();
});

beforeEach(async () => {
  await database.reset();
});

describe("Client integration test", () => {
  it("should create a new client", async () => {
    // Arrange
    const countClientsBefore = await sqlClientRepository.getClients();

    // Act
    await createClient.execute({
      firstName: "John",
      lastName: "Doe",
    });

    // Assert
    const clients = await sqlClientRepository.getClients();
    assert.strictEqual(clients.length, countClientsBefore.length + 1);
  });

  it("should create a namesake client", async () => {
    // Arrange
    const countClientsBefore = await sqlClientRepository.getClients();

    await createClient.execute({
      firstName: "John",
      lastName: "Doe",
    });

    // Act
    await createClient.execute({
      firstName: "John",
      lastName: "Doe",
    });

    // Assert
    const clients = await sqlClientRepository.getClients();
    assert.strictEqual(clients.length, countClientsBefore.length + 2);
  });
});
