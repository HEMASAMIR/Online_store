const candidateIds = [
  "1551244072-5d12893278ab",
  "1623084901241-10c7f2122606",
  "1635048425308-42f53d4c6c1f",
  "1608571423902-eed4a5ad8108",
  "1615485290372-88b8e070d603",
  "1610030469983-98e5504d6d3c",
  "1620917670367-52d3a3a41c10",
  "1621259182978-f000794fad70",
  "1615396879835-533495f510ef",
  "1544367567-0f2fcb009e0b",
  "1552693673-1bf958298935",
  "1512290923902-8a9f81dc236c",
  "1616394584738-fc6e612e71b9",
  "1556228720-195a672e8a03",
  "1584017911766-d451b3d0e843",
  "1506126613408-eca07ce68773",
  "1540555700478-4be289fbecef",
  "1603302576837-37561b2e2302",
  "1598440947619-2c35fc9aa908",
  "1585435557343-3b092031a831",
  "1586015555751-63bb77f4322a",
  "1614850523459-c2f4c699c52e",
  "1512303500391-74e5b8c3c07f",
  "1571781926291-c477ebfd024b",
  "1571781560029-e5c7f7be0d83",
  "1611080626919-7cf5a9dbab5b",
  "1556228578-0d85b1a4d571",
  "1522335936953-cca3cc6d4e8b",
  "1611080626919-7cf5a9dbab5b",
  "1601049541289-9b1b7bbbfe19",
  "1598440947619-2c35fc9aa908",
  "1624454002302-36b8039e20b1",
  "1614850523459-c2f4c699c52e",
  "1617897903246-719242758050"
];

async function checkIds() {
  const validIds = [];
  console.log("Checking candidate IDs via GET...");
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/photo-${id}?w=10&auto=format&fit=crop&q=10`;
    try {
      const res = await fetch(url, { method: "GET" });
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
  console.log("\nSummary of valid IDs:", JSON.stringify([...new Set(validIds)]));
}

checkIds();
