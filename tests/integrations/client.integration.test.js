import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import DatabaseHelper from "../testContainers.js";

import container from "../../src/entrypoints/di/container.js";

let sqlClientRepository;
let createClient;
let database;

before(async () => {
  database = new DatabaseHelper();
  await database.startContainer();
  await database.create();
});

after(async () => {
  await database.stopContainer();
});

beforeEach(async () => {
  sqlClientRepository = container.resolve("clientRepository");
  createClient = container.resolve("createClient");
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
