import fs from "fs";

let map = [];

const file = fs.readFileSync("inputs_.txt", "utf-8");

const fileArray = file.split("\n");

fileArray.forEach((line) => {
  if (line.length == 0) {
    return;
  }

  const lineArray = line.split("");
  map.push(lineArray);
});

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
  if (["F", "7", "|"].some((c) => c == map[coords.y - 1][coords.x]))
    return { y: coords.y - 1, x: coords.x };

  if (["J", "L", "|"].some((c) => c == map[coords.y + 1][coords.x]))
    return { y: coords.y + 1, x: coords.x };

  if (["J", "7", "-"].some((c) => c == map[coords.y][coords.x + 1]))
    return { y: coords.y, x: coords.x + 1 };

  if (["F", "L", "-"].some((c) => c == map[coords.y][coords.x - 1]))
    return { y: coords.y, x: coords.x - 1 };

  console.error(" COULD NOT INFER START DIRECTION");
}

function compareCoords(coord1, coord2) {
  return coord1.x == coord2.x && coord1.y == coord2.y;
}

function visitPipesLoop(map, start_point, previous_pos) {
  if (!previous_pos) {
    console.log("Need to decide where to go");
    const dir = inferPossibilitiesFromSurroundings(map, start_point);
    console.log(dir);
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

let mouse_position = findMouse(map);
let previous_pos;

console.log(mouse_position);

previous_pos = mouse_position;
mouse_position = visitPipesLoop(map, mouse_position);

printMapWithMe(map, mouse_position);

console.log(mouse_position);

let counter = 1;
while (map[mouse_position.y][mouse_position.x] != "S") {
  const new_pos = visitPipesLoop(map, mouse_position, previous_pos);

  previous_pos = mouse_position;
  mouse_position = new_pos;

  //  printMapWithMe(map, mouse_position);
  counter += 1;
}

console.log(counter / 2);
