// Steel spreadsheet
const CLIENTS_SHEET_ID = "1m-uMO7LdxtEuCGaIZDmX2RVSuStnw4cC";

// Rebar spreadsheet
const REBAR_SHEET_ID = "16EZUTQ2uxHgmdLU_sPuZbBxi_P8_scAa";

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Handle escaped quotes: "" inside a quoted field.
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out;
}

function buildClientsObjectFromRows(rows) {
  // Expect columns:
  // A: (ignored) "#"
  // B: Client Name
  // C: Added On
  // D: OFA Formula
  // E: FAB Formula
  const clients = {};

  for (const row of rows) {
    if (!row || row.length < 2) continue;

    const name = (row[1] || "").trim();
    if (!name) continue;
    if (name.toLowerCase() === "client name") continue;

    clients[name] = {
      addedOn: (row[2] || "").trim(),
      OFAFormula: (row[3] || "").trim(),
      FABFormula: (row[4] || "").trim(),
      name,
    };
  }

  return clients;
}

async function fetchSheetCsv({ sheetId, sheetName }) {
  // Google "gviz" CSV endpoint. Works for public sheets without auth.
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Google Sheets fetch failed (${res.status}) for sheet "${sheetName}"`);
  }
  return await res.text();
}

async function loadClientsFromSheetNames({ sheetId, sheetNames }) {
  const errors = [];

  for (const sheetName of sheetNames) {
    try {
      const csvText = await fetchSheetCsv({
        sheetId,
        sheetName,
      });

      const lines = csvText.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) continue;

      // Remove header row if it exists.
      const headerCols = parseCsvLine(lines[0]);
      const headerLooksValid =
        (headerCols[0] || "").trim() === "#" ||
        (headerCols[1] || "").trim().toLowerCase() === "client name";

      const dataLines = headerLooksValid ? lines.slice(1) : lines;
      const rows = dataLines.map(parseCsvLine);
      return buildClientsObjectFromRows(rows);
    } catch (e) {
      errors.push({ sheetName, message: String(e?.message || e) });
    }
  }

  const err = new Error(
    `Unable to load clients from Google Sheets. Tried: ${sheetNames.join(", ")}`
  );
  err.details = errors;
  throw err;
}

let clientsCache = null;
let clientsPromise = null;

let rebarClientsCache = null;
let rebarClientsPromise = null;

export async function getClientsFromGoogleSheet() {
  if (clientsCache) return clientsCache;
  if (!clientsPromise) {
    clientsPromise = loadClientsFromSheetNames({
      sheetId: CLIENTS_SHEET_ID,
      sheetNames: ["clients"],
    });
  }
  clientsCache = await clientsPromise;
  return clientsCache;
}

export async function getRebarClientsFromGoogleSheet() {
  if (rebarClientsCache) return rebarClientsCache;
  if (!rebarClientsPromise) {
    // Rebar sheet/tab is known.
    rebarClientsPromise = loadClientsFromSheetNames({
      sheetId: REBAR_SHEET_ID,
      sheetNames: ["rebarClients"],
    });
  }
  rebarClientsCache = await rebarClientsPromise;
  return rebarClientsCache;
}

