import { useEffect, useState } from "react";
import { getRebarClientsFromGoogleSheet } from "./sheets/loadClientsFromGoogleSheets";

const RebarClients = {
    // "Vectorshades": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Vectorshades"
    // },
    // "Shaw Steel Services": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Shaw Steel Services"
    // },
    // "RebarsAndMesh": {
    //     addedOn: "04-5-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "RebarsAndMesh"
    // },
    // "DandC supply": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "DandC supply"
    // },
    // "Dimension Fabricators": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Dimension Fabricators"
    // },
    // "Concrete Accessories": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Concrete Accessories"
    // },
    // "Men of Steel": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Men of Steel"
    // },
    // "Kingsley": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Kingsley"
    // },
    // "Stone Steel Construction": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Stone Steel Construction"
    // },
    // "Commerce Engineering": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Commerce Engineering"
    // },
    // "Lincoln Engineering Group": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Lincoln Engineering Group"
    // },
    // "Bama Steel": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Bama Steel"
    // },
    // "Bolsinger Rebar": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Bolsinger Rebar"
    // },
    // "Trinity Construction Supplies": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Trinity Construction Supplies"
    // },
    // "Trio Boro": {
    //     addedOn: "8-4-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Trio Boro"
    // },
    // "Bar Benders": {
    //     addedOn: "21-1-2026",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Bar Benders"
    // },
    // "Saber Steel": {
    //     addedOn: "04-5-2025",
    //     OFAFormula: "poPrice%50",
    //     FABFormula: "poPrice%50",
    //     name: "Saber Steel"
    // }
};

export default RebarClients;

export function useRebarClients() {
  const [sheetClients, setSheetClients] = useState(RebarClients);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getRebarClientsFromGoogleSheet()
      .then((data) => {
        if (cancelled) return;
        setSheetClients(data || {});
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        // Keep static fallback if sheets are unavailable.
        console.error("Failed to load rebar clients from Google Sheets", e);
        setError(e);
        setSheetClients(RebarClients);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { clients: sheetClients, loading, error };
}
