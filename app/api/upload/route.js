import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const IS_VERCEL = process.env.VERCEL === "1";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "HEMASAMIR/Online_store";
const BRANCH = "main";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalExt = file.name ? file.name.split('.').pop() : "jpg";
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${originalExt}`;

    if (IS_VERCEL) {
      if (!GITHUB_TOKEN) {
        throw new Error("Missing GITHUB_TOKEN environment variable.");
      }
      
      const base64Content = buffer.toString("base64");
      const githubPath = `public/uploads/${uniqueFilename}`;
      const url = `https://api.github.com/repos/${REPO}/contents/${githubPath}`;
      
      const putRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          message: `Upload image ${uniqueFilename}`,
          content: base64Content,
          branch: BRANCH
        })
      });

      if (!putRes.ok) {
        console.error("GitHub upload failed:", await putRes.text());
        throw new Error("فشل الرفع إلى GitHub");
      }

      // Return the raw GitHub content URL so it works immediately
      const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${githubPath}`;
      return NextResponse.json({ success: true, url: rawUrl });
      
    } else {
      // === Local dev: save to filesystem ===
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueFilename);
      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "فشل رفع الصورة: " + error.message 
    }, { status: 500 });
  }
}
