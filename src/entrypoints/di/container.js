import { createContainer, asClass, asValue } from "awilix";
import InMemoryClientRepository from "../../adapters/repositories/inMemoryClientRepository.js";
import InMemoryBalanceSheetRepository from "../../adapters/repositories/inMemoryBalanceSheetRepository.js";
import InMemoryClientAggregateRepository from "../../adapters/repositories/inMemoryClientAggregateRepository.js";
import SqlClientRepository from "../../adapters/repositories/sqlClientRepository.js";
import SqlBalanceSheetRepository from "../../adapters/repositories/sqlBalanceSheetRepository.js";
import SqlClientAggregateRepository from "../../adapters/repositories/sqlClientAggregateRepository.js";

import CreateClient from "../../core/useCases/client/create.js";
import DeleteClient from "../../core/useCases/client/delete.js";
import UpdateClient from "../../core/useCases/client/update.js";
import FindClient from "../../core/useCases/client/find.js";
import FindDuplicate from "../../core/useCases/client/findDuplicate.js";
import CreateBalanceSheet from "../../core/useCases/balanceSheet/create.js";
import DeleteBalanceSheet from "../../core/useCases/balanceSheet/delete.js";
import FindBalanceSheet from "../../core/useCases/balanceSheet/find.js";
import UpdateBalanceSheet from "../../core/useCases/balanceSheet/update.js";
import Database from "../../config/database.js";

const container = createContainer({
  injectionMode: "CLASSIC",
});

// Register dependencies

let sqlClientRepository;
let sqlBalanceSheetRepository;
let sqlClientAggregateRepository;
if (process.env.NODE_ENV === "production") {
  const database = new Database();
  await database.waitConnection();
  const connection = await database.getConnection();
  await database.create();
  sqlClientRepository = new SqlClientRepository(connection);
  sqlBalanceSheetRepository = new SqlBalanceSheetRepository(connection);
  sqlClientAggregateRepository = new SqlClientAggregateRepository(connection);
}

container.register({
  // Repositories
  clientRepository:
    process.env.NODE_ENV === "production"
      ? asValue(sqlClientRepository)
      : asClass(InMemoryClientRepository).singleton(),
  balanceSheetRepository:
    process.env.NODE_ENV === "production"
      ? asValue(sqlBalanceSheetRepository)
      : asClass(InMemoryBalanceSheetRepository).singleton(),
  clientAggregateRepository:
    process.env.NODE_ENV === "production"
      ? asValue(sqlClientAggregateRepository)
      : asClass(InMemoryClientAggregateRepository).singleton(),

  // Use cases
  createClient: asClass(CreateClient).singleton(),
  deleteClient: asClass(DeleteClient).singleton(),
  updateClient: asClass(UpdateClient).singleton(),
  findClient: asClass(FindClient).singleton(),
  findDuplicateClient: asClass(FindDuplicate).singleton(),
  createBS: asClass(CreateBalanceSheet).singleton(),
  deleteBS: asClass(DeleteBalanceSheet).singleton(),
  findBS: asClass(FindBalanceSheet).singleton(),
  updateBS: asClass(UpdateBalanceSheet).singleton(),
});

export default container;
