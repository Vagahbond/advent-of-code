import fs from "fs";
import { parse } from "path";

const input = fs.readFileSync("./inputs.txt", "utf-8");

let lines = input
  .split("\n")
  .slice(0, -1)
  .map((l) => [l.split(" ")[0], l.split(" ")[1].split(",")]);

// returns null if no workerino
export function popSpringsFromString(string, nbSprings) {
  if (!string || !nbSprings) {
    console.error("CANNOT POP WITH ARGUMENTS : ", string, nbSprings);
    exit(-1);
  }

  let toReplace = "";
  let to_skip = 0;
  while (toReplace.length < nbSprings) {
    const c = toReplace.length + to_skip;

    if (string[c] != "." && string[c + nbSprings] != "#") {
      toReplace += string[c];
    } else {
      ++to_skip;
    }
  }

  let res = string;
  res = res.substring(res.indexOf(toReplace) + toReplace.length);

  return res;
}

export function visitPossibilities(line) {
  console.log(line);
  // all of the springs have been consumed
  if (line[1].length == 0) {
    console.log("win!");
    return 1;
  }

  // more springs to fit than there is space
  if (
    line[1].reduce((prev, cur) => Number(prev) + Number(cur), 0) +
      line[1].length -
      1 >
    line[0].length
  ) {
    console.log("Giving up on", line);
    return 0;
  }

  console.log("shift call");
  const shiftedResult = visitPossibilities([
    line[0].substring(1, line[0].length),
    [...line[1]],
  ]);

  let new_string = popSpringsFromString(line[0], line[1][0]);

  if (new_string == "") {
    return 1;
  }

  if (new_string == null || new_string[0] == "#") {
    console.log("Could not replace on", line);
    return shiftedResult;
  }

  console.log("new_String : ", new_string);

  new_string = new_string.substring(1, new_string.length);

  let new_chains = [...line[1]];

  new_chains.shift();
  console.log("second call with ", new_string, new_chains);
  return shiftedResult + visitPossibilities([new_string, new_chains]);
}

//console.log(visitPossibilities(lines[1]));
// console.log(popSpringsFromString("????.######..#####", 1));
// console.log(popSpringsFromString("######..#####", 6));
// console.log(popSpringsFromString("#####", 5));

console.log(popSpringsFromString("??.######..#####", 1));
console.log(popSpringsFromString("?.######..#####", 6));
console.log(popSpringsFromString("??.#####", 5));
// lines.map((l) => console.log(visitPossibilities(l)));
// console.log(lines.map(visitPossibilities).reduce((acc, val) => acc + val, 0));
