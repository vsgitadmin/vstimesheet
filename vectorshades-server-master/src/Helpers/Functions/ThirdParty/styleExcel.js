const ExcelJS = require('exceljs');

async function generateStyledWorkbook(data, sheetName) {
  const workbook = new ExcelJS.Workbook();
  try {
    const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

    if (!Array.isArray(data) || data.length === 0) return workbook;

    // --- Normalize input to AOA (headers array + rows array) ---
    let headers = [];
    let rows = [];

    if (Array.isArray(data[0])) {
      // Already AOA: first row is headers, rest are rows (arrays)
      headers = data[0].map(h => String(h));
      rows = data.slice(1).map(r => (Array.isArray(r) ? r : Object.values(r)));
    } else if (typeof data[0] === 'object' && data[0] !== null) {
      // Array of objects => use keys as headers (in insertion order)
      headers = Object.keys(data[0]).map(h => String(h));
      rows = data.map(rowObj => headers.map(h => rowObj[h] ?? ''));
    } else {
      // Fallback: treat each item as a single-row array
      headers = ['Value'];
      rows = data.map(item => [item]);
    }

    // Filter out rows that are completely empty
    const filteredRows = rows.filter(row => !row.every(cell => cell === '' || cell === null || cell === undefined));

    if (filteredRows.length === 0) return workbook;

    // --- Build column definitions using your width rules ---
    const columnDefs = headers.map((header) => {
      const label = String(header);
      let defaultWidth = label.length < 10 ? 15 : label.length + 5;
      let forcedWidth = defaultWidth;

      if (label === 'Name') forcedWidth = 30;
      else if (label === 'Project') forcedWidth = 80;
      else if (label === 'Activity Code') forcedWidth = 80;
      else if (label === 'Activity Name') forcedWidth = 80;
      else if (label === 'CO Hours') forcedWidth = 15;
      else if (label === 'Tonnage Detailed') forcedWidth = 18;

      const colDef = {
        header: label,
        key: label,
        width: forcedWidth,
        style: {
          font: { name: 'Calibri', size: 11 },
          alignment: { vertical: 'middle', horizontal: 'center' }
        }
      };

      // Date header detection: 'date' substring or dd-mm-yyyy style header
      if (/date/i.test(label) || /^\d{2}-\d{2}-\d{4}$/.test(label)) {
        colDef.style.numFmt = 'yyyy-mm-dd';
        colDef.width = Math.max(forcedWidth, 15);
        colDef.style.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      // Totals and day columns (dd-mm-yyyy) numeric formatting
      if (label === 'Total' || /^\d{2}-\d{2}-\d{4}$/.test(label)) {
        colDef.style.numFmt = '#,##0.00';
        colDef.style.alignment = { vertical: 'middle', horizontal: 'center' };
        colDef.width = Math.max(forcedWidth, 12);
      }

      // Tonnage Detailed holds tons, not a time duration — keep plain decimal formatting
      if (label === 'Tonnage Detailed') {
        colDef.style.numFmt = '#,##0.00';
      }

      return colDef;
    });

    worksheet.columns = columnDefs;

    // --- Header styling (row 1) ---
    const headerRow = worksheet.getRow(1);
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB22222' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // --- Append rows (starting from row 2) ---
    filteredRows.forEach((rowArray) => {
      const excelRow = worksheet.addRow(rowArray);

      // Default row styles
      excelRow.height = 16;
      excelRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        // Try to coerce date-like values into Excel dates for date columns
        const colIdx = cell.col - 1; // zero-based index
        const headerLabel = headers[colIdx] ?? '';

        if ((/date/i.test(headerLabel) || /^\d{2}-\d{2}-\d{4}$/.test(headerLabel)) && typeof cell.value === 'string') {
          // try dd-mm-yyyy or yyyy-mm-dd parsing
          const s = cell.value.trim();
          let parsed = null;
          // dd-mm-yyyy => try split
          const ddmmyyyy = /^\s*(\d{2})-(\d{2})-(\d{4})\s*$/.exec(s);
          if (ddmmyyyy) {
            parsed = new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}T00:00:00`);
          } else {
            const tryDate = new Date(s);
            if (!isNaN(tryDate)) parsed = tryDate;
          }
          if (parsed && !isNaN(parsed)) {
            cell.value = parsed;
            cell.numFmt = 'yyyy-mm-dd';
          }
        }

        // If the value is already a string like "7h 30m" or similar, leave it alone.
        // If it is a number and the header suggests numeric (Total/day), keep number as-is.
      });

    });

    // --- Identify and style "user total" rows and the final "grand total" cell ---
    const totalColIndex = headers.findIndex(h => String(h).toLowerCase() === 'total');
    if (totalColIndex !== -1) {
      const totalCol = totalColIndex + 1; // ExcelJS is 1-based for getCell

      // Find all rows where Total column has a value and the left columns are empty
      const userTotalRows = [];
      let grandTotalRowIndex = null;

      // iterate from row 2 (worksheet.rowCount includes header)
      for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const totalCell = row.getCell(totalCol);
        const totalVal = totalCell.value;

        const firstSixEmpty = headers.slice(0, 6).every((h, idx) => {
          const cell = row.getCell(idx + 1).value;
          return cell === '' || cell === null || cell === undefined;
        });

        const hasTotalValue = !(totalVal === '' || totalVal === null || totalVal === undefined);

        if (hasTotalValue) {
          grandTotalRowIndex = r; // keep updating: last non-empty becomes grand total candidate
          if (firstSixEmpty) {
            userTotalRows.push(r);
          }
        }
      }

      // Style user total rows (bold)
      userTotalRows.forEach(r => {
        const row = worksheet.getRow(r);
        row.eachCell(cell => {
          cell.font = Object.assign({}, cell.font || {}, { name: 'Calibri', size: 11, bold: true });
        });
      });

      // Style the grand total cell (last non-empty in Total col)
      if (grandTotalRowIndex) {
        const gRow = worksheet.getRow(grandTotalRowIndex);
        const gCell = gRow.getCell(totalCol);
        // Bold the final total cell and give the row a subtle fill for emphasis
        gCell.font = Object.assign({}, gCell.font || {}, { name: 'Calibri', size: 11, bold: true });
        gRow.eachCell((cell, colNumber) => {
          // Optionally bold whole row — here we bold only the row text to make grand row stand out.
          cell.font = Object.assign({}, cell.font || {}, { name: 'Calibri', size: 11, bold: true });
        });
        gRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' } // light gray
        };
      }
    }

    return workbook;
  } catch (err) {
    console.error(err);
    return workbook;
  }
}


async function generateGeneralStyledWorkbook(data, sheetName) {
  const workbook = new ExcelJS.Workbook();
  try {
    const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');
    if (!Array.isArray(data) || data.length === 0) {
      return workbook;
    }

    // Derive headers from the first object’s keys
    const headers = Object.keys(data[0]);

    // Compute column widths based on header and cell values
    const colWidths = headers.map(header => {
      let maxLen = String(header).length;
      data.forEach(rowObj => {
        const cellValue = rowObj[header] == null ? '' : String(rowObj[header]);
        if (cellValue.length > maxLen) {
          maxLen = cellValue.length;
        }
      });
      return maxLen + 5; // add some padding
    });

    // Define columns with header, key, width, and base style
    worksheet.columns = headers.map((header, idx) => ({
      header,
      key: header,
      width: colWidths[idx],
      style: {
        font: { name: 'Calibri', size: 11 },
        alignment: { vertical: 'middle', horizontal: 'left', wrapText: true }
      }
    }));

    // Add each data row (object) to the worksheet
    data.forEach(rowObj => {
      worksheet.addRow(rowObj);
    });

    // Style the header row (row 1) with a red theme
    const headerRow = worksheet.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell(cell => {
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB22222' } // dark red
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Freeze the header row
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // Apply zebra striping and basic styling to data rows (row 2 onward)
    const lightRedFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFE5E5' } // very light red/pink
    };

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      row.height = 18;
      const isEven = rowNumber % 2 === 0;

      row.eachCell({ includeEmpty: true }, cell => {
        cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (isEven) {
          cell.fill = lightRedFill;
        }
      });
    });

    return workbook;
  } catch (err) {
    console.error(err);
    return workbook;
  }
}
  

module.exports = {
  generateStyledWorkbook,
  generateGeneralStyledWorkbook
};
