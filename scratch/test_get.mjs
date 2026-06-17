const candidateIds = [
  "1584308666544-7b48aee2e1a6",
  "1550572017-edd951aa8f72",
  "1628243349426-31a7862de81d",
  "1631390563609-33b1f0b11571",
  "1626245917194-24e54884de63",
  "1563170351-be82bc888bb4",
  "1556229151-5e72efa193d4",
  "1631730359575-38e4755d772b",
  "1619551734325-e1aac24ae769",
  "1610030469983-98e5504d6d3c",
  "1616394584738-fc6e612e71b9",
  "1620917670367-52d3a3a41c10",
  "1621259182978-f000794fad70",
  "1615396879835-533495f510ef",
  "1544367567-0f2fcb009e0b",
  "1552693673-1bf958298935"
];

async function checkIds() {
  const validIds = [];
  console.log("Checking candidate IDs using GET...");
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=10&auto=format&fit=crop&q=10`;
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        console.log(`✓ ID ${id} is VALID (GET)`);
        validIds.push(id);
      } else {
        console.log(`✗ ID ${id} returned status ${res.status}`);
      }
    } catch (e) {
      console.log(`✗ ID ${id} failed: ${e.message}`);
    }
  }
  console.log("\nSummary of valid IDs via GET:", JSON.stringify(validIds));
}

checkIds();
