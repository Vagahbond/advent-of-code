import fs from "fs";

export function run(input: string): number {
  const rounds = getLines(fs.readFileSync(input).toString());

  rounds
    .map((l) => l.split(" "))
    .map((v) => console.log(v, evaluateScore(v[0], v[1])));

  return rounds
    .map((r) => r.split(" "))
    .reduce((acc, next) => acc + evaluateScore(next[0], next[1]), 0);
}

function getLines(input: string): string[] {
  return input.split("\n").filter((l) => l.length > 0);
}

function evaluateScore(a: string, b: string): number {
  const aMoves = ["A", "B", "C"];
  const bMoves = ["X", "Y", "Z"];

  const aIndex = aMoves.indexOf(a);
  const bIndex = bMoves.indexOf(b);

  let res = bIndex + 1;

  if ((aIndex + 1) % 3 === bIndex) {
    return res + 6;
  } else if ((bIndex + 1) % 3 !== aIndex) {
    return res + 3;
  }

  return res;
}
