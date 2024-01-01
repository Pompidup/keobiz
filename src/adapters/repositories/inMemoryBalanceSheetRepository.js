import BalanceSheet from "../../core/entities/balanceSheet.js";
import BalanceSheetRepository from "../../core/ports/balanceSheetRepository.js";

class InMemoryBalanceSheetRepository extends BalanceSheetRepository {
  constructor() {
    super();
    this.balanceSheets = [];
  }

  async save(balanceSheet) {
    this.balanceSheets.push({
      ...balanceSheet,
    });
  }

  async getBalanceSheets() {
    let balanceSheets = [];
    for (const balanceSheet of this.balanceSheets) {
      let balanceSheetEntity = BalanceSheet.create(balanceSheet);
      balanceSheets.push(balanceSheetEntity);
    }

    return balanceSheets;
  }

  async find(year, clientId) {
    const balanceSheetData = this.balanceSheets.find(
      (balanceSheet) =>
        balanceSheet.year === year && balanceSheet.clientId === clientId
    );
    if (!balanceSheetData) {
      return null;
    }

    return BalanceSheet.create(balanceSheetData);
  }
}

export default InMemoryBalanceSheetRepository;
