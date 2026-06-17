const candidateIds = [
  "1540569014015-19a7be504e3a", // Medicine bottle
  "1579721016011-7a4f4ef64a38", // Supplement capsules
  "1569336415084-26c06aefb837" // Healthy lifestyle
];

async function check() {
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=10&auto=format&fit=crop&q=10`;
    const res = await fetch(url);
    console.log(`${id}: ${res.ok ? "VALID" : "INVALID"} (${res.status})`);
  }
}
check();
