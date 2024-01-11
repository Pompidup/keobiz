class FindDuplicate {
  constructor(clientAggregateRepository) {
    this.clientAggregateRepository = clientAggregateRepository;
  }

  async execute() {
    const aggregates = await this.clientAggregateRepository.getAll();

    if (!aggregates) {
      return [];
    }

    // Group clients by first and last name
    const groupedClients = aggregates.reduce((groups, client) => {
      const key = `${client.first_name} ${client.last_name}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(client);
      return groups;
    }, {});

    // Find duplicates in each group
    const duplicates = [];
    for (const [name, group] of Object.entries(groupedClients)) {
      if (group.length > 1) {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const commonSheets = group[i].balance_sheets.filter((sheet1) =>
              group[j].balance_sheets.some(
                (sheet2) =>
                  sheet1.year === sheet2.year && sheet1.result === sheet2.result
              )
            );
            if (commonSheets.length >= 2) {
              const duplicate = duplicates.find((dup) => dup.name === name);
              if (duplicate) {
                duplicate.ids.push(group[j].id);
              } else {
                duplicates.push({
                  name: name,
                  ids: [group[i].id, group[j].id],
                });
              }
            }
          }
        }
      }
    }

    return duplicates;
  }
}

export default FindDuplicate;
