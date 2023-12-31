import getConnection from "../../config/database.js";
import Client from "../../core/entities/client.js";
import ClientRepository from "../../core/ports/clientRepository.js";

class SqlClientRepository extends ClientRepository {
  constructor() {
    super();
  }

  async init() {
    this.connection = await getConnection();
    console.log("SqlClientRepository initialized");
  }

  async getClients() {
    const [rows] = await this.connection.execute("SELECT * FROM clients");
    return rows.map((row) => {
      const client = Client.create(row.first_name, row.last_name);
      client.id = row.id;
      return client;
    });
  }

  async save(client) {
    const { firstName, lastName, id } = client;
    if (id) {
      await this.connection.execute(
        "UPDATE clients SET first_name = ?, last_name = ? WHERE id = ?",
        [firstName, lastName, id]
      );
      return;
    }
    await this.connection.execute(
      "INSERT INTO clients (first_name, last_name) VALUES (?, ?)",
      [firstName, lastName]
    );
  }

  async getById(clientId) {
    const [rows] = await this.connection.execute(
      "SELECT * FROM clients WHERE id = ?",
      [clientId]
    );
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const client = Client.create(row.first_name, row.last_name);
    client.id = row.id;
    return client;
  }

  async delete(clientId) {
    await this.connection.execute("DELETE FROM clients WHERE id = ?", [
      clientId,
    ]);
  }
}

export default SqlClientRepository;
