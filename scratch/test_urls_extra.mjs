const candidateIds = [
  "1506126613408-eca07ce68773",
  "1540555700478-4be289fbecef",
  "1603302576837-37561b2e2302",
  "1598440947619-2c35fc9aa908",
  "1611073103233-dc195984620f",
  "1585435557343-3b092031a831",
  "1587854692152-cbe66cde6c79",
  "1586015555751-63bb77f4322a",
  "1584515901187-a393957c7c8c",
  "1594824813573-246434333997",
  "1601612628753-11dcfc7bc83f",
  "1614850523459-c2f4c699c52e",
  "1601924582970-878404e57ec2",
  "1601924990987-a4c6a0c0a520",
  "1512303500391-74e5b8c3c07f",
  "1551601651-88dcd2e12c8c",
  "1598440947619-2c35fc9aa908",
  "1615485290372-88b8e070d603",
  "1610030469983-98e5504d6d3c"
];

async function checkIds() {
  const validIds = [];
  console.log("Checking extra candidate IDs...");
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
  console.log("\nSummary of valid extra IDs:", JSON.stringify(validIds));
}

checkIds();
