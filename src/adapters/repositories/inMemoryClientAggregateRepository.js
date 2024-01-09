import ClientAggregateRepository from "../../core/ports/clientAggregateRepository.js";

class InMemoryClientAggregateRepository extends ClientAggregateRepository {
  constructor() {
    super();
    this.duplicates;
  }

  async setup(expected) {
    this.duplicates = expected;
  }

  async getDuplicateClients() {
    return this.duplicates;
  }
}

export default InMemoryClientAggregateRepository;
