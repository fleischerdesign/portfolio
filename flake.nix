{
  description = "A Node.js project development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          name = "nodejs-dev-shell";
          packages = with pkgs; [
            nodejs_24 
            python314
            chromium
          ];
          shellHook = ''
            echo "Entering Node.js development environment"
            # Beispiel: Setze PATH, wenn du lokale Binärdateien hast (z.B. node_modules/.bin)
            export PATH=$PWD/node_modules/.bin:$PATH
            export BROWSER_BIN="${pkgs.chromium}/bin/chromium"

            if [ ! -d "node_modules" ]; then
              echo "node_modules not found, running npm install..."
              npm install
            fi
          '';
        };
      });
}