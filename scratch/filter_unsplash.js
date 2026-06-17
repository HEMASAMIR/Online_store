const fs = require('fs');
const data = JSON.parse(fs.readFileSync('f:/web_application/data/products.json', 'utf8'));
const filtered = data.filter(p => !p.image.includes('unsplash.com'));
fs.writeFileSync('f:/web_application/data/products.json', JSON.stringify(filtered, null, 2), 'utf8');
console.log(`Filtered out ${data.length - filtered.length} products with unsplash images. Remaining: ${filtered.length}`);
