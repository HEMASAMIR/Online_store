import fs from 'fs';
const data = JSON.parse(fs.readFileSync('f:\\web_application\\data\\products.json', 'utf8'));
const images = data.map(p => ({ id: p.id, name: p.name, image: p.image }));
console.log(images.slice(0, 10));
