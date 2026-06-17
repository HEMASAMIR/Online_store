const candidateIds = [
  "1571781560029-e5c7f7be0d83", // Herbal skincare
  "1515377905703-c4788e51af15", // Hair turban
  "1607619056574-7b8f304b3b8a",
  "1625013488552-6d9b3a32f6b4",
  "1631549916768-4119c2e55c26",
  "1612817288484-6f916006741a",
  "1522337360788-8b13dee7a37e",
  "1526947425960-945c6e72858f",
  "1535585209827-a15fcdbc4c2d"
];

async function check() {
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=10&auto=format&fit=crop&q=10`;
    const res = await fetch(url);
    console.log(`${id}: ${res.ok ? "VALID" : "INVALID"} (${res.status})`);
  }
}
check();
