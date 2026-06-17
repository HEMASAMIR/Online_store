import { readFileSync } from "fs";
const products = JSON.parse(readFileSync("./data/products.json", "utf-8"));

const local = products.filter(p => !p.image.startsWith("http"));
console.log("Local images in products.json:");
local.forEach(p => {
  console.log(`ID ${p.id}: ${p.name} -> ${p.image}`);
});
