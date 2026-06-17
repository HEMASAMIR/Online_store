import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function searchDir(dir) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith(".css")) {
      const content = readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (line.includes("admin") || line.includes("Admin")) {
          console.log(`${fullPath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  });
}

searchDir("app");
