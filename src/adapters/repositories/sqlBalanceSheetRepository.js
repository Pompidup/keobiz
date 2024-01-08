import BalanceSheet from "../../core/entities/balanceSheet.js";
import BalanceSheetRepository from "../../core/ports/balanceSheetRepository.js";
import pinoLogger from "../loggers/pino.js";

class SqlBalanceSheetRepository extends BalanceSheetRepository {
  constructor(connection) {
    super();
    this.connection = connection;
  }

  async save(balanceSheet) {
    const { year, clientId, result } = balanceSheet;
    // update or insert
    const existingBalanceSheet = await this.find(year, clientId);
    if (existingBalanceSheet) {
      await this.connection.execute(
        "UPDATE balance_sheets SET result = ? WHERE year = ? AND client_id = ?",
        [result, year, clientId]
      );
      pinoLogger.info("Balance sheet updated");
      return;
    }

    await this.connection.execute(
      "INSERT INTO balance_sheets (year, client_id, result) VALUES (?, ?, ?)",
      [year, clientId, result]
    );
    pinoLogger.info("Balance sheet saved");
  }

  async find(year, clientId) {
    const rows = await this.connection.execute(
      "SELECT * FROM balance_sheets WHERE year = ? AND client_id = ?",
      [year, clientId]
    );

    if (rows[0].length === 0) {
      return null;
    }

    const balanceSheet = BalanceSheet.create({
      year: rows[0][0].year,
      clientId: rows[0][0].client_id,
      result: rows[0][0].result,
    });

    pinoLogger.info("Balance sheet found");
    return balanceSheet;
  }

  async getBalanceSheets() {
    const rows = await this.connection.execute("SELECT * FROM balance_sheets");
    return rows[0].map((row) => {
      const balanceSheet = BalanceSheet.create({
        year: row.year,
        clientId: row.client_id,
        result: row.result,
      });

      pinoLogger.info("Balance sheets found");
      return balanceSheet;
    });
  }

  async findByClientId(clientId) {
    const rows = await this.connection.execute(
      "SELECT * FROM balance_sheets WHERE client_id = ?",
      [clientId]
    );

    if (rows[0].length === 0) {
      return null;
    }

    pinoLogger.info("Balance sheets found");

    return rows[0].map((row) => {
      const balanceSheet = BalanceSheet.create({
        year: row.year,
        clientId: row.client_id,
        result: row.result,
      });
      return balanceSheet;
    });
  }

  async delete(year, clientId) {
    await this.connection.execute(
      "DELETE FROM balance_sheets WHERE year = ? AND client_id = ?",
      [year, clientId]
    );

    pinoLogger.info("Balance sheet deleted");
  }
}

export default SqlBalanceSheetRepository;
