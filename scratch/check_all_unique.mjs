const uniqueImageMap = {
  1:  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80",
  2:  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80",
  3:  "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80",
  4:  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80",
  5:  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=80",
  6:  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=80",
  7:  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
  8:  "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=80",
  9:  "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=500&auto=format&fit=crop&q=80",
  10: "https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?w=500&auto=format&fit=crop&q=80",
  11: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=80",
  12: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=500&auto=format&fit=crop&q=80",
  13: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=80",
  14: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80",
  15: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80",
  16: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&auto=format&fit=crop&q=80",
  17: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80",
  18: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&auto=format&fit=crop&q=80",
  19: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&auto=format&fit=crop&q=80",
  20: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&auto=format&fit=crop&q=80",
  21: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=80",
  22: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80",
  23: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80",
  24: "https://images.unsplash.com/photo-1512303500391-74e5b8c3c07f?w=500&auto=format&fit=crop&q=80",
  25: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
  26: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&auto=format&fit=crop&q=80",
  27: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80",
  28: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80",
  29: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80",
  30: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80",
  31: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&auto=format&fit=crop&q=80",
  32: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80",
  33: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80",
  34: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80",
  35: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=500&auto=format&fit=crop&q=80",
  36: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=80",
  37: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=500&auto=format&fit=crop&q=80",
  38: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"
};

const urls = Object.values(uniqueImageMap);
const uniqueSet = new Set(urls);

if (uniqueSet.size !== urls.length) {
  console.error("Duplicate URLs found! Size difference:", urls.length - uniqueSet.size);
  const seen = new Set();
  urls.forEach(url => {
    if (seen.has(url)) console.log("Duplicate:", url);
    seen.add(url);
  });
} else {
  console.log("ALL 38 URLs ARE 100% UNIQUE!");
}
