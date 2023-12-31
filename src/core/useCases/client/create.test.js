import { describe, it } from "node:test";
import assert from "node:assert";

import CreateClient from "./create.js";
import InMemoryClientRepository from "../../../adapters/repositories/inMemoryClientRepository.js";
import Client from "../../entities/client.js";

describe("Create Client", () => {
  it("should create a new client", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const createClient = new CreateClient(inMemoryClientRepository);

    //Act
    await createClient.execute({
      firstName: "John",
      lastName: "Doe",
    });

    // Assert
    const clients = await inMemoryClientRepository.getClients();
    assert.strictEqual(clients.length, 1);
  });

  it("should create a namesake client", async () => {
    //Arrange
    const inMemoryClientRepository = new InMemoryClientRepository();
    const createClient = new CreateClient(inMemoryClientRepository);

    await createClient.execute({
      firstName: "John",
      lastName: "Doe",
    });

    //Act
    await createClient.execute({
      firstName: "John",
      lastName: "Doe",
    });

    // Assert
    const clients = await inMemoryClientRepository.getClients();
    const firstExpectedClient = Client.create("John", "Doe");
    firstExpectedClient.id = 1;
    const secondExpectedClient = Client.create("John", "Doe");
    secondExpectedClient.id = 2;

    assert.strictEqual(clients.length, 2);
    assert.deepStrictEqual(clients[0], firstExpectedClient);
    assert.deepStrictEqual(clients[1], secondExpectedClient);
  });

  const testCases = [
    {
      case: "empty last name",
      payload: {
        firstName: "John",
        lastName: "",
      },
      expected: "First and last name are required",
    },
    {
      case: "empty first name",
      payload: {
        firstName: "",
        lastName: "Doe",
      },
      expected: "First and last name are required",
    },
    {
      case: "empty first and last name",
      payload: {
        firstName: "",
        lastName: "",
      },
      expected: "First and last name are required",
    },
    {
      case: "missing last name",
      payload: {
        firstName: "John",
      },
      expected: "First and last name are required",
    },
  ];

  for (const testCase of testCases) {
    it(`when the client have ${testCase.case}, should return an error ${testCase.expected}`, async () => {
      //Arrange
      const inMemoryClientRepository = new InMemoryClientRepository();
      const createClient = new CreateClient(inMemoryClientRepository);

      //Act
      try {
        await createClient.execute(testCase.payload);
      } catch (error) {
        // Assert
        assert.strictEqual(error.message, testCase.expected);
      }
    });
  }
});
