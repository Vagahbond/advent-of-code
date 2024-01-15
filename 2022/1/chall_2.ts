import fs from "fs";

export function run(input: string): number {
  const elves = parse(fs.readFileSync(input).toString());

  const sortedElves = elves
    .map((e) => readElfCalories(e))
    .sort((a, b) => b - a);

  console.log(sortedElves);

  return sortedElves[0] + sortedElves[1] + sortedElves[2];
}

function parse(input: string): string[] {
  return input.split("\n\n");
}

function readElfCalories(elfLines: string): number {
  const res = elfLines
    .split("\n")
    .reduce((acc, next) => acc + forceNumber(Number.parseInt(next)), 0);

  return res;
}

function forceNumber(nb: number): number {
  return isNaN(nb) ? 0 : nb;
}
