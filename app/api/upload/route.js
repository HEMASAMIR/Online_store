import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IS_VERCEL = process.env.VERCEL === "1";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    if (IS_VERCEL) {
      // === Vercel: use Blob storage ===
      const { put } = await import("@vercel/blob");
      
      const originalExt = file.name ? file.name.split('.').pop() : "jpg";
      const uniqueFilename = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${originalExt}`;
      
      const blob = await put(uniqueFilename, file, {
        access: "public",
        addRandomSuffix: false,
      });

      // blob.url is the permanent public URL for the image
      return NextResponse.json({ success: true, url: blob.url });
    } else {
      // === Local dev: save to filesystem ===
      const fs = (await import("fs/promises")).default;
      const path = (await import("path")).default;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const originalExt = path.extname(file.name) || ".jpg";
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${originalExt}`;
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
