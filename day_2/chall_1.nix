{
  input,
  lib,
}: let
  lines = lib.init (lib.splitString "\n" input);

  parseRoundCube = roundCube: let
    splitted = lib.splitString " " roundCube;
  in {
    ${lib.last splitted} = lib.toInt (builtins.elemAt splitted 1);
  };

  parseRoundCubes = roundCubes:
    lib.fold (a: b: b // a) {
      red = 0;
      green = 0;
      blue = 0;
    } (map parseRoundCube (lib.splitString "," roundCubes));

  isRoundValid = round: (round.red <= 12 && round.green <= 13 && round.blue <= 14);

  isGameValid = game: let
    roundResults = map parseRoundCubes (lib.splitString ";" game);
  in
    lib.fold (a: b: a && b) true (map isRoundValid roundResults);

  evalLine = line: let
    splitted = lib.splitString ":" line;
    valid = isGameValid (lib.last splitted);

    gameId = lib.last (lib.splitString " " (builtins.elemAt splitted 0));
  in
    if valid
    then lib.toInt gameId
    else 0;

  evalLines = lines: lib.fold (a: b: a + b) 0 (map evalLine lines);
in
  evalLines lines
