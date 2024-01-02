class DeleteClient {
  constructor(clientRepository, balanceSheetRepository) {
    this.clientRepository = clientRepository;
    this.balanceSheetRepository = balanceSheetRepository;
  }

  async execute(id) {
    const client = await this.clientRepository.getById(id);

    if (!client) {
      throw new Error("Client not found");
    }

    const balanceSheets = await this.balanceSheetRepository.findByClientId(id);

    for (const balanceSheet of balanceSheets) {
      await this.balanceSheetRepository.delete(balanceSheet.year, id);
    }

    await this.clientRepository.delete(id);
  }
}

export default DeleteClient;
