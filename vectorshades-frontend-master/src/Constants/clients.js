import { useEffect, useState } from "react";
import { getClientsFromGoogleSheet } from "./sheets/loadClientsFromGoogleSheets";

const clients = {}

// const clients = {
//     "Vectorshades": {
//         addedOn: "22-5-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Vectorshades"
//     },
//     "GSMS GA Speciality Metal Supply": {
//         addedOn: "22-5-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "GSMS GA Speciality Metal Supply"
//     },
//     "Gem City Steel Supply": {
//         addedOn: "03-10-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Gem City Steel Supply"
//     },
//     "GP Metal Fabrication": {
//         addedOn: "22-5-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "GP Metal Fabrication"
//     },
//     "United Steel Fabrication LLC": {
//         addedOn: "22-5-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "United Steel Fabrication LLC"
//     },
//     "Remo Steel Fabricators, Inc.": {
//         addedOn: "18-6-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Remo Steel Fabricators, Inc."
//     },
//     "Holley Steel, Inc": {
//         addedOn: "18-6-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Holley Steel, Inc"
//     },
//     "Baltimore Fabrication": {
//         addedOn: "30-7-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Baltimore Fabrication"
//     },
//     "Custom Metal Fabrication": {
//         addedOn: "23-7-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Custom Metal Fabrication"
//     },
//     "AMFab-Steel": {
//         addedOn: "23-7-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "AMFab-Steel"
//     },
//     "Palmetto welding and fabrication": {
//         addedOn: "3-7-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Palmetto welding and fabrication"
//     },
//     "Speedway Steel": {
//         addedOn: "22-6-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Speedway Steel"
//     },
//     "Southeastern Steel Inc": {
//         addedOn: "22-5-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Southeastern Steel Inc"
//     },
//     "Texas Steel": {
//         addedOn: "24-8-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Texas Steel"
//     },
//     "Morrow Steel": {
//         addedOn: "24-8-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Morrow Steel"
//     },
//     "Porter Steel": {
//         addedOn: "2-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Porter Steel"
//     },
//     "Village Forge Inc": {
//         addedOn: "11-11-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Village Forge Inc"
//     },
//     "J&P Ironworks": {
//         addedOn: "24-8-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "J&P Ironworks"
//     },
//     "Saber Steel": {
//         addedOn: "04-5-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Saber Steel"
//     },
//     "Gresham Steel Fabricators": {
//         addedOn: "24-8-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Gresham Steel Fabricators"
//     },
//     "Benchmark Steel": {
//         addedOn: "24-8-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Benchmark Steel"
//     },
//     "Shamrock Construction Group": {
//         addedOn: "24-8-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Shamrock Construction Group"
//     },
//     "Chesapeake Bay Steel": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Chesapeake Bay Steel"
//     },
//     "State Steel Works": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "State Steel Works"
//     },
//     "DDM Steel Construction": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "DDM Steel Construction"
//     },
//     "Lafayette Structural Steel": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Lafayette Structural Steel"
//     },
//     "Viking Steel Fabricators": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Viking Steel Fabricators"
//     },
//     "Waukegan Steel LLC": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Waukegan Steel LLC"
//     },
//     "Myers Steel Works": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Myers Steel Works"
//     },
//     "A & R Iron Works": {
//         addedOn: "15-9-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "A & R Iron Works"
//     },
//     "Six26construction": {
//         addedOn: "19-11-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Six26construction"
//     },
//     "United weld services": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "United weld services"
//     },
//     "United Steel works": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "United Steel works"
//     },
//     "Eagle Fabricators": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Eagle Fabricators"
//     },
//     "Gridiron Steel": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Gridiron Steel"
//     },
//     "Ira G Steffy & Son": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Ira G Steffy & Son"
//     },
//     "Patriot Steel fabrication": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Patriot Steel fabrication"
//     },
//     "UMC Fabricator": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "UMC Fabricator"
//     },
//     "Elevated Steel": {
//         addedOn: "16-12-2024",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Elevated Steel"
//     },
//     "Lawton Welding": {
//         addedOn: "2-4-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Lawton Welding"
//     },
//     "Lear West Fabrication": {
//         addedOn: "2-4-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Lear West Fabrication"
//     },
//     "A & E Steel Inc": {
//         addedOn: "2-4-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "A & E Steel Inc"
//     },
//     "BA Steel": {
//         addedOn: "2-4-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "BA Steel"
//     },
//     "MacAljon Fabrication": {
//         addedOn: "2-4-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "MacAljon Fabrication"
//     },
//     "JONQUIL STEEL AND CONSTRUCTION CO INC.": {
//         addedOn: "29-9-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "JONQUIL STEEL AND CONSTRUCTION CO INC."
//     },
//     "Triple Steel": {
//         addedOn: "24-10-2025",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Triple Steel"
//     },
//     "Fabricated Products of Tampa": {
//         addedOn: "21-1-2026",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Fabricated Products of Tampa"
//     },
//     "GPLA": {
//         addedOn: "29-1-2026",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "GPLA"
//     },
//     "Robo Construction": {
//         addedOn: "29-1-2026",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Robo Construction"
//     },    
//     "Hambric Steel": {
//         addedOn: "16-2-2026",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Hambric Steel"
//     },
//     "Capital Steel": {
//         addedOn: "16-2-2026",
//         OFAFormula: "poPrice%50",
//         FABFormula: "poPrice%50",
//         name: "Capital Steel"
//     }
// };

export default clients;

export function useClients() {
  const [sheetClients, setSheetClients] = useState(clients);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getClientsFromGoogleSheet()
      .then((data) => {
        if (cancelled) return;
        setSheetClients(data || {});
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        // Keep static fallback if sheets are unavailable.
        console.error("Failed to load clients from Google Sheets", e);
        setError(e);
        setSheetClients(clients);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { clients: sheetClients, loading, error };
}