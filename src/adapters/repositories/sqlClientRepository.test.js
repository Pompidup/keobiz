import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import DatabaseHelper from "../../../tests/testContainers.js";
import SqlClientRepository from "./sqlClientRepository.js";

let sqlClientRepository;
let database;
let connection;

before(async () => {
  database = new DatabaseHelper();
  await database.startContainer();
  await database.create();
  connection = await database.getTestContainerConnection();
  sqlClientRepository = new SqlClientRepository(connection);
});

after(async () => {
  await database.stopContainer();
});

beforeEach(async () => {
  await database.reset();
});

describe("SqlClientRepository integration test", () => {
  it("should save a client", async () => {
    // Act
    await sqlClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    // Assert
    const clientInserted = await database.execute(
      "SELECT * FROM clients WHERE first_name = 'John' AND last_name = 'Doe'"
    );

    assert.strictEqual(clientInserted[0][0].first_name, "John");
    assert.strictEqual(clientInserted[0][0].last_name, "Doe");
  });

  it("should update a client", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO clients (first_name, last_name) VALUES ('John', 'Doe')"
    );

    const clientInserted = await database.execute(
      "SELECT * FROM clients WHERE first_name = 'John' AND last_name = 'Doe'"
    );

    const clientId = clientInserted[0][0].id;

    // Act
    await sqlClientRepository.save({
      firstName: "Jane",
      lastName: "Doe",
      id: clientId,
    });

    // Assert
    const clientUpdated = await database.execute(
      `SELECT * FROM clients WHERE id = ${clientId}`
    );
    assert.strictEqual(clientUpdated[0][0].first_name, "Jane");
    assert.strictEqual(clientUpdated[0][0].last_name, "Doe");
  });

  it("should get a client by id", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO clients (first_name, last_name) VALUES ('John', 'Doe')"
    );
    const clientId = (
      await database.execute(
        "SELECT * FROM clients WHERE first_name = 'John' AND last_name = 'Doe'"
      )
    )[0][0].id;

    // Act
    const client = await sqlClientRepository.getById(clientId);

    // Assert
    assert.strictEqual(client.firstName, "John");
    assert.strictEqual(client.lastName, "Doe");
  });

  it("should return null when client does not exist", async () => {
    // Act
    const client = await sqlClientRepository.getById(999);

    // Assert
    assert.strictEqual(client, null);
  });

  it("should delete a client", async () => {
    // Arrange
    await database.execute(
      "INSERT INTO clients (first_name, last_name) VALUES ('John', 'Doe')"
    );
    const clientId = (
      await database.execute(
        "SELECT * FROM clients WHERE first_name = 'John' AND last_name = 'Doe'"
      )
    )[0][0].id;

    // Act
    await sqlClientRepository.delete(clientId);

    // Assert
    const client = await sqlClientRepository.getById(clientId);
    assert.strictEqual(client, null);
  });
});
