import BalanceSheet from "../../core/entities/balanceSheet.js";
import BalanceSheetRepository from "../../core/ports/balanceSheetRepository.js";

class InMemoryBalanceSheetRepository extends BalanceSheetRepository {
  constructor() {
    super();
    this.balanceSheets = [];
  }

  async save(balanceSheet) {
    const index = this.balanceSheets.findIndex(
      (b) =>
        b.year === balanceSheet.year && b.clientId === balanceSheet.clientId
    );
    if (index !== -1) {
      this.balanceSheets[index] = balanceSheet;
      return;
    }

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

  async findByClientId(clientId) {
    let balanceSheets = [];
    for (const balanceSheet of this.balanceSheets) {
      if (balanceSheet.clientId === clientId) {
        let balanceSheetEntity = BalanceSheet.create(balanceSheet);
        balanceSheets.push(balanceSheetEntity);
      }
    }

    return balanceSheets;
  }
}

export default InMemoryBalanceSheetRepository;
