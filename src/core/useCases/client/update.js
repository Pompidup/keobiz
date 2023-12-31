class UpdateClient {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(clientId, clientData) {
    const client = await this.clientRepository.getById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    if (clientData.firstName !== undefined) {
      client.updateFirstName(clientData.firstName);
    }

    if (clientData.lastName !== undefined) {
      client.updateLastName(clientData.lastName);
    }

    await this.clientRepository.save(client);
  }
}

export default UpdateClient;
