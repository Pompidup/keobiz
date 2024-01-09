import container from "../di/container.js";
import pinoLogger from "../../adapters/loggers/pino.js";

const findDuplicates = async () => {
  pinoLogger.info("Finding duplicate clients");
  const findDuplicateClient = await container.resolve("findDuplicateClient");

  const duplicateClients = await findDuplicateClient.execute();

  if (duplicateClients.length === 0) {
    pinoLogger.info("No duplicate clients found");
    return;
  }

  pinoLogger.info(`Found ${duplicateClients.length} duplicate clients`);
  pinoLogger.info("Duplicate clients:");
  pinoLogger.info(duplicateClients);

  return;
};

await findDuplicates();

export default findDuplicates;
