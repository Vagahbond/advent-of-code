import fs from "fs";

const input = fs.readFileSync("./inputs_.txt", "utf-8");

let lines = input
  .split("\n")
  .slice(0, -1)
  .map((l) => [l.split(" ")[0].split(""), l.split(" ")[1].split(",")]);

lines = lines.map(unfold);

function unfold(line) {
  line[0] = [1, 2, 3, 4, 5]
    .map((_) => line[0].join(""))
    .join("?")
    .split("");

  line[1] = [1, 2, 3, 4, 5].map((_) => line[1]).flat();
  return line;
}

function isLineValidSoFar(line) {
  let counter = 0;
  let cache = 0;
  let broken_counter = 0;

  while (counter < line[0].findIndex((c) => c == "?")) {
    if (line[0][counter] == ".") {
      if (cache != 0) {
        if (line[1][broken_counter] != cache) {
          return false;
        }
        broken_counter++;
      }
      cache = 0;
    } else if (line[0][counter] == "#") {
      cache++;
    }

    counter++;
  }
  return true;
}

function isLineValid(line) {
  const a = line[0]
    .reduce(
      (accumulator, currentValue) => {
        if (currentValue == "." && accumulator[accumulator.length - 1] != 0) {
          accumulator.push(0);
        } else if (currentValue == "#") {
          accumulator[accumulator.length - 1]++;
        }
        return [...accumulator];
      },
      [0],
    )
    .filter((e) => e);

  return (
    line[1].reduce((acc, cur, index) => {
      return acc && cur == a[index];
    }, true) && line[1].length == a.length
  );
}

function visitPossibilities(line) {
  if (!line[0].includes("?")) {
    return isLineValid(line) ? 1 : 0;
  }

  if (!isLineValidSoFar(line)) {
    return 0;
  }

  return (
    visitPossibilities([
      line[0].join("").replace("?", ".").split(""),
      line[1],
    ]) +
    visitPossibilities([line[0].join("").replace("?", "#").split(""), line[1]])
  );
}

console.log(lines.map(visitPossibilities).reduce((acc, val) => acc + val, 0));
