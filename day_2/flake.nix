{
  description = "AOC 2023 day 2";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    inherit (nixpkgs) lib;
    input = builtins.readFile ./inputs.txt;
  in {
    solutions = {
      "1" = (import ./chall_1.nix) {
        inherit input;
        inherit lib;
      };
      "2" = (import ./chall_2.nix) {
        inherit input;
        inherit lib;
      };
    };
  };
}
