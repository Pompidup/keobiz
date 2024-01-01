class FindClient {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id) {
    const client = await this.clientRepository.getById(id);

    if (!client) {
      throw new Error("Client not found");
    }

    return client;
  }
}

export default FindClient;
