import BalanceSheet from "../../entities/balanceSheet.js";

class CreateBalanceSheet {
  constructor(clientRepository, balanceSheetRepository) {
    this.clientRepository = clientRepository;
    this.balanceSheetRepository = balanceSheetRepository;
  }

  async execute({ year, clientId, result }) {
    const client = await this.clientRepository.getById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    const balanceSheetFound = await this.balanceSheetRepository.find(
      year,
      clientId
    );

    if (balanceSheetFound) {
      throw new Error("Balance sheet already exists");
    }

    const balanceSheet = BalanceSheet.create({ year, clientId, result });
    await this.balanceSheetRepository.save(balanceSheet);
  }
}

export default CreateBalanceSheet;
