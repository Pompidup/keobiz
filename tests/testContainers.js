import { createConnection } from "mysql2/promise";
import { MySqlContainer } from "@testcontainers/mysql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let container;
let connection;

export async function startContainer() {
  container = await new MySqlContainer("mysql:8.0.26")
    .withEnvironment("MYSQL_DATABASE", "keobiz")
    .withRootPassword("rootpassword")
    .start();

  connection = await createConnection({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: "root",
    password: "rootpassword",
  });
}

export async function loadDump() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dumpPath = path.join(__dirname, "../src/config/dump.sql");
  const dump = fs.readFileSync(dumpPath, "utf8");
  const queries = dump.split(";");

  for (const query of queries) {
    const trimmedQuery = query.trim();
    if (
      trimmedQuery !== "" &&
      !trimmedQuery.startsWith("/*!") &&
      !trimmedQuery.endsWith("*/")
    ) {
      await connection.query(trimmedQuery);
    }
  }
}

export async function reset() {
  await connection.query("DROP TABLE IF EXISTS balance_sheets");
  await connection.query("DROP TABLE IF EXISTS clients");
  await loadDump();
}

export async function stopContainer() {
  await connection.end();
  await container.stop();
}

export async function getTestContainerConnection() {
  if (!connection) {
    await startContainer();
  }
  return connection;
}
