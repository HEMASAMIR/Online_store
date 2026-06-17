import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename using timestamp and random string
    const originalExt = path.extname(file.name) || ".jpg";
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${originalExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Save file to disk
    await fs.writeFile(filePath, buffer);

    // Return the relative public path
    const fileUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
