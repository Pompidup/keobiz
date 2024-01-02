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

  it("should find duplicate clients", async () => {
    // Arrange
    inMemoryClientAggregateRepository.setup([1, 2]);

    // Act
    const duplicateClients = await findDuplicate.execute();

    // Assert
    assert.strictEqual(duplicateClients.length, 2);
    assert.deepStrictEqual(duplicateClients, [1, 2]);
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
});
