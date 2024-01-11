import ClientAggregateRepository from "../../core/ports/clientAggregateRepository.js";

class SqlClientAggregateRepository extends ClientAggregateRepository {
  constructor(connection) {
    super();
    this.connection = connection;
  }

  async getAll() {
    const [rows] = await this.connection.execute(
      "SELECT c.id, c.first_name, c.last_name, GROUP_CONCAT(CONCAT('{\"year\":',bs.year,',\"result\":',bs.result,'}')) as balance_sheets FROM clients AS c LEFT JOIN balance_sheets AS bs ON c.id = bs.client_id GROUP BY c.id"
    );

    return rows.map((row) => ({
      ...row,
      balance_sheets: JSON.parse(`[${row.balance_sheets}]`),
    }));
  }
}

export default SqlClientAggregateRepository;
