import fs from "fs";
import { parse } from "path";

const input = fs.readFileSync("./inputs_.txt", "utf-8");

// Parse input into:
/*
[ "???.###", [ "1", "1", "3" ] ]
[ ".??..??...?##.", [ "1", "1", "3" ] ]
[ "?#?#?#?#?#?#?#?", [ "1", "3", "1", "6" ] ]
[ "????.#...#...", [ "4", "1", "1" ] ]
[ "????.######..#####.", [ "1", "6", "5" ] ]
[ "?###????????", [ "3", "2", "1" ] ]
*/
let lines = input
  .split("\n")
  .slice(0, -1)
  .map((l) => [l.split(" ")[0].split(""), l.split(" ")[1].split(",")]);

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
    //if (isLineValid(line))
    //  console.log("Final line :", line, "Valid : ", isLineValid(line) ? 1 : 0);
    return isLineValid(line) ? 1 : 0;
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
