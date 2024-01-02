class FindDuplicate {
  constructor(clientAggregateRepository) {
    this.clientAggregateRepository = clientAggregateRepository;
  }

  async execute() {
    const aggregates =
      await this.clientAggregateRepository.getDuplicateClients();

    return aggregates;
  }
}

export default FindDuplicate;
