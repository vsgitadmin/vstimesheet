function generateProductionHoursCSVData(timesheetData) {
  const rows = [];

  const maxDays = Math.max(...timesheetData.map(user =>
    Math.max(...user.entries.map(entry => entry.days.length))
  ));

  // Use the first user's date as the base date
  const baseDate = new Date(timesheetData[0].date);

  // Generate date headers based on baseDate
  const dateHeaders = Array.from({ length: maxDays }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-GB").split("/").join("-"); // "06-05-2025"
  });

  const headers = [
    "Date", "ID", "Name", "Project", "Activity Code",
    "Activity Name", "Is Billable",
    ...dateHeaders,
    "Total"
  ];
  rows.push(headers);

  timesheetData.forEach(user => {
    user.entries.forEach((entry, idx) => {
      const row = [];
      row.push(idx === 0 ? user.date : "");
      row.push(idx === 0 ? user.id : "");
      row.push(idx === 0 ? user.name : "");
      row.push(entry.project);
      row.push(entry.activityCode);
      row.push(entry.activityName);
      row.push(entry.isBillable);

      let total = 0;
      for (let i = 0; i < maxDays; i++) {
        const rawValue = entry.days[i];
        const value = rawValue !== undefined && rawValue !== null && rawValue !== "" ? Number(rawValue) : "";
        row.push(typeof value === "number" ? value.toFixed(2) : "");
        total += typeof value === "number" ? value : 0;
      }

      row.push(total.toFixed(2));
      rows.push(row);
    });

    // Total row
    const totalRow = new Array(7 + maxDays + 1).fill("");
    const userTotal = Array(maxDays).fill(0);
    user.entries.forEach(entry => {
      entry.days.forEach((val, i) => {
        userTotal[i] += Number(val) || 0;
      });
    });

    userTotal.forEach((val, i) => totalRow[7 + i] = val.toFixed(2));
    totalRow[7 + maxDays] = userTotal.reduce((a, b) => a + b, 0).toFixed(2);
    rows.push(totalRow);

    // Spacer row
    rows.push(new Array(headers.length).fill(""));
  });

  return rows.map(row => row.join(",")).join("\n");
}

module.exports = generateProductionHoursCSVData;
