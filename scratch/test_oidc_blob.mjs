import { spawnSync } from "child_process";
import fs from "fs";

const env = {};
const lines = fs.readFileSync(".env.production", "utf8").split("\n");
for (const line of lines) {
  if (line.trim().startsWith("#") || !line.includes("=")) continue;
  const parts = line.split("=");
  const key = parts[0].trim();
  let val = parts.slice(1).join("=").trim();
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.substring(1, val.length - 1);
  }
  env[key] = val;
}

const runEnv = { ...process.env, ...env };

const res = spawnSync("npx", ["vercel", "blob", "list"], { env: runEnv, encoding: "utf8", shell: true });
console.log("Stdout:", res.stdout);
console.log("Stderr:", res.stderr);
