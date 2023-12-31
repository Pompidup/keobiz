import Client from "../../entities/client.js";

class CreateClient {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(client) {
    const newClient = Client.create(client.firstName, client.lastName);
    await this.clientRepository.save(newClient);
  }
}

export default CreateClient;
