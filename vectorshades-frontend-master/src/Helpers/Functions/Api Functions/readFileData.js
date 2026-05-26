// csvReader.js

import { viewFileController } from "../../../Controllers/Reports";

export async function fetchCSVData(url) {
  const {data} = await viewFileController(url)
  console.log(data)

  // const response = await fetch(url);
  // const csvText = await response.text();

  // // Split lines (including Windows-style newlines)
  // const rows = csvText.trim().split(/\r?\n/);

  // // Use regex to split by comma, but ignore commas inside double quotes
  // const parseCSVRow = (row) => {
  //   const pattern = /("([^"]|"")*"|[^,]*)/g;
  //   return row.match(pattern).map(cell =>
  //     cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"')
  //   ).filter(val => val !== '');
  // };

  // const headers = parseCSVRow(rows[0]);
  // const data = rows.slice(1).map(row => {
  //   const values = parseCSVRow(row);
  //   const entry = {};
  //   headers.forEach((header, index) => {
  //     entry[header] = values[index] || ''; // Default to empty string if undefined
  //   });
  //   return entry;
  // });

  return data.response.data;
}