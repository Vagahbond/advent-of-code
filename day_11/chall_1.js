import fs from "fs";

function print_map(map) {
  console.log(map.map((l) => l.join(" ")).join("\n"), "\n\n");
}

function clone_row(map, index) {
  map.splice(index, 0, [...map[index]]);
}

function clone_column(map, index) {
  map.forEach((l) => {
    l.splice(index, 0, l[index]);
  });
}

function expand(map) {
  let index = 0;
  while (index < map.length) {
    if (!map[index].some((c) => c == "#")) {
      clone_row(map, index);
      index++;
    }
    index++;
  }

  index = 0;
  while (index < map[0].length) {
    if (!map.map((l) => l[index]).some((c) => c == "#")) {
      clone_column(map, index);
      index++;
    }
    index++;
  }
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

function calculateDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function calculateDistances(galaxies) {
  let res = 0;
  for (let i = 0; i < galaxies.length; ++i) {
    for (let j = i; j < galaxies.length; ++j) {
      res += calculateDistance(galaxies[i], galaxies[j]);
    }
  }

  return res;
}

const content = fs.readFileSync("./inputs_.txt", "utf-8");

const map = content.split("\n").map((l) => l.split(""));
map.splice(map.length - 1);

expand(map);

console.log(calculateDistances(indexPoints(map)));
