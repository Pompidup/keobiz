class FindDuplicate {
  constructor(clientAggregateRepository) {
    this.clientAggregateRepository = clientAggregateRepository;
  }

  async execute() {
    const aggregates =
      await this.clientAggregateRepository.getDuplicateClients();

    if (!aggregates) {
      return [];
    }

    const clients = {};

    for (const aggregate of aggregates) {
      const key = `${aggregate.first_name} ${aggregate.last_name}`;
      if (!clients[key]) {
        clients[key] = [];
      }
      clients[key].push({
        year: aggregate.year,
        result: aggregate.result,
        id: aggregate.id,
      });
    }

    const duplicates = [];
    for (let key in clients) {
      let yearsResults = clients[key];
      let sortedYearsResults = yearsResults.sort((a, b) => a.year - b.year);
      let groupByYear = groupBy(sortedYearsResults, "year");
      let filteredGroups = Object.values(groupByYear).filter(
        (group) =>
          group.length >= 2 &&
          group.every((item) => item.result === group[0].result)
      );

      if (filteredGroups.length > 1) {
        duplicates.push({
          name: key,
          ids: [...new Set(filteredGroups.flat().map((item) => item.id))],
        });
      }
    }

    return duplicates;
  }
}

function groupBy(array, key) {
  let result = {};
  array.forEach((item) => {
    if (!result[item[key]]) {
      result[item[key]] = [];
    }
    result[item[key]].push(item);
  });
  return result;
}

export default FindDuplicate;
