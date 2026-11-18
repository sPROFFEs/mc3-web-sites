export async function openLocalFiles() {
  const sw = navigator.serviceWorker;
  if (!sw || !('BroadcastChannel' in self)) throw new Error('Open this page in a recent version of Chrome over HTTPS.');
  const script = new URL('pages-worker.js', location.href).href;
  const registration = await sw.register(script);
  const controlled = () => sw.controller?.scriptURL === script;
  const reloadKey = `mc3.pages.reload:${registration.scope}`;
  if (!controlled() || !self.crossOriginIsolated) {
    if (sessionStorage.getItem(reloadKey)) {
      sessionStorage.removeItem(reloadKey);
      throw new Error('Could not enable WebAssembly threads. Reload the page normally in Chrome.');
    }
    await new Promise((resolve, reject) => {
      const check = () => { if (controlled()) finish(); };
      const finish = error => {
        clearTimeout(timer);
        sw.removeEventListener('controllerchange', check);
        if (error) reject(error); else resolve();
      };
      const timer = setTimeout(() => finish(new Error('The service worker did not start. Reload this page to retry.')), 10000);
      sw.addEventListener('controllerchange', check);
      check();
    });
    sessionStorage.setItem(reloadKey, '1');
    location.reload();
    return null;
  }
  sessionStorage.removeItem(reloadKey);

  const id = crypto.randomUUID(), channel = new BroadcastChannel(`mc3-pages:${id}`);
  const root = new URL(`local-files/${id}/`, registration.scope).href;
  let modules = new Map(), disc = new Map();
  channel.onmessage = ({ data }) => {
    if (!data?.request) return;
    const blob = modules.get(data.path) ?? disc.get(data.path) ?? null;
    channel.postMessage({ reply: data.request, blob });
  };

  return {
    root,
    setBuild(files, apps) {
      const selected = new Map(Array.from(files, file => [file.name, file]));
      const games = Object.keys(apps).filter(game => {
        const app = apps[game];
        return selected.get(app + '.js')?.size && selected.get(app + '.wasm')?.size;
      });
      if (games.length !== 1) throw new Error('Choose the matching .js and .wasm files of one game from its build-web folder.');
      const game = games[0], app = apps[game];
      modules = new Map(['.js', '.wasm', '.worker.js', '-pipes-seed.bin'].flatMap(suffix => {
        const name = app + suffix;
        return selected.has(name) ? [[`module/${name}`, selected.get(name)]] : [];
      }));
      return game;
    },
    setDisc(files) {
      const entries = new Map();
      const encoder = new TextEncoder();
      const folder = files[0]?.webkitRelativePath.split('/')[0];
      for (const file of files) {
        const path = file.webkitRelativePath;
        if (!folder || !path.startsWith(folder + '/')) throw new Error('Choose a single extracted disc folder.');
        let rel = path.slice(folder.length + 1);
        if (rel.toLowerCase() === 'default.xbe') rel = 'default.xbe';
        // Keep paths representable by mount_disc() in src/web_fs.c.
        if (rel.startsWith('mc3-saves-backup/') || /[\r\n]/.test(rel) || rel.startsWith('.') || encoder.encode(rel).length > 1017) continue;
        entries.set(rel, file);
      }
      if (!entries.get('default.xbe')?.size) throw new Error('Choose the extracted folder that contains default.xbe.');
      const manifest = Array.from(entries, ([p, f]) => ({ p, s: f.size, m: Math.floor(f.lastModified / 1000) }));
      disc = new Map(Array.from(entries, ([path, file]) => [`disc/${path}`, file]));
      disc.set('disc.list', new Blob([[...entries.keys()].join('\n') + '\n'], { type: 'text/plain' }));
      disc.set('disc.manifest', new Blob([JSON.stringify({ files: manifest })], { type: 'application/json' }));
      return { name: folder, count: entries.size };
    },
  };
}
