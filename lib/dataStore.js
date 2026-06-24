import fs from "fs/promises";
import path from "path";

const IS_VERCEL = process.env.VERCEL === "1";

// --- Vercel Blob helpers ---
async function blobPut(key, data) {
  const { put, list, del } = await import("@vercel/blob");
  const prefix = key.replace('.json', '');
  
  // Find old blobs to delete
  const { blobs } = await list({ prefix });
  
  const json = JSON.stringify(data, null, 2);
  const uniqueKey = `${prefix}-${Date.now()}.json`;
  
  const blob = await put(uniqueKey, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  // Delete old versions to save space
  if (blobs.length > 0) {
    const urlsToDelete = blobs.map(b => b.url);
    // don't await deletion to speed up response
    del(urlsToDelete).catch(e => console.error("Failed to delete old blobs:", e));
  }
  
  return blob;
}

async function blobGet(key) {
  const { list } = await import("@vercel/blob");
  const prefix = key.replace('.json', '');
  
  const { blobs } = await list({ prefix });
  if (blobs.length === 0) return null;
  
  // Sort by uploadedAt descending to get the newest file
  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  
  const fetchUrl = blobs[0].downloadUrl || blobs[0].url;
  const response = await fetch(fetchUrl, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
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
      if (data !== null && !(Array.isArray(data) && data.length === 0 && filename === "products.json")) return data;
      // First run on Vercel: seed from bundled JSON
      const seeded = await localRead(filename);
      // Save to blob for future reads
      await blobPut(`data/${filename}`, seeded);
      return seeded;
    } else {
      return await localRead(filename);
    }
  } catch (error) {
    console.error(`Error reading ${filename} from blob, falling back to local bundle:`, error);
    try {
      return await localRead(filename);
    } catch (localError) {
      console.error(`Failed to read local bundle for ${filename}:`, localError);
      return fallback;
    }
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
