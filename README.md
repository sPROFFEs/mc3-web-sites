<p align="center"><img src="logo.png" alt="Midnight Club 3: DUB Edition Remix" width="500"></p>

# Midnight Club 3 on GitHub Pages

Play **single-player Midnight Club 3** in desktop Chrome. GitHub Pages serves the launcher. Chrome runs the game locally using your own extracted Xbox disc and the matching browser build. You can use the keyboard or a controller. Progress is kept in your Chrome profile.

## Setup guide

Open **Setup guide** in the launcher for the full walkthrough, including how to copy your own disc, set up Windows or Ubuntu, compile once and start playing.

- [English](https://sproffes.github.io/mc3-web-sites/guide.html?lang=en)
- [Deutsch](https://sproffes.github.io/mc3-web-sites/guide.html?lang=de)
- [Français](https://sproffes.github.io/mc3-web-sites/guide.html?lang=fr)
- [Español](https://sproffes.github.io/mc3-web-sites/guide.html?lang=es)

The launcher interface is in English. The game's text and audio languages depend on the disc.

## Prepare once, play on another computer

Use Ubuntu or Windows with WSL to extract the disc and build the WebAssembly files. The computer you play on needs a recent desktop Chrome with WebAssembly threads and SIMD, WebGL 2, and enough memory to run the game. The same browser build can be used on compatible Windows, macOS and Linux computers. This project has verified the launcher with test files in Chromium on Linux.

To move the game, zip the extracted disc folder and its matching `.js` and `.wasm` files together. Include the `.worker.js` if the build produced one. Unzip the archive on the destination computer, open the launcher, and select the build files and the extracted disc folder there. Transfers between computers need no recompilation. Export and import your profile separately to keep your progress.

## Quick start

1. Use your own original Xbox copy of **DUB Edition Remix** (Europe or USA). **DUB Edition** for Xbox (Europe or USA) also works. If you have the physical disc, copy the contents of the Xbox DVD drive over FTP from an original Xbox with an FTP-enabled dashboard. A compatible reflashed DVD drive can make a full ISO. [Xbox disc backup guide](https://xemu.app/docs/disc-images/#backing-up-your-games)
2. On Windows, open PowerShell as administrator and run `wsl --install -d Ubuntu-24.04`. When Ubuntu is ready, run the commands below in its terminal. On Ubuntu, start with the commands below. [Microsoft WSL installation guide](https://learn.microsoft.com/windows/wsl/install)

   ```sh
   sudo apt update
   sudo apt install -y git make
   cd ~
   git clone https://github.com/sPROFFEs/mc3-web-sites.git
   cd mc3-web-sites
   make setup GAME=remix

   git clone https://github.com/emscripten-core/emsdk.git ~/emsdk
   cd ~/emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ~/emsdk/emsdk_env.sh
   cd ~/mc3-web-sites
   ```

3. Put your own ISO or XISO backup at `~/mc3.iso` and extract it. If you already have the files, put them under `game-remix/` so that `game-remix/default.xbe` exists and start at `make lift`. Use the original, unmodified `default.xbe`. Run each command after the previous one has finished.

   ```sh
   make extract GAME=remix ISO="$HOME/mc3.iso"
   make lift GAME=remix
   make web GAME=remix
   ```

4. In desktop Chrome, open the [launcher](https://sproffes.github.io/mc3-web-sites/). Under **Choose build files**, select `mcdub3remix.js` and `mcdub3remix.wasm` in `work-remix/build-web/`. Include the matching `.worker.js` if Emscripten created it. Under **Choose disc folder**, select `game-remix/` and press **Play**. Reselect the files and folder after reloading. On Windows, run `explorer.exe .` from the Ubuntu project directory to find the files. If Chrome cannot open the WSL path, copy them to a normal Windows folder. [Microsoft WSL file access guide](https://learn.microsoft.com/windows/wsl/filesystems)

For the original **DUB Edition**, use `GAME=dub` in all the `make` commands. The disc folder is `game/`, and the browser build files are `mcdub3.js` and `mcdub3.wasm` under `work-dub/build-web/`.

## Saves

Save inside the game. Chrome keeps the primary copy in its private storage for this site and that Chrome profile. In **Saves**, use **Back up to folder** whenever you want a dated ZIP in `mc3-saves-backup/` under a folder you choose. You can choose the extracted disc folder. **Export all saves** downloads a ZIP if Chrome cannot write to that folder.

To restore a profile, unzip the backup and select the `.mc3Remix` or `.mc3` file from `UDATA/` with **Saves → Import save** before starting the game. Keep a separate ZIP to recover your progress after clearing browser data or changing computers.

## Publishing the launcher

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions**. Push to `main` or run **Deploy GitHub Pages** from the **Actions** tab. `make web-pages` stages the same static files in `build-pages/`. GitHub Actions needs only the launcher assets. [GitHub Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

For controls and saves, see the [player reference](docs/web/PLAYING.md). For the development workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits and license

A fan project based on [mc3-web by Leandro Dettmer](https://github.com/LeandroDettmer/mc3-web), [mcdub3-nx](https://github.com/laureladastra/mcdub3-nx) by Laure Ladastra (MIT) and [xboxrecomp](https://github.com/sp00nznet/xboxrecomp). The WebGPU renderer and upstream networking draw from [nfsu2-web](https://github.com/th0mk/nfsu2-web) by th0mk (MIT).

The project's own code is licensed under [GNU AGPL-3.0](LICENSE) with an additional attribution term. Hosted copies must show “Based on mc3-web by Leandro Dettmer” with a link to the upstream project and offer the source for modified copies. See the full terms and third-party licenses in [NOTICE.md](NOTICE.md).

*Midnight Club* is a trademark of Take-Two Interactive and Rockstar Games. Xbox is a trademark of Microsoft. This is an unofficial fan project. The repository contains no game code or disc data.
