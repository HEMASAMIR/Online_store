import { readFileSync } from "fs";

const content = readFileSync("app/page.js", "utf8");
const lines = content.split("\n");
lines.forEach((line, index) => {
  if (line.includes("⚡") || line.includes("Zap") || line.includes("lightning") || line.includes("float") || line.includes("fixed")) {
    console.log(`page.js:${index + 1}: ${line.trim()}`);
  }
});
