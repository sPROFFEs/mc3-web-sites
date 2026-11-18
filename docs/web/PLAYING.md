# Playing Midnight Club 3 in Chrome

The GitHub Pages launcher runs the game in single-player mode on your computer. Make the browser build once and keep it with your own extracted Xbox disc files. Open **Setup guide** on the launcher to follow the steps in [English](https://sproffes.github.io/mc3-web-sites/guide.html?lang=en), [Deutsch](https://sproffes.github.io/mc3-web-sites/guide.html?lang=de), [Français](https://sproffes.github.io/mc3-web-sites/guide.html?lang=fr) or [Español](https://sproffes.github.io/mc3-web-sites/guide.html?lang=es). There is also a [quick start](../../README.md#quick-start) in the repository.

You can prepare the files on Ubuntu or WSL and move them to another computer. Copy the extracted disc folder and its matching browser build. If you packed them in a ZIP, unpack it before selecting the files in Chrome. Export your save separately to transfer your progress.

## Start a session

1. Open the launcher in desktop Chrome. On your first visit it reloads once to enable WebAssembly threads.
2. Use **Choose build files** to select the matching `.js` and `.wasm` files. Include the matching `.worker.js` if your build produced one.
3. Use **Choose disc folder** to select the extracted folder with `default.xbe` at its root. Press **Play**.
4. Click inside the game to give it keyboard focus. Select the files and folder again after reloading the page.

## Controls and settings

| Keys | Xbox controls |
| --- | --- |
| ← → | Steer |
| ↑ ↓ | Gas, brake or reverse |
| A, B, X, Y | Face buttons |
| Space | Handbrake |
| Enter | Start |
| Backspace or Tab | Back |
| I, J, K, L | D-pad |
| Q, E (or Shift, Ctrl) | White, Black |
| T, F, G, H | Right stick |
| Z, C | Left and right stick clicks |

In **Controls**, choose a controller or bind the buttons. When you first connect a controller, press a button on it so Chrome can detect it. **Settings** has graphics, language and input options. If the game runs slowly, start at 1× resolution. The available game languages depend on the disc.

## Save, back up and restore

- Save in the game. Chrome stores the primary save in private storage for the site and browser profile. It stays between visits.
- Open **Saves → Back up to folder** and grant write access to a folder. The launcher writes a dated ZIP under `mc3-saves-backup/`. You can choose the extracted game folder.
- Use **Export all saves** to download a ZIP. To restore a profile from a ZIP, extract it and import the `.mc3Remix` or `.mc3` under `UDATA/` with **Import save** before playing. You can also download an individual profile from the **Saves** tab.
- Save before using **Quit**. The page reloads and Chrome releases access to the game files.
