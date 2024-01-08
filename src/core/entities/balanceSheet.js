class BalanceSheet {
  year;
  clientId;
  result;

  static create(params) {
    const { year, clientId, result } = params;
    let errors = [];

    if (!this.validateYear(year)) {
      errors.push("Invalid year");
    }
    if (!this.validateResult(result)) {
      errors.push("Invalid result");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const balanceSheet = new BalanceSheet();
    balanceSheet.year = year;
    balanceSheet.clientId = clientId;
    balanceSheet.result = result;

    return balanceSheet;
  }

  static validateYear(value) {
    const currentYear = new Date().getFullYear();
    return (
      value && typeof value === "number" && value > 2018 && value <= currentYear
    );
  }

  static validateResult(value) {
    return typeof value === "number";
  }

  updateResult(result) {
    if (!BalanceSheet.validateResult(result)) {
      throw new Error("Invalid result");
    }

    this.result = result;
  }
}

export default BalanceSheet;
