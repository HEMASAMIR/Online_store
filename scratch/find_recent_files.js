import fs from 'fs';
import path from 'path';
import os from 'os';

function findFiles(dir, maxTimeMs, results = []) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          // Avoid scanning system or huge directories recursively if possible
          if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'AppData') continue;
          findFiles(fullPath, maxTimeMs, results);
        } else {
          const age = Date.now() - stat.mtimeMs;
          if (age < maxTimeMs) {
            results.push({ path: fullPath, mtime: stat.mtime, size: stat.size });
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
  return results;
}

const targetDirs = [
  'f:\\web_application',
  'C:\\Users\\Admin\\.gemini\\antigravity',
  path.join(os.tmpdir())
];

console.log("Searching for files modified in the last 10 minutes...");
const tenMinutes = 10 * 60 * 1000;
const allResults = [];
for (const dir of targetDirs) {
  findFiles(dir, tenMinutes, allResults);
}

allResults.sort((a, b) => b.mtime - a.mtime);
console.log(JSON.stringify(allResults.slice(0, 30), null, 2));
