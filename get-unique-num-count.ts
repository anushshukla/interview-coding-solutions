function getUniqueCount(numArr: number[]): number {
  const hashmap = {};
  let unqiueNumCount = 0;

  for (const num of numArr) {
    if (hashmap[num]) {
      continue;
    }

    hashmap[num] = true;
    unqiueNumCount++;
  }

  return unqiueNumCount;
}
