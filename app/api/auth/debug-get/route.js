import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = "https://dpkwisgibj1m4fv6.public.blob.vercel-storage.com/data/products-1782253313591.json";
    const blob = await get(url, { 
      access: "public",
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN 
    });
    if (!blob) return NextResponse.json({ error: "Blob not found" });
    
    const reader = blob.stream.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    
    return NextResponse.json({ 
      success: true, 
      isBlockedText: text.includes("Your store is blocked"),
      textPreview: text.substring(0, 1000), 
      fullLength: text.length,
      fullContent: text
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
