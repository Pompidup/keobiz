import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

import InMemoryClientAggregateRepository from "../../../adapters/repositories/inMemoryClientAggregateRepository.js";
import FindDuplicate from "./findDuplicate.js";

describe("Find Duplicate", () => {
  let findDuplicate;
  let inMemoryClientAggregateRepository;

  beforeEach(() => {
    inMemoryClientAggregateRepository = new InMemoryClientAggregateRepository();
    findDuplicate = new FindDuplicate(inMemoryClientAggregateRepository);
  });

  it("should find duplicate clients with 2 equals balance sheets", async () => {
    // Arrange
    inMemoryClientAggregateRepository.setup([
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2020,
        result: 1234,
      },
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2021,
        result: 556,
      },
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2022,
        result: 3567,
      },
      {
        id: 2,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2020,
        result: 1234,
      },
      {
        id: 2,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2021,
        result: 556,
      },
    ]);

    // Act
    const duplicateClients = await findDuplicate.execute();

    // Assert
    assert.strictEqual(duplicateClients.length, 1);
    assert.deepStrictEqual(duplicateClients, [
      {
        name: "Pierre Bernard",
        ids: [1, 2],
      },
    ]);
  });

  it("should return empty array if not found duplicate clients", async () => {
    // Arrange
    inMemoryClientAggregateRepository.setup([]);

    // Act
    const duplicateClients = await findDuplicate.execute();

    // Assert
    assert.strictEqual(duplicateClients.length, 0);
    assert.deepStrictEqual(duplicateClients, []);
  });

  it("should not return clients with only 1 equal balance sheets", async () => {
    // Arrange
    inMemoryClientAggregateRepository.setup([
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2019,
        result: 674,
      },
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2020,
        result: 1234,
      },
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2021,
        result: 556,
      },
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2022,
        result: 3567,
      },
      {
        id: 1,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2023,
        result: 245,
      },
      {
        id: 2,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2021,
        result: 4235,
      },
      {
        id: 2,
        first_name: "Pierre",
        last_name: "Bernard",
        year: 2022,
        result: 3567,
      },
    ]);

    // Act
    const duplicateClients = await findDuplicate.execute();

    // Assert
    assert.strictEqual(duplicateClients.length, 0);
    assert.deepStrictEqual(duplicateClients, []);
  });
});
