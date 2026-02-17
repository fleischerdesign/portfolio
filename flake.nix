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

          npmDepsHash = "sha256-j5Sk03laMhCog247/reM3p3oNQvv8LqqFnIdqJJia3o=";
          npmFlags = [ "--legacy-peer-deps" ];

          nodejs = nodejs;

          nativeBuildInputs = with pkgs; [
            pkg-config
            python3
            nodePackages.node-gyp
          ];

          buildInputs = with pkgs; [
            vips
            glib
          ];

          NIX_CFLAGS_COMPILE = [
            "-I${pkgs.glib.dev}/include/glib-2.0"
            "-I${pkgs.glib.out}/lib/glib-2.0/include"
          ];

          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "true";
          PUPPETEER_SKIP_DOWNLOAD = "1";
          npm_config_build_from_source = "true";
          NUXT_TELEMETRY_DISABLED = "1";

          # Nuxt build
          buildPhase = ''
            npm run build
          '';

          # Install the build output
          installPhase = ''
            mkdir -p $out/lib/portfolio
            cp -r .output/* $out/lib/portfolio/

            # Include migration files for Drizzle
            mkdir -p $out/lib/portfolio/server/db/migrations
            if [ -d "server/db/migrations" ]; then
              cp -r server/db/migrations/* $out/lib/portfolio/server/db/migrations/
            fi

            # Executable wrapper
            mkdir -p $out/bin
            cat <<EOF > $out/bin/portfolio
#!/bin/sh
export NODE_ENV=production
export PUPPETEER_EXECUTABLE_PATH=\$(cat /etc/portfolio-chromium-path 2>/dev/null || echo "${pkgs.chromium}/bin/chromium")
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
            glib
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