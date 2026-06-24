import fs from 'fs';

const csvContent = fs.readFileSync('C:/Users/fian/.gemini/antigravity/brain/0686bfcf-6ba8-4bc4-a5c4-5a91804c1f41/.system_generated/steps/243/content.md', 'utf8');

// Parse CSV
const lines = csvContent.split('\n');
const stockData = [];

for (const line of lines) {
  if (line.includes('>>')) {
    const parts = line.split('>>');
    const name = parts[0].trim();
    const variant = parts[1].trim();
    stockData.push({ name, variant });
  }
}

// Group stock by name
const groupedStock = {};
for (const item of stockData) {
  const normalizedName = item.name.toUpperCase();
  if (!groupedStock[normalizedName]) {
    groupedStock[normalizedName] = [];
  }
  groupedStock[normalizedName].push(item.variant);
}

console.log("Stock parsed. Sample:");
console.log(Object.keys(groupedStock).slice(0, 5).map(k => `${k}: ${groupedStock[k].join(', ')}`));

// Now match with a few DB samples
const dbSamples = [
  'ZANIA',
  'CLARASIN MUKENA',
  'HAZRINA DRESS XXL',
  'HAZRINA DRESS XL',
  'HAZRINA DRESS M',
  'ZENALISA'
];

for (const dbName of dbSamples) {
  // Try to match dbName with groupedStock
  // For example, "HAZRINA DRESS XXL" -> name "HAZRINA DRESS", size "XXL"
  let matchedName = dbName.toUpperCase();
  
  // Strip common size suffixes from DB name to match CSV name
  let size = '';
  if (matchedName.endsWith(' XXL')) { matchedName = matchedName.replace(' XXL', ''); size = 'XXL'; }
  else if (matchedName.endsWith(' XL')) { matchedName = matchedName.replace(' XL', ''); size = 'XL'; }
  else if (matchedName.endsWith(' L')) { matchedName = matchedName.replace(' L', ''); size = 'L'; }
  else if (matchedName.endsWith(' M')) { matchedName = matchedName.replace(' M', ''); size = 'M'; }
  else if (matchedName.endsWith(' S')) { matchedName = matchedName.replace(' S', ''); size = 'S'; }
  else if (matchedName.includes(' SIZE ')) {
    const parts = matchedName.split(' SIZE ');
    matchedName = parts[0];
    size = parts[1];
  }

  const stockVariants = groupedStock[matchedName];
  if (stockVariants) {
    let matchingVariants = stockVariants;
    if (size) {
       matchingVariants = stockVariants.filter(v => v.toUpperCase().endsWith(size));
    }
    console.log(`[MATCH] DB: ${dbName} -> Found ${matchingVariants.length} variants: ${matchingVariants.join(', ')}`);
  } else {
    console.log(`[MISS] DB: ${dbName} -> Tried: ${matchedName}`);
  }
}
