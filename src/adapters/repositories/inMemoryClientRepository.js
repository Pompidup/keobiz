import Client from "../../core/entities/client.js";
import ClientRepository from "../../core/ports/clientRepository.js";

class InMemoryClientRepository extends ClientRepository {
  id = 1;

  constructor() {
    super();
    this.clients = [];
  }

  async save(client) {
    if (client.id) {
      const index = this.clients.findIndex((c) => c.id === client.id);
      if (index !== -1) {
        this.clients[index] = client;
      }
    } else {
      client.id = this.id++;
      this.clients.push({
        ...client,
      });
    }
  }

  async getClients() {
    let clients = [];
    for (const client of this.clients) {
      let clientEntity = Client.create(client.firstName, client.lastName);
      clientEntity.id = client.id;
      clients.push(clientEntity);
    }

    return clients;
  }

  async getById(clientId) {
    const clientData = this.clients.find((client) => client.id === clientId);
    if (!clientData) {
      return null;
    }

    let client = Client.create(clientData.firstName, clientData.lastName);
    client.id = clientData.id;
    return client;
  }
}

export default InMemoryClientRepository;
