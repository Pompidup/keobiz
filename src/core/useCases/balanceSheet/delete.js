class DeleteBalanceSheet {
  constructor(balanceSheetRepository) {
    this.balanceSheetRepository = balanceSheetRepository;
  }

  async execute(year, clientId) {
    const balanceSheet = await this.balanceSheetRepository.find(year, clientId);
    if (!balanceSheet) {
      throw new Error("Balance sheet not found");
    }

    await this.balanceSheetRepository.delete(year, clientId);
  }
}

export default DeleteBalanceSheet;
