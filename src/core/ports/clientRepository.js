class ClientRepository {
  async save(client) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  async getClients() {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  async getById(clientId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  async delete(clientId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }
}

export default ClientRepository;
