import fs from "fs/promises";
import path from "path";

const IS_VERCEL = process.env.VERCEL === "1";

// --- Vercel Blob helpers ---
async function blobPut(key, data) {
  const { put } = await import("@vercel/blob");
  const json = JSON.stringify(data, null, 2);
  const blob = await put(key, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return blob;
}

async function blobGet(key) {
  const { list } = await import("@vercel/blob");
  // List blobs with the exact prefix
  const { blobs } = await list({ prefix: key, limit: 1 });
  if (blobs.length === 0) return null;
  const response = await fetch(blobs[0].url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

// --- Local file helpers ---
function getLocalPath(filename) {
  return path.join(process.cwd(), "data", filename);
}

async function localRead(filename) {
  const filePath = getLocalPath(filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function localWrite(filename, data) {
  const filePath = getLocalPath(filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// --- Public API ---

/**
 * Read a JSON data file. Uses Vercel Blob in production, local file in dev.
 * @param {string} filename - e.g. "products.json"
 * @param {*} fallback - default value if file not found
 */
export async function readData(filename, fallback = []) {
  try {
    if (IS_VERCEL) {
      const data = await blobGet(`data/${filename}`);
      if (data !== null) return data;
      // First run on Vercel: seed from bundled JSON
      const seeded = await localRead(filename);
      // Save to blob for future reads
      await blobPut(`data/${filename}`, seeded);
      return seeded;
    } else {
      return await localRead(filename);
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return fallback;
  }
}

/**
 * Write a JSON data file. Uses Vercel Blob in production, local file in dev.
 * @param {string} filename - e.g. "products.json"
 * @param {*} data - the data to write
 */
export async function writeData(filename, data) {
  try {
    if (IS_VERCEL) {
      await blobPut(`data/${filename}`, data);
    } else {
      await localWrite(filename, data);
    }
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}
