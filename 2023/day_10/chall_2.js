import fs from "fs";

const CORNERS = ["F", "L", "J", "7"];

function getCorderDir(corner) {
  switch (corner) {
    case "L":
      return ["up", "right"];
    case "J":
      return ["left", "up"];
    case "7":
      return ["left", "down"];
    case "F":
      return ["right", "down"];
    case "S":
      console.error("SA MERE LA SOURIS EST ENCORE LA");
    default:
      console.error("Got invalid corner !", corner);
  }
}

function hasCommonDirection(corner_a, corner_b) {
  return getCorderDir(corner_a).some((dir) =>
    getCorderDir(corner_b).some((dir_2) => dir == dir_2),
  );
}

function pathRayX(map, start_coords, end_coords) {
  let in_barrier = false;
  let in_polygon = false;
  let last_corner;

  for (let x = start_coords.x; x < end_coords.x; ++x) {
    if (CORNERS.some((b) => b == map[start_coords.y][x])) {
      in_barrier = !in_barrier;

      if (
        !in_barrier &&
        !hasCommonDirection(last_corner, map[start_coords.y][x])
      ) {
        in_polygon = !in_polygon;
      }

      last_corner = map[start_coords.y][x];
    }

    if (map[start_coords.y][x] == "|") {
      in_polygon = !in_polygon;
    }
  }
  return in_polygon;
}

function pathRayY(map, start_coords, end_coords) {
  let in_barrier = false;
  let in_polygon = false;
  let last_corner;

  for (let y = start_coords.y; y < end_coords.y; ++y) {
    if (CORNERS.some((b) => b == map[y][start_coords.x])) {
      in_barrier = !in_barrier;

      if (
        !in_barrier &&
        !hasCommonDirection(last_corner, map[y][start_coords.x])
      ) {
        in_polygon = !in_polygon;
      }
      last_corner = map[y][start_coords.x];
    }

    if (map[y][start_coords.x] == "-") {
      in_polygon = !in_polygon;
    }
  }
  return in_polygon;
}

function isInPath(map, coords) {
  if (!coords || coords.x == undefined || coords.y == undefined) {
    console.error("Invalid coords");
  }

  const left = pathRayX(
    map,
    { x: 0, y: coords.y },
    { x: coords.x, y: coords.y },
  );

  const right = pathRayX(
    map,
    { x: coords.x, y: coords.y },
    { x: map[0].length, y: coords.y },
  );

  const up = pathRayY(map, { x: coords.x, y: 0 }, { x: coords.x, y: coords.y });

  const down = pathRayY(
    map,
    { x: coords.x, y: coords.y },
    { x: coords.x, y: map.length },
  );

  return (left && right) || (up && down);
}

function findMouse(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; ++x) {
      if (map[y][x] == "S") {
        return { x, y };
      }
    }
  }
}

/*
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
*/
function getPossibilities(map, coord) {
  switch (map[coord.y][coord.x]) {
    case "|":
      return [
        { x: coord.x, y: coord.y - 1 },
        { x: coord.x, y: coord.y + 1 },
      ];

    case "-":
      return [
        { x: coord.x - 1, y: coord.y },
        { x: coord.x + 1, y: coord.y },
      ];
    case "L":
      return [
        { x: coord.x + 1, y: coord.y },
        { x: coord.x, y: coord.y - 1 },
      ];

    case "J":
      return [
        { x: coord.x - 1, y: coord.y },
        { x: coord.x, y: coord.y - 1 },
      ];

    case "7":
      return [
        { x: coord.x - 1, y: coord.y },
        { x: coord.x, y: coord.y + 1 },
      ];

    case "F":
      return [
        { x: coord.x + 1, y: coord.y },
        { x: coord.x, y: coord.y + 1 },
      ];
    case "S":

    default:
      console.error(
        `Landed somewhere we should not land ${map[coord.y][coord.x]} !`,
      );
      break;
  }
}

function inferPossibilitiesFromSurroundings(map, coords) {
  let bottom = false,
    top = false,
    right = false,
    left = false;

  if (
    coords.y > 0 &&
    ["F", "7", "|"].some((c) => c == map[coords.y - 1][coords.x])
  )
    top = true;
  // return { y: coords.y - 1, x: coords.x };

  if (
    coords.y < map.length - 1 &&
    ["J", "L", "|"].some((c) => c == map[coords.y + 1][coords.x])
  )
    bottom = true;
  //return { y: coords.y + 1, x: coords.x };

  if (
    coords.x < map[0].length - 1 &&
    ["J", "7", "-"].some((c) => c == map[coords.y][coords.x + 1])
  )
    right = true;
  //return { y: coords.y, x: coords.x + 1 };

  if (
    coords.x > 0 &&
    ["F", "L", "-"].some((c) => c == map[coords.y][coords.x - 1])
  )
    left = true;
  //return { y: coords.y, x: coords.x - 1 };

  if (bottom && right) {
    map[coords.y][coords.x] = "F";
    return { y: coords.y + 1, x: coords.x };
  } else if (bottom && left) {
    map[coords.y][coords.x] = "7";
    return { y: coords.y + 1, x: coords.x };
  } else if (top && right) {
    map[coords.y][coords.x] = "L";
    return { y: coords.y - 1, x: coords.x };
  } else if (top && left) {
    map[coords.y][coords.x] = "J";
    return { y: coords.y - 1, x: coords.x };
  } else if (right && left) {
    map[coords.y][coords.x] = "-";
    return { y: coords.y, x: coords.x + 1 };
  } else if (top && bottom) {
    map[coords.y][coords.x] = "|";
    return { y: coords.y - 1, x: coords.x };
  }
}

function compareCoords(coord1, coord2) {
  return coord1.x == coord2.x && coord1.y == coord2.y;
}

function visitPipesLoop(map, start_point, previous_pos) {
  if (!previous_pos) {
    console.log("before replacing : ", map[start_point.y][start_point.x]);
    const dir = inferPossibilitiesFromSurroundings(map, start_point);
    console.log("after replacing : ", map[start_point.y][start_point.x]);
    return dir;
  }

  const new_pos = getPossibilities(map, start_point).filter(
    (coords) => !compareCoords(coords, previous_pos),
  )[0];

  if (!new_pos) {
    console.error("COULD NOT DETERMINE A NEW POSITION");
  }

  return new_pos;
}

function printMapWithMe(map, coords) {
  console.log("\n\n\n\n\n");
  const my_map = JSON.parse(JSON.stringify(map));

  my_map[coords.y][coords.x] = "@";

  my_map.forEach((line) => {
    console.log(line.join(" "));
  });
}

let map = [];

const file = fs.readFileSync("input_valentin.txt", "utf-8");

const fileArray = file.split("\n");

fileArray.forEach((line) => {
  if (line.length == 0) {
    return;
  }

  const lineArray = line.split("");
  map.push(lineArray);
});

let cleaned_map = [];

for (let y = 0; y < map.length; y++) {
  cleaned_map.push([]);
  for (let x = 0; x < map[0].length; x++) {
    cleaned_map[y].push(".");
  }
}

let starting_position = findMouse(map);

let mouse_position = starting_position;
let previous_pos;

previous_pos = mouse_position;
mouse_position = visitPipesLoop(map, mouse_position);

cleaned_map[starting_position.y][starting_position.x] =
  map[starting_position.y][starting_position.x];

while (!compareCoords(mouse_position, starting_position)) {
  cleaned_map[mouse_position.y][mouse_position.x] =
    map[mouse_position.y][mouse_position.x];

  const new_pos = visitPipesLoop(map, mouse_position, previous_pos);

  previous_pos = mouse_position;
  mouse_position = new_pos;
}

let counter = 0;
for (let x = 0; x < map[0].length; x++) {
  for (let y = 0; y < map.length; y++) {
    if (cleaned_map[y][x] == ".") {
      const isin = isInPath(cleaned_map, { x, y });

      if (isin) {
        counter += 1;
        cleaned_map[y][x] = "1";
      } else cleaned_map[y][x] = "0";
    }
  }
}

cleaned_map.forEach((l) => console.log(l.join("")));

console.log(counter);
