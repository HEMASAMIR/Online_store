const fs = require('fs');
const data = JSON.parse(fs.readFileSync('f:/web_application/data/products.json', 'utf8'));
const keepIds = [1, 2, 21, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
const filtered = data.filter(p => keepIds.includes(p.id));
fs.writeFileSync('f:/web_application/data/products.json', JSON.stringify(filtered, null, 2), 'utf8');
console.log(`Kept ${filtered.length} products. Deleted the rest.`);
