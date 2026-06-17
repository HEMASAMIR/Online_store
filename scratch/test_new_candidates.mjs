const candidateIds = [
  "1505576399279-565b52d4ac71", // Healthy herbs
  "1608889174617-d2e8b2a3b04b", // Skincare
  "1550572242-45e054cfdf1a", // Pills/vitamins
  "1615485290372-88b8e070d603",
  "1611080626919-7cf5a9dbab5b", // Skincare
  "1512290923902-8a9f81dc236c", // Dropper
  "1571781926291-c477ebfd024b", // Herbs
  "1556228720-195a672e8a03", // Skincare
  "1584017911766-d451b3d0e843"
];

async function check() {
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=10&auto=format&fit=crop&q=10`;
    const res = await fetch(url);
    console.log(`${id}: ${res.ok ? "VALID" : "INVALID"} (${res.status})`);
  }
}
check();
