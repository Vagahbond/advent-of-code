import fs from "fs";

export function run(input: string): number {
  const rounds = getLines(fs.readFileSync(input).toString());

  return rounds
    .map((r) => r.split(" "))
    .reduce((acc, next) => acc + evaluateScore(next[0], next[1]), 0);
}

function getLines(input: string): string[] {
  return input.split("\n").filter((l) => l.length > 0);
}

function evaluateScore(a: string, b: string): number {
  const aMoves = ["A", "B", "C"];

  switch (b) {
    case "X":
      return 1 + ((aMoves.indexOf(a) + 2) % 3);
    case "Y":
      return 4 + aMoves.indexOf(a);
    case "Z":
      return 7 + ((aMoves.indexOf(a) + 1) % 3);
    default:
      return 0;
  }
}
