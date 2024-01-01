import { describe, it } from "node:test";
import assert from "node:assert";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import Client from "../../entities/client.js";
import FindClient from "./find.js";

describe("Get client", () => {
  it("should get client", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();

    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    const findClient = new FindClient(inMemoryClientRepository);

    //Act
    const result = await findClient.execute(1);

    // Assert
    const expectedClient = Client.create("John", "Doe");
    expectedClient.id = 1;

    assert.deepStrictEqual(result, expectedClient);
  });

  it("should throw an error when client does not exist", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const findClient = new FindClient(inMemoryClientRepository);

    //Act
    const promise = findClient.execute(1);

    // Assert
    await assert.rejects(promise, {
      message: "Client not found",
    });
  });
});
