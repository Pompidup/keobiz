import mysql from "mysql2/promise";
import pinoLogger from "../adapters/loggers/pino.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class Database {
  constructor() {
    this.connection = null;
  }

  async waitConnection() {
    while (true) {
      try {
        this.connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          port: process.env.DB_PORT,
          decimalNumbers: true,
        });
        break;
      } catch (error) {
        pinoLogger.info("Cannot connect to MySQL, retrying in 5 seconds");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async getConnection() {
    return this.connection;
  }

  async create() {
    pinoLogger.info("Loading dump file, create DB");
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dumpPath = path.join(__dirname, "dbStruct.sql");
      const dump = fs.readFileSync(dumpPath, "utf8");
      const queries = dump.split(";");

      for (const query of queries) {
        const trimmedQuery = query.trim();
        if (
          trimmedQuery !== "" &&
          !trimmedQuery.startsWith("/*!") &&
          !trimmedQuery.endsWith("*/")
        ) {
          await this.connection.query(trimmedQuery);
        }
      }

      pinoLogger.info("SQL dump imported successfully");
    } catch (error) {
      pinoLogger.info("Create DB, Error importing SQL dump:");
      pinoLogger.error(error);
    }
  }

  async seed() {
    pinoLogger.info("Loading dump file, seed DB");
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dumpPath = path.join(__dirname, "data.sql");
      const dump = fs.readFileSync(dumpPath, "utf8");
      const queries = dump.split(";");

      for (const query of queries) {
        const trimmedQuery = query.trim();
        if (
          trimmedQuery !== "" &&
          !trimmedQuery.startsWith("/*!") &&
          !trimmedQuery.endsWith("*/")
        ) {
          await this.connection.query(trimmedQuery);
        }
      }

      pinoLogger.info("SQL dump imported successfully");
    } catch (error) {
      pinoLogger.info("Error importing SQL dump:");
      pinoLogger.error(error);
    }
  }
}

export default Database;
