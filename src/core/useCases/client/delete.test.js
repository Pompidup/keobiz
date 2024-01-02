import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import InMemoryBalanceSheetRepository from "../../../adapters/repositories/inMemoryBalanceSheetRepository.js";
import DeleteClient from "./delete.js";

describe("Delete Client", () => {
  let deleteClient;
  let inMemoryClientRepository;
  let inMemoryBalanceSheetRepository;

  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository();
    inMemoryBalanceSheetRepository = new InMemoryBalanceSheetRepository();
    deleteClient = new DeleteClient(
      inMemoryClientRepository,
      inMemoryBalanceSheetRepository
    );
  });

  it("should delete a client", async () => {
    // Arrange
    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    // Act
    await deleteClient.execute(1);

    // Assert
    const deletedClient = await inMemoryClientRepository.getById(1);

    assert.strictEqual(deletedClient, null);
  });

  it("should throw an error when client does not exist", async () => {
    // Act
    const deleteClientPromise = deleteClient.execute(1);

    // Assert
    await assert.rejects(deleteClientPromise, {
      message: "Client not found",
    });
  });

  it("should delete the balance sheet results of the client", async () => {
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
    await deleteClient.execute(1);

    // Assert
    const deletedBalanceSheet = await inMemoryBalanceSheetRepository.find(
      2021,
      1
    );

    assert.strictEqual(deletedBalanceSheet, null);
  });
});
