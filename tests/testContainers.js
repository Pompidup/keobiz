import { createConnection } from "mysql2/promise";
import { MySqlContainer } from "@testcontainers/mysql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pinoLogger from "../src/adapters/loggers/pino.js";

class DatabaseHelper {
  constructor() {
    this.container = null;
    this.connection = null;
  }

  async startContainer() {
    this.container = await new MySqlContainer("mysql:8.0.26")
      .withEnvironment("MYSQL_DATABASE", "keobiz")
      .withRootPassword("rootpassword")
      .start();

    this.connection = await createConnection({
      host: this.container.getHost(),
      port: this.container.getPort(),
      database: this.container.getDatabase(),
      user: "root",
      password: "rootpassword",
      decimalNumbers: true,
    });
  }

  async create() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dumpPath = path.join(__dirname, "../src/config/dbStruct.sql");
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
  }

  async seed() {
    pinoLogger.info("Loading dump file, seed DB");
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dumpPath = path.join(__dirname, "../src/config/data.sql");
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

      pinoLogger.info("SQL dump imported seed successfully");
    } catch (error) {
      pinoLogger.info("Error importing seed:");
      pinoLogger.error(error);
    }
  }

  async truncate() {
    await this.connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    await this.connection.query("TRUNCATE TABLE clients;");
    await this.connection.query("TRUNCATE TABLE balance_sheets;");
    await this.connection.query("SET FOREIGN_KEY_CHECKS = 1;");
  }

  async reset() {
    await this.truncate();
    await this.seed();
  }

  async stopContainer() {
    if (this.connection) await this.connection.end();
    if (this.container) await this.container.stop();
  }

  async getTestContainerConnection() {
    if (!this.connection) {
      await this.startContainer();
    }
    return this.connection;
  }

  async execute(query) {
    return await this.connection.execute(query);
  }
}

export default DatabaseHelper;
