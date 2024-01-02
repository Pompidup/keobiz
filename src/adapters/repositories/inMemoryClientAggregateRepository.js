import ClientAggregateRepository from "../../core/ports/clientAggregateRepository.js";

class InMemoryClientAggregateRepository extends ClientAggregateRepository {
  constructor() {
    super();
    this.duplicates = [];
  }

  async setup(results) {
    this.results = results;
  }

  async getDuplicateClients() {
    return this.results;
  }
}

export default InMemoryClientAggregateRepository;
