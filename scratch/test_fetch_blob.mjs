import { list, get } from "@vercel/blob";
import fs from "fs";

const token = "vercel_blob_rw_dpKWisGiBJ1m4fV6_rTf1eTjjXrb6rZT1BIP1VfjYyXKbXS";

async function run() {
  try {
    const { blobs } = await list({ token });
    if (blobs.length > 0) {
      const productBlobs = blobs.filter(b => b.pathname.startsWith("data/products"));
      if (productBlobs.length > 0) {
        productBlobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        const latest = productBlobs[0];
        console.log("Using SDK get() for URL:", latest.url);
        
        const blobData = await get(latest.url, { token, access: "public" });
        console.log("Keys of blobData:", Object.keys(blobData));
        console.log("BlobData fields:", {
          url: blobData.url,
          size: blobData.size,
          uploadedAt: blobData.uploadedAt,
          pathname: blobData.pathname,
          contentType: blobData.contentType
        });
        
        // Wait, does it have a content property or text() method?
        // Let's print the entire blobData object to check!
        console.log("Entire blobData object:", blobData);
      }
    }
  } catch (e) {
    console.error("Error running test:", e);
  }
}
run();
