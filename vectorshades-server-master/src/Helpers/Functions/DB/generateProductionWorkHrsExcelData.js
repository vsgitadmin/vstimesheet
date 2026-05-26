function generateProductionHoursExcelData(timesheetData) {
  if (!Array.isArray(timesheetData) || timesheetData.length === 0) return [];
  const rows = [];

  const maxDays = Math.max(
    ...timesheetData.map(user =>
      Math.max(...user.entries.map(entry => entry.days.length))
    )
  );

  const baseDate = new Date(timesheetData[0].date);
  const dateHeaders = Array.from({ length: maxDays }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-GB").split("/").join("-");
  });

  const headers = [
    "Date",
    "ID",
    "Name",
    "Project No",
    "Project",
    "Activity Name",
    "Is Billable",
    ...dateHeaders,
    "Total"
  ];
  rows.push(headers);

  // Initialize grand totals
  const grandTotalPerDay = new Array(maxDays).fill(0);
  let grandTotal = 0;

  timesheetData.forEach(user => {
    user.entries.forEach((entry, idx) => {
      const row = [];
      row.push(idx === 0 ? user.date : "");
      row.push(idx === 0 ? user.id : "");
      row.push(idx === 0 ? user.name : "");
      row.push(entry.projectNo);
      row.push(entry.project);
      row.push(entry.activityName);
      row.push(entry.isBillable);

      let total = 0;
      for (let i = 0; i < maxDays; i++) {
        const rawValue = entry.days[i];
        const value =
          rawValue !== undefined && rawValue !== null && rawValue !== ""
            ? Number(rawValue)
            : "";
        if (typeof value === "number" && !isNaN(value)) {
          // store numeric value (used for summation); formatting to Hh Mm happens later
          const rounded = Number(value.toFixed(2));
          row.push(rounded);
          total += rounded;
          grandTotalPerDay[i] += rounded;
        } else {
          row.push("");
        }
      }

      row.push(Number(total.toFixed(2)));
      grandTotal += total;
      rows.push(row);
    });

    // User total row
    const totalRow = new Array(6 + maxDays + 1).fill("");
    const userTotal = new Array(maxDays).fill(0);

    user.entries.forEach(entry => {
      entry.days.forEach((val, i) => {
        userTotal[i] += Number(val) || 0;
      });
    });

    userTotal.forEach((val, i) => {
      totalRow[6 + i] = Number(val.toFixed(2));
    });
    totalRow[6 + maxDays] = Number(
      userTotal.reduce((a, b) => a + b, 0).toFixed(2)
    );

    // add an empty leading cell (you used unshift before)
    totalRow.unshift('');
    rows.push(totalRow);

    // a blank spacer row (keeps same width as headers)
    rows.push(new Array(headers.length).fill(''));
  });

  // add another fully-empty row like original code
  rows.push(new Array(headers.length).fill(""));

  // Add final Grand Total Row
  const grandRow = new Array(6 + maxDays + 1).fill("");
  grandRow[5] = ""; // keeping same structure as your original
  for (let i = 0; i < maxDays; i++) {
    grandRow[6 + i] = Number(grandTotalPerDay[i].toFixed(2));
  }
  grandRow[6 + maxDays] = Number(grandTotal.toFixed(2));
  grandRow.unshift('');
  rows.push(grandRow);

  // ----------------------
  // Conversion step:
  // Convert any numeric cell (type === 'number') to "Hh MMm" format, e.g. 7.5 -> "7h 30m".
  // This runs AFTER all numeric calculations are already done.
  // ----------------------
  function decimalHoursToHm(num) {
    if (typeof num !== "number" || isNaN(num)) return num;
    const sign = num < 0 ? "-" : "";
    let absVal = Math.abs(num);
    let hours = Math.floor(absVal);
    let minutes = Math.round((absVal - hours) * 60);

    // handle rounding up to next hour (e.g. .999 -> 60 min)
    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }

    return `${sign}${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  // Walk through rows (skip header row at index 0) and convert numbers
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (typeof cell === "number" && !isNaN(cell)) {
        row[c] = decimalHoursToHm(cell);
      }
    }
  }

  return rows;
}


module.exports = generateProductionHoursExcelData;
