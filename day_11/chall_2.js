import fs from "fs";

function indexExpansions(map) {
  let res = { rows: [], cols: [] };
  let index = 0;
  while (index < map.length) {
    if (!map[index].some((c) => c == "#")) {
      res.rows.push(index);
    }
    index++;
  }

  index = 0;
  while (index < map[0].length) {
    if (!map.map((l) => l[index]).some((c) => c == "#")) {
      res.cols.push(index);
    }
    index++;
  }
  return res;
}

function indexPoints(map) {
  return map
    .map((l, y) =>
      l.map((c, x) => {
        return c == "#"
          ? {
              x,
              y,
            }
          : undefined;
      }),
    )
    .flat()
    .filter((c) => c);
}

function calculateDistance(expansions, a, b) {
  let exp_x = expansions.cols.filter(
    (v) => v < Math.max(a.x, b.x) && v > Math.min(a.x, b.x),
  ).length;

  let exp_y = expansions.rows.filter(
    (v) => v < Math.max(a.y, b.y) && v > Math.min(a.y, b.y),
  ).length;

  let len_x = Math.abs(a.x - b.x) - exp_x + exp_x * 1000000;
  let len_y = Math.abs(a.y - b.y) - exp_y + exp_y * 1000000;

  return len_x + len_y;
}

function calculateDistances(expansions, galaxies) {
  let res = 0;
  for (let i = 0; i < galaxies.length; ++i) {
    for (let j = i; j < galaxies.length; ++j) {
      res += calculateDistance(expansions, galaxies[i], galaxies[j]);
    }
  }

  return res;
}

const content = fs.readFileSync("./inputs_.txt", "utf-8");

const map = content.split("\n").map((l) => l.split(""));
map.splice(map.length - 1);

console.log(calculateDistances(indexExpansions(map), indexPoints(map)));
