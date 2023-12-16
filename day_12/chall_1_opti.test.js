import { visitPossibilities, popSpringsFromString } from "./chall_1_opti.js";

const strLines = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const parsedLines = strLines
  .split("\n")
  .slice(0, -1)
  .map((l) => [l.split(" ")[0], l.split(" ")[1].split(",")]);

describe("Consuming series of broken springs", () => {
  test("Skips dots", () => {
    expect(popSpringsFromString(".??..??...?##.", 1)).toEqual("?..??...?##.");
  });

  test("Eats question marks", () => {
    expect(popSpringsFromString("??", 2)).toEqual("");
  });

  test("Eats hashtags", () => {
    expect(popSpringsFromString("##", 2)).toEqual("");
  });

  test("Returns empty string when it's all consumed", () => {
    expect(popSpringsFromString("?#", 2).toEqual(""));
  });

  test("Skips invalid opportinities", () => {
    expect(popSpringsFromString("?.##", 2).toEqual(""));
  });

  test("Skips if next character is a #", () => {
    expect(popSpringsFromString("?##?.#", 2).toEqual("?.#"));
  });

  test("Leave dots in the end", () => {
    expect(popSpringsFromString("##.", 2).toEqual("."));
  });

  test("Returns null when there's no match", () => {
    expect(popSpringsFromString("?.#.?.#", 2)).toEqual(null);
  });

  test("Eats string start when valid", () => {
    expect(popSpringsFromString(".#?.", 2)).toEqual(".");
  });

  test("Res is a substring of original string", () => {
    const original = "??.###?.";
    const sub = popSpringsFromString(original, 2);
    expect(original.indexOf(sub)).not.toBe(-1);
  });

  test("Works on test strings", () => {
    expect(popSpringsFromString("???.###", 1)).toEqual("??.###");
    expect(popSpringsFromString(".??..??...?##.", 1)).toEqual("?..??...?##.");
    expect(popSpringsFromString("?#?#?#?#?#?#?#?", 1)).toEqual("?#?#?#?#?#?#?");
    expect(popSpringsFromString("????.#...#...", 4)).toEqual(".#...#...");
    expect(popSpringsFromString("?###????????", 3)).toEqual("????????");
  });
});
