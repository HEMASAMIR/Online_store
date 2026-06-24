import fs from 'fs';

const oidcToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS8wMTA1NTY3MzE4NGhzLTY3MjlzLXByb2plY3RzIiwic3ViIjoib3duZXI6MDEwNTU2NzMxODRocy02NzI5cy1wcm9qZWN0czpwcm9qZWN0OndlYl9hcHBsaWNhdGlvbjplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsInNjb3BlIjoib3duZXI6MDEwNTU2NzMxODRocy02NzI5cy1wcm9qZWN0czpwcm9qZWN0OndlYl9hcHBsaWNhdGlvbjplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsImF1ZCI6Imh0dHBzOi8vdmVyY2VsLmNvbS8wMTA1NTY3MzE4NGhzLTY3MjlzLXByb2plY3RzIiwib3duZXIiOiIwMTA1NTY3MzE4NGhzLTY3MjlzLXByb2plY3RzIiwib3duZXJfaWQiOiJ0ZWFtX2tFaG5DTXRUMnFBVFFRcFJRcDlNMDlxWiIsInByb2plY3QiOiJ3ZWJfYXBwbGljYXRpb24iLCJwcm9qZWN0X2lkIjoicHJqX1V5akJtMXhURXJYVFB2WWw3WlBybnllTHQ5eDgiLCJlbnZpcm9ubWVudCI6ImRldmVsb3BtZW50IiwicGxhbiI6ImhvYmJ5IiwidXNlcl9pZCI6Im5vOXdYRGxNMllzYVNhQUhPYVI0T1BpZSIsImNsaWVudF9pZCI6ImNsX0hZeU9QQk50Rk1mSGhhVW45TDRRUGZUWno2VFA0N2JwIiwibmJmIjoxNzgyMzA4OTg3LCJpYXQiOjE3ODIzMDg5ODcsImV4cCI6MTc4MjM1MjE4N30.VhBVlCGdRfMgH4Aku-orbV5LWOp0T1dLCN6ZaU0p4qnsO4r3B6FHdH4FwV-bPi588ocCJYcc7eROjzMX9JOYQ02j5lBKno-OvkvAnOtYoICW4RzkQLFDKBP5VnW__P2wcBbwXMvW_rbLuWIkCPPi_4XUoncrZOHE8Vf8PeiVRnsMla-qCk2dc0e4CiPsiW6TsIeaPoTGgpO8KvkagZdYtQS3f1i-eGV8P1Jh5CvOSUlEtjRYhnuwkpP6u4CRbguVnFxrdLx1xSwJs0NDoEGSsfteD9BClNdxdHUU1fuZa8H0ydZkcVtOfq8EmDly0jt5i9P1OnP2KnHg_A8sBqgG2A";
const blobToken = "vercel_blob_rw_dpKWisGiBJ1m4fV6_rTf1eTjjXrb6rZT1BIP1VfjYyXKbXS";

const url = "https://vercel.com/api/v1/stores/store_dpKWisGiBJ1m4fV6/blobs/data/products-1782253313591.json";

async function fetchWith(token, name) {
  console.log(`Trying ${name}...`);
  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response:`, text.slice(0, 300));
    if (res.ok && !text.includes("Your store is blocked")) {
      fs.writeFileSync(`scratch/success_${name}.json`, text);
      console.log(`SUCCESS! Saved to scratch/success_${name}.json`);
    }
  } catch (e) {
    console.error(`Error with ${name}:`, e.message);
  }
}

async function run() {
  await fetchWith(oidcToken, "OIDC_Token");
  await fetchWith(blobToken, "Blob_Token");
}

run();
