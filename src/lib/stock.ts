export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1h2oaOWT-OfUov1W9MF2DcfGnj771JAo3YbAVzy6JQnw/export?format=csv";

export async function fetchLiveStock(): Promise<Record<string, string[]>> {
  try {
    const response = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 30 }, // Cache valid for 30 seconds
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch Google Sheet CSV");
    }

    const csvContent = await response.text();
    const lines = csvContent.split(/\r?\n/);
    const stockData: { name: string; variant: string }[] = [];

    for (const line of lines) {
      if (line.includes(">>")) {
        // Tab or spaces might be used around >>
        // Actually, the CSV might have quotes or just literal ">>"
        const cleanLine = line.replace(/\"/g, "");
        const parts = cleanLine.split(">>");
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const variant = parts[1].trim();
          if (name && variant) {
            stockData.push({ name, variant });
          }
        }
      }
    }

    // Group by normalized name
    const groupedStock: Record<string, string[]> = {};
    for (const item of stockData) {
      const normalizedName = item.name.toUpperCase();
      if (!groupedStock[normalizedName]) {
        groupedStock[normalizedName] = [];
      }
      groupedStock[normalizedName].push(item.variant);
    }

    return groupedStock;
  } catch (error) {
    console.error("Error fetching live stock:", error);
    return {};
  }
}

export function matchStockVariants(dbName: string, groupedStock: Record<string, string[]>): string[] {
  let matchedName = dbName.toUpperCase();
  let size = "";

  // Strip common size suffixes from DB name to match CSV name
  if (matchedName.endsWith(" XXXL")) { matchedName = matchedName.replace(" XXXL", ""); size = "XXXL"; }
  else if (matchedName.endsWith(" XXL")) { matchedName = matchedName.replace(" XXL", ""); size = "XXL"; }
  else if (matchedName.endsWith(" XL")) { matchedName = matchedName.replace(" XL", ""); size = "XL"; }
  else if (matchedName.endsWith(" L")) { matchedName = matchedName.replace(" L", ""); size = "L"; }
  else if (matchedName.endsWith(" M")) { matchedName = matchedName.replace(" M", ""); size = "M"; }
  else if (matchedName.endsWith(" S")) { matchedName = matchedName.replace(" S", ""); size = "S"; }
  else if (matchedName.includes(" SIZE ")) {
    const parts = matchedName.split(" SIZE ");
    matchedName = parts[0].trim();
    size = parts[1].trim();
  }

  const stockVariants = groupedStock[matchedName];
  if (!stockVariants) return []; // No stock found

  if (size) {
    // Exact or endswith match for size
    return stockVariants.filter(v => v.toUpperCase().endsWith(size) || v.toUpperCase().includes(` ${size}`));
  }

  return stockVariants;
}
