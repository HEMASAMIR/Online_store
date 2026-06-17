const uniqueImageMap = {
  1:  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=50&auto=format&fit=crop&q=10",
  2:  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=50&auto=format&fit=crop&q=10",
  3:  "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=50&auto=format&fit=crop&q=10",
  4:  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=50&auto=format&fit=crop&q=10",
  5:  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=50&auto=format&fit=crop&q=10",
  6:  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=50&auto=format&fit=crop&q=10",
  7:  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=50&auto=format&fit=crop&q=10",
  8:  "https://images.unsplash.com/photo-1547514701-42782101795e?w=50&auto=format&fit=crop&q=10",
  9:  "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=50&auto=format&fit=crop&q=10",
  10: "https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?w=50&auto=format&fit=crop&q=10",
  11: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=50&auto=format&fit=crop&q=10",
  12: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=50&auto=format&fit=crop&q=10",
  13: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=50&auto=format&fit=crop&q=10",
  14: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=50&auto=format&fit=crop&q=10",
  15: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=50&auto=format&fit=crop&q=10",
  16: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=50&auto=format&fit=crop&q=10",
  17: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=50&auto=format&fit=crop&q=10",
  18: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=50&auto=format&fit=crop&q=10",
  19: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=50&auto=format&fit=crop&q=10",
  20: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=50&auto=format&fit=crop&q=10",
  21: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=50&auto=format&fit=crop&q=10",
  22: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=50&auto=format&fit=crop&q=10",
  23: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=50&auto=format&fit=crop&q=10",
  24: "https://images.unsplash.com/photo-1512303500391-74e5b8c3c07f?w=50&auto=format&fit=crop&q=10",
  25: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=50&auto=format&fit=crop&q=10",
  26: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=50&auto=format&fit=crop&q=10",
  27: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=50&auto=format&fit=crop&q=10",
  28: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=50&auto=format&fit=crop&q=10",
  29: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=50&auto=format&fit=crop&q=10",
  30: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=50&auto=format&fit=crop&q=10",
  31: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=50&auto=format&fit=crop&q=10",
  32: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=50&auto=format&fit=crop&q=10",
  33: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=50&auto=format&fit=crop&q=10",
  34: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=50&auto=format&fit=crop&q=10",
  35: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=50&auto=format&fit=crop&q=10",
  36: "https://images.unsplash.com/photo-1617897903246-719242758050?w=50&auto=format&fit=crop&q=10",
  37: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=50&auto=format&fit=crop&q=10",
  38: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=50&auto=format&fit=crop&q=10"
};

async function testAll() {
  let allOk = true;
  for (const [id, url] of Object.entries(uniqueImageMap)) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`ID ${id} failed: ${res.status}`);
        allOk = false;
      }
    } catch (e) {
      console.error(`ID ${id} error:`, e.message);
      allOk = false;
    }
  }
  if (allOk) {
    console.log("ALL 38 UNIQUE URLS ARE VALID AND ONLINE!");
  } else {
    console.error("Some URLs failed!");
  }
}
testAll();
