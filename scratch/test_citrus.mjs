const candidateIds = [
  "1547514701-42782101795e", // Citrus orange slice
  "1607619056574-7b8f304b3b8a", // Medicine pills
  "1584308666544-7b48aee2e1a6", // Amber bottle
  "1585846416120-3a7354ed7d39", // Medicine/Doctor
  "1615396879835-533495f510ef", // pills box
  "1631549916768-4119c2e55c26", // medicine box
  "1611073103233-dc195984620f", // pill dispenser
  "1512290923902-8a9f81dc236c"
];

async function check() {
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=10&auto=format&fit=crop&q=10`;
    const res = await fetch(url);
    console.log(`${id}: ${res.ok ? "VALID" : "INVALID"} (${res.status})`);
  }
}
check();
