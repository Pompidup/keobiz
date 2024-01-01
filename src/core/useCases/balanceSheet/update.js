class UpdateBalanceSheet {
  constructor(clientRepository, balanceSheetRepository) {
    this.clientRepository = clientRepository;
    this.balanceSheetRepository = balanceSheetRepository;
  }

  async execute({ year, clientId, result }) {
    const client = await this.clientRepository.getById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    const balanceSheet = await this.balanceSheetRepository.find(year, clientId);

    if (!balanceSheet) {
      throw new Error("Balance sheet not found");
    }

    balanceSheet.updateResult(result);
    await this.balanceSheetRepository.save(balanceSheet);
  }
}

export default UpdateBalanceSheet;
