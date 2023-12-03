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

  mergeRounds = rounds:
    builtins.zipAttrsWith (_name: values: (lib.fold (a: b:
      if a < b
      then b
      else a) (lib.last values)
    values))
    rounds;

  computeGamePower = game: let
    roundResults = map parseRoundCubes (lib.splitString ";" game);
  in
    lib.fold (a: b: a * b) 1 (lib.attrValues (mergeRounds roundResults));

  evalLine = line: let
    splitted = lib.splitString ":" line;
  in
    computeGamePower (lib.last splitted);

  evalLines = lines: lib.fold (a: b: a + b) 0 (map evalLine lines);
in
  evalLines lines
