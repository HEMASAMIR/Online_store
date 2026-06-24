import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { blobs } = await list();
    const blobDetails = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          const text = await res.text();
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {}
          return {
            url: b.url,
            pathname: b.pathname,
            size: b.size,
            uploadedAt: b.uploadedAt,
            contentPreview: text.substring(0, 200),
            isJson: json !== null,
            length: Array.isArray(json) ? json.length : (json ? Object.keys(json).length : null)
          };
        } catch (e) {
          return { url: b.url, pathname: b.pathname, error: e.message };
        }
      })
    );
    return NextResponse.json({ success: true, blobs: blobDetails });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
