import { describe, it } from "node:test";
import assert from "node:assert";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import UpdateClient from "./update.js";
import Client from "../../entities/client.js";

describe("Update Client", () => {
  it("should update a client", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();

    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    const updateClient = new UpdateClient(inMemoryClientRepository);

    //Act
    await updateClient.execute(1, {
      firstName: "Jane",
      lastName: "Do",
    });

    // Assert
    const updatedClient = await inMemoryClientRepository.getById(1);
    const expectedClient = Client.create("Jane", "Do");
    expectedClient.id = 1;

    assert.deepStrictEqual(updatedClient, expectedClient);
  });

  it("should throw an error when client does not exist", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const updateClient = new UpdateClient(inMemoryClientRepository);

    //Act
    const promise = updateClient.execute(1, {
      firstName: "Jane",
    });

    // Assert
    await assert.rejects(promise, {
      message: "Client not found",
    });
  });

  const testCases = [
    {
      case: "empty first name",
      payload: {
        firstName: "",
      },
      expected: "Invalid first name",
    },
    {
      case: "empty last name",
      payload: {
        lastName: "",
      },
      expected: "Invalid last name",
    },
  ];

  for (const testCase of testCases) {
    it(`when the client have ${testCase.case}, should return an error ${testCase.expected}`, async () => {
      //Arrange
      const inMemoryClientRepository = new InMemoryClientRepository();
      const updateClient = new UpdateClient(inMemoryClientRepository);
      await inMemoryClientRepository.save({
        firstName: "John",
        lastName: "Doe",
      });

      //Act
      try {
        await updateClient.execute(1, testCase.payload);
      } catch (error) {
        // Assert
        assert.strictEqual(error.message, testCase.expected);
      }
    });
  }

  it("should update partial client details", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();

    await inMemoryClientRepository.save({
      firstName: "John",
      lastName: "Doe",
    });

    const updateClient = new UpdateClient(inMemoryClientRepository);

    //Act
    await updateClient.execute(1, {
      firstName: "Jane",
    });

    // Assert
    const updatedClient = await inMemoryClientRepository.getById(1);
    const expectedClient = Client.create("Jane", "Doe");
    expectedClient.id = 1;

    assert.deepStrictEqual(updatedClient, expectedClient);
  });
});
