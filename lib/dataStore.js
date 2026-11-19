import fs from "fs/promises";
import path from "path";

const IS_VERCEL = process.env.VERCEL === "1";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "HEMASAMIR/Online_store";
const BRANCH = "main"; 

async function githubGet(filename) {
  try {
    // 1. Fetch live raw GitHub data directly (public, zero auth required, no API rate limits)
    const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/data/${filename}?t=${Date.now()}`;
    const rawRes = await fetch(rawUrl, {
      cache: "no-store",
      next: { revalidate: 0 }
    });
    if (rawRes.ok) {
      const data = await rawRes.json();
      return data;
    }
  } catch (err) {
    console.warn(`Failed to fetch raw GitHub data for ${filename}:`, err);
  }

  // 2. If raw fails and token exists, try GitHub REST API
  if (GITHUB_TOKEN) {
    try {
      const url = `https://api.github.com/repos/${REPO}/contents/data/${filename}?ref=${BRANCH}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json",
          "Cache-Control": "no-cache"
        },
        cache: "no-store",
        next: { revalidate: 0 }
      });

      if (response.ok) {
        const data = await response.json();
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return JSON.parse(content);
      }
    } catch (e) {
      console.error(`GitHub API error getting ${filename}:`, e);
    }
  }

  return null;
}

async function githubPut(filename, jsonData) {
  if (!GITHUB_TOKEN) {
    throw new Error("Missing GITHUB_TOKEN environment variable.");
  }
  const url = `https://api.github.com/repos/${REPO}/contents/data/${filename}`;
  
  let sha = undefined;
  const getRes = await fetch(`${url}?ref=${BRANCH}`, {
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json"
    },
    cache: "no-store"
  });
  
  if (getRes.ok) {
    const getData = await getRes.json();
    sha = getData.sha;
  }
  
  const contentStr = JSON.stringify(jsonData, null, 2);
  const contentBase64 = Buffer.from(contentStr).toString("base64");
  
  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: `Update ${filename} via Admin Panel`,
      content: contentBase64,
      sha: sha,
      branch: BRANCH
    })
  });
  
  if (!putRes.ok) {
    console.error(`GitHub API error putting ${filename}:`, await putRes.text());
    throw new Error("Failed to save to GitHub");
  }
  
  return true;
}

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

export async function readData(filename, fallback = []) {
  try {
    if (IS_VERCEL) {
      const liveData = await githubGet(filename);
      if (liveData) return liveData;
      return await localRead(filename);
    } else {
      return await localRead(filename);
    }
  } catch (error) {
    console.error(`Error reading ${filename}, falling back:`, error);
    try {
      return await localRead(filename);
    } catch (localError) {
      return fallback;
    }
  }
}

export async function writeData(filename, data) {
  try {
    if (IS_VERCEL) {
      await githubPut(filename, data);
    } else {
      await localWrite(filename, data);
    }
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}
