import ClientAggregateRepository from "../../core/ports/clientAggregateRepository.js";

class SqlClientAggregateRepository extends ClientAggregateRepository {
  constructor(connection) {
    super();
    this.connection = connection;
  }

  async getDuplicateClients() {
    const [rows] = await this.connection.execute(
      "SELECT c.id, c.first_name, c.last_name, bs.year, bs.result FROM clients AS c LEFT JOIN balance_sheets AS bs ON c.id = bs.client_id"
    );

    return rows;
  }
}

export default SqlClientAggregateRepository;
