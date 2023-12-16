import fs from "fs";

enum Dir {
  Left = "<",
  Up = "^",
  Right = ">",
  Down = "v",
}

interface Ray {
  coords: { x: number; y: number };
  direction: Dir;
}

const mirrors = ["/", "\\"];

const splitters = ["-", "|"];

function moveRay(ray: Ray) {
  let r = JSON.parse(JSON.stringify(ray));

  switch (r.direction) {
    case Dir.Left:
      --r.coords.x;
      return r;
    case Dir.Right:
      r.coords.x += 1;
      return r;
    case Dir.Down:
      ++r.coords.y;
      return r;
    case Dir.Up:
      --r.coords.y;
      return r;
  }
}

function splitRay(r: Ray, splitter: string): Ray[] {
  if (
    (r.direction == Dir.Right || r.direction == Dir.Left) &&
    splitter == "|"
  ) {
    return [
      { coords: { x: r.coords.x, y: r.coords.y }, direction: Dir.Down },
      { coords: { x: r.coords.x, y: r.coords.y }, direction: Dir.Up },
    ];
  } else if (
    (r.direction == Dir.Up || r.direction == Dir.Down) &&
    splitter == "-"
  ) {
    return [
      { coords: { x: r.coords.x, y: r.coords.y }, direction: Dir.Right },
      { coords: { x: r.coords.x, y: r.coords.y }, direction: Dir.Left },
    ];
  }

  return [r];
}

function reflect(direction: Dir, mirror: string) {
  switch (mirror) {
    case "/":
      switch (direction) {
        case Dir.Left:
          return Dir.Down;
        case Dir.Right:
          return Dir.Up;
        case Dir.Down:
          return Dir.Left;
        case Dir.Up:
          return Dir.Right;
      }

    case "\\":
      switch (direction) {
        case Dir.Left:
          return Dir.Up;
        case Dir.Right:
          return Dir.Down;
        case Dir.Down:
          return Dir.Right;
        case Dir.Up:
          return Dir.Left;
      }

    default:
      console.error("Wrong mirror provided :", mirror);
      return direction;
  }
}

function isOutOfMap(ray: Ray, grid: string[][]): boolean {
  return (
    ray.coords.x < 0 ||
    ray.coords.y < 0 ||
    ray.coords.x >= grid[0].length ||
    ray.coords.y >= grid.length
  );
}

function compareRays(a: Ray, b: Ray) {
  return (
    a.coords.x === b.coords.x &&
    a.coords.y === b.coords.y &&
    a.direction === b.direction
  );
}

function cycleRays(
  rays: Ray[],
  grid: string[][],
  new_grid: string[][],
  passed: Ray[],
): Ray[] {
  return rays
    .map((ray): Ray | Ray[] => {
      new_grid[ray.coords.y][ray.coords.x] = "#";

      if (mirrors.includes(grid[ray.coords.y][ray.coords.x])) {
        if (passed.some((p) => compareRays(p, ray))) {
          return [];
        }

        passed.push(JSON.parse(JSON.stringify(ray)));

        ray.direction = reflect(
          ray.direction,
          grid[ray.coords.y][ray.coords.x],
        );
      }

      let r = moveRay(ray);

      if (isOutOfMap(r, grid)) {
        return [];
      }

      const current_cell = grid[r.coords.y][r.coords.x];
      if (passed.some((p) => compareRays(p, r))) {
        return [];
      }
      if (splitters.includes(current_cell)) {
        passed.push(r);

        // new_grid[r.coords.y][r.coords.x] = "#";

        return splitRay(r, current_cell).filter(
          (r: Ray) => !isOutOfMap(r, grid),
        );
      }

      return r;
    })
    .flat();
}

function runWholeMap(grid: string[][], startingRay: Ray): number {
  let rays: Ray[] = [startingRay];
  let passed: Ray[] = [];
  let new_map = [...grid.map((l) => [...l])];

  while (rays.length > 0) {
    rays = cycleRays(rays, grid, new_map, passed);
    //new_map.forEach((l) => console.log(l.join("")));
    //  console.log("\n");
  }

  return new_map.reduce(
    (prec, cur) =>
      prec + cur.reduce((prev_c, c) => prev_c + (c == "#" ? 1 : 0), 0),
    0,
  );
}

function testBorders(grid: string[][]) {
  let res = 0;

  grid.forEach((_, i) => {
    // Left
    res = Math.max(
      res,
      runWholeMap(grid, { coords: { x: 0, y: i }, direction: Dir.Right }),
    );

    // Right
    res = Math.max(
      res,
      runWholeMap(grid, {
        coords: { x: grid[0].length - 1, y: i },
        direction: Dir.Left,
      }),
    );
  });

  grid[0].forEach((_, i) => {
    // top
    res = Math.max(
      res,
      runWholeMap(grid, { coords: { x: i, y: 0 }, direction: Dir.Down }),
    );

    // bottom
    res = Math.max(
      res,
      runWholeMap(grid, {
        coords: { x: i, y: grid.length - 1 },
        direction: Dir.Up,
      }),
    );
  });

  return res;
}

const lines = fs.readFileSync("inputs_.txt", "utf-8");

const grid: Array<Array<string>> = lines
  .split("\n")
  .map((l: string) => l.split(""));
grid.splice(grid.length - 1, 1);

console.log(testBorders(grid));
