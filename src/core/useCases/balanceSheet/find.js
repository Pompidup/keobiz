class FindBalanceSheet {
  constructor(clientRepository, balanceSheetRepository) {
    this.clientRepository = clientRepository;
    this.balanceSheetRepository = balanceSheetRepository;
  }

  async execute(clientId) {
    const client = await this.clientRepository.getById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    return this.balanceSheetRepository.findByClientId(clientId);
  }
}

export default FindBalanceSheet;
