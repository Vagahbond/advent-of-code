import fs from "fs";

export function run(input: string): string {
  const elves = parse(fs.readFileSync(input).toString());

  return Math.max(...elves.map((e) => readElfCalories(e))).toString();
}

function parse(input: string): string[] {
  return input.split("\n\n");
}

function readElfCalories(elfLines: string): number {
  const res = elfLines
    .split("\n")
    .reduce((acc, next) => acc + Number.parseInt(next), 0);

  if (isNaN(res)) {
    return 0;
  }

  return res;
}
