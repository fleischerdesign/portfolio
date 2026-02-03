{
  description = "Nuxt Portfolio Website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_24;
      in
      {
        # The built Portfolio package
        packages.default = pkgs.buildNpmPackage {
          pname = "portfolio";
          version = "1.0.0";

          src = ./.;

          # This hash needs to be updated after the first build attempt
          npmDepsHash = "sha256-p44xxEsA3r4g5zAGdK2tDjTBevOrv3tzQbHlBYQWyWg=";

          nodejs = nodejs;

          nativeBuildInputs = with pkgs; [
            pkg-config
            python3
          ];

          buildInputs = with pkgs; [
            vips # Required for sharp
          ];

          # Ensure puppeteer doesn't try to download chromium during build
          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "true";
          PUPPETEER_SKIP_DOWNLOAD = "1";

          # Nuxt telemetry fix for non-TTY environments
          NUXT_TELEMETRY_DISABLED = "1";

          # Nuxt build
          buildPhase = ''
            npm run build
          '';

          # Install the build output
          installPhase = ''
            mkdir -p $out/lib/portfolio
            cp -r .output/* $out/lib/portfolio/

            # Executable wrapper
            mkdir -p $out/bin
            cat <<EOF > $out/bin/portfolio
#!/bin/sh
export NODE_ENV=production
# Puppeteer runtime fix will be set via Systemd Environment
exec ${nodejs}/bin/node $out/lib/portfolio/server/index.mjs
EOF
            chmod +x $out/bin/portfolio
          '';
        };

        # Your dev environment
        devShells.default = pkgs.mkShell {
          name = "portfolio-dev-shell";
          packages = with pkgs; [
            nodejs
            python3
            chromium
            pkg-config
            vips
          ];
          shellHook = ''
            echo "Entering Portfolio development environment (Node 24)"
            export PATH=$PWD/node_modules/.bin:$PATH
            export BROWSER_BIN="${pkgs.chromium}/bin/chromium"
            export PUPPETEER_EXECUTABLE_PATH="${pkgs.chromium}/bin/chromium"

            if [ ! -d "node_modules" ]; then
              echo "node_modules not found, running npm install..."
              npm install
            fi
          '';
        };
      }
    );
}
