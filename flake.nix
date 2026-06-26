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

          npmDepsHash = "sha256-1TCrvfQpvC2KilJ8HDGeOdgY7iCNAI5VoVZz8xiZCx0=";
          npmFlags = [ "--legacy-peer-deps" ];

          nodejs = nodejs;

          nativeBuildInputs = with pkgs; [
            pkg-config
            python3
            node-gyp
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

          NUXT_TELEMETRY_DISABLED = "1";
          NODE_OPTIONS = "--max-old-space-size=4096";

          buildPhase = ''
            npm run build
          '';

          NODE_PATH = "${nodejs}/lib/node_modules/npm/node_modules";

          installPhase = ''
                        mkdir -p $out/lib/portfolio
                        cp -r .output/* $out/lib/portfolio/

                        mkdir -p $out/lib/portfolio/server/db/migrations
                        if [ -d "server/db/migrations" ]; then
                          cp -r server/db/migrations/* $out/lib/portfolio/server/db/migrations/
                        fi

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

        # Docker image using buildLayeredImage - builds from nix packages
        packages.dockerImage = pkgs.dockerTools.buildLayeredImage {
          name = "portfolio";
          tag = "latest";

          contents = [
            nodejs
            self.packages.${system}.default
            pkgs.dumb-init
            pkgs.curl
          ];

          config = {
            Expose = {
              "3000/tcp" = { };
            };
            Env = [
              "NODE_ENV=production"
              "PORT=3000"
              "HOST=0.0.0.0"
            ];
            Cmd = [
              "/bin/dumb-init"
              "--"
              "${nodejs}/bin/node"
              "/lib/portfolio/server/index.mjs"
            ];
            Healthcheck = {
              Test = [
                "CMD"
                "curl"
                "-fs"
                "http://localhost:3000/api/health"
              ];
              Interval = 30;
              Timeout = 3;
              StartPeriod = 10;
            };
            User = "0";
          };
        };

        # Development shell
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
            export NODE_PATH="${nodejs}/lib/node_modules/npm/node_modules"

            if [ -z "$CI" ] && [ ! -d "node_modules" ]; then
              echo "node_modules not found, running npm install..."
              npm install
            fi
          '';
        };
      }
    );
}
