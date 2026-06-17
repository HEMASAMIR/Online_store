import { readFileSync } from "fs";

function search(file) {
  try {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (line.includes("لوحة") || line.includes("مسؤول") || line.includes("المسؤول") || line.includes("admin")) {
        console.log(`${file}:${index + 1}: ${line.trim()}`);
      }
    });
  } catch (err) {
    console.error("Error reading " + file + ":", err.message);
  }
}

search("app/page.js");
search("app/layout.js");
