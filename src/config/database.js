import mysql from "mysql2/promise";
import { getTestContainerConnection } from "../../tests/testContainers.js";

let connection;

async function getConnection() {
  if (!connection) {
    if (process.env.NODE_ENV === "test") {
      connection = await getTestContainerConnection();
    } else {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      });
    }
  }
  return connection;
}

export default getConnection;
