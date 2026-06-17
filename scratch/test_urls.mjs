// List of potential Unsplash photo IDs for health, supplements, medicine, vitamins, cosmetics, skincare
const candidateIds = [
  // Supplements & Medicine
  "1584308666544-7b48aee2e1a6",
  "1550572017-edd951aa8f72",
  "1628243349426-31a7862de81d",
  "1471864190281-a93a3070b6de",
  "1555252333-9f8e92e65df9",
  "1607619056574-7b8f304b3b8a",
  "1576091160399-112ba8d25d1d",
  "1625013488552-6d9b3a32f6b4",
  "1631549916768-4119c2e55c26",
  "1512290923902-8a9f81dc236c",
  "1626806787461-102c1bfaaea1",
  "1584017911766-d451b3d0e843",
  "1547489432-cf93fa6c71ee",
  "1505751172876-fa1923c5c528",
  "1576091160550-2173dba999ef",
  
  // Skincare & Beauty
  "1620916566398-39f1143ab7be",
  "1631390563609-33b1f0b11571",
  "1608248597279-f99d160bfcbc",
  "1601049541289-9b1b7bbbfe19",
  "1556228578-0d85b1a4d571",
  "1626245917194-24e54884de63",
  "1617897903246-719242758050",
  "1556229010-aa3f7ff66b24",
  "1535585209827-a15fcdbc4c2d",
  "1526947425960-945c6e72858f",
  "1612817288484-6f916006741a",
  
  // Hair & Personal Care
  "1563170351-be82bc888bb4",
  "1522337360788-8b13dee7a37e",
  "1570172619644-dfd03ed5d881",
  "1556229151-5e72efa193d4",
  "1590156546746-c58a892b1a8a",
  "1631730359575-38e4755d772b",
  "1619551734325-e1aac24ae769",
  "1515377905703-c4788e51af15",
  "1585846416120-3a7354ed7d39"
];

async function checkIds() {
  const validIds = [];
  console.log("Checking candidate IDs using global fetch...");
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=500&auto=format&fit=crop&q=80`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        console.log(`✓ ID ${id} is VALID`);
        validIds.push(id);
      } else {
        console.log(`✗ ID ${id} returned status ${res.status}`);
      }
    } catch (e) {
      console.log(`✗ ID ${id} failed: ${e.message}`);
    }
  }
  console.log("\nSummary of valid IDs:", JSON.stringify(validIds));
}

checkIds();
