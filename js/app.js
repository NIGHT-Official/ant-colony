'use strict';
// Ant Colony: the page. Drawing, the mouse and keyboard, the panel, saving, and the clock that
// drives the simulation in js/sim.js.

const $ = id => document.getElementById(id);
const canvas = $('c'), cctx = canvas.getContext('2d');
const mini = $('mini'), mctx = mini.getContext('2d');

// ───────────────────────── the view ─────────────────────────
// The window shows part of the world. `zoom` is how many screen pixels one cell takes.
let dpr = 1, cw = 0, ch = 0, zoom = 4, vw = 1, vh = 1, camX = 0, camY = 0;
let vc = document.createElement('canvas'), vctx = null, img = null, px = null;
vis = new Uint8Array(N);                      // the cells lit right now (declared in sim.js)

function clampCam() {
  camX = Math.max(0, Math.min(W - vw, camX));
  camY = Math.max(0, Math.min(H - vh, camY));
}
function resize() {
  dpr = window.devicePixelRatio || 1;
  cw = Math.round(innerWidth * dpr); ch = Math.round(innerHeight * dpr);
  canvas.width = cw; canvas.height = ch;
  vw = Math.min(W, Math.ceil(cw / zoom)); vh = Math.min(H, Math.ceil(ch / zoom));
  vc.width = vw; vc.height = vh;
  vctx = vc.getContext('2d');
  img = vctx.createImageData(vw, vh);
  px = new Uint32Array(img.data.buffer);
  clampCam();
}
function setZoom(z, keepX = cw / 2, keepY = ch / 2) {
  z = Math.max(1, Math.min(10, Math.round(z)));
  if (z === zoom) return;
  const wx = camX + keepX / zoom, wy = camY + keepY / zoom;     // keep the same spot under the pointer
  zoom = z; resize();
  camX = wx - keepX / zoom; camY = wy - keepY / zoom; clampCam();
}
function centerCam() {                        // the entrance a third of the way down the window
  camX = ENTR.x - vw / 2; camY = ENTR.y - vh / 3; clampCam();
}

// ───────────────────────── colours ─────────────────────────
const rgb = (r, g, b) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
const skyPal = [];
for (let y = 0; y < H; y++) { const t = Math.min(1, y / GROUND); skyPal.push(rgb(90 + 60 * t | 0, 150 + 50 * t | 0, 215 + 20 * t | 0)); }
// Sandhill sand: pale at the top, more yellow and then orange-brown with depth. A pellet keeps the
// colour of the depth it came from, so the disc shows where the digging has reached.
const sandPal = [];
for (let b = 0; b < 16; b++) for (let n = 0; n < 4; n++) {
  const t = b / 15, j = (n - 1.5) * 5;
  sandPal.push(rgb(226 - 62 * t + j | 0, 208 - 88 * t + j | 0, 166 - 96 * t + j | 0));
}
const tunPal = [0, 1, 2, 3].map(n => rgb(58 + n * 2, 44 + n * 2, 32 + n * 2));
const nurPal = [0, 1, 2, 3].map(n => rgb(88 + n * 2, 60 + n * 2, 48 + n * 2));
const GRASS = rgb(126, 148, 74);
const STOREC = rgb(250, 232, 150);          // opened seed, ready to eat
const SEEDC = [0, rgb(242, 201, 76), rgb(214, 138, 52), rgb(134, 62, 38)];   // small: straw, medium: amber, large: dark red-brown
const EGGC = rgb(244, 240, 226), EGGSOON = rgb(255, 226, 140);
const CORPSEC = rgb(84, 76, 70);
const FLAG = rgb(236, 72, 153), FOGC = rgb(7, 5, 9);
const SPIDERC = rgb(46, 22, 58), SPIDERHIT = rgb(210, 190, 230), SPIDEREYE = rgb(235, 50, 50);

// ───────────────────────── drawing ─────────────────────────
let x0 = 0, y0 = 0;                          // the world cell at the view's top-left corner
const put = (x, y, c) => { x -= x0; y -= y0; if (x >= 0 && y >= 0 && x < vw && y < vh) px[y * vw + x] = c; };

function light() {                            // work out which cells are lit this frame
  for (let y = 0; y < vh; y++) vis.fill(0, (y0 + y) * W + x0, (y0 + y) * W + x0 + vw);
  pass++;
  for (const a of ants) revealAnt(a, true);
  revealAt(queen.x, queen.y, 11, true);
  // Places that stay lit with no ant there: the entrance once the sand disc has started, and
  // every flagged seed patch.
  if (moundCells > 0) revealStrip(ENTR.x, 40, true);
  for (const m of marks) revealStrip(m.x, 18, true);
  if (mouse.down) for (let y = mouse.y - 8; y <= mouse.y + 8; y++) for (let x = mouse.x - 8; x <= mouse.x + 8; x++)
    if (inb(x, y)) vis[y * W + x] = 1;       // lit only while you're pouring
}

function draw() {
  x0 = Math.floor(camX); y0 = Math.floor(camY);
  if (cfg.fog) light();
  for (let vy = 0; vy < vh; vy++) {
    const y = y0 + vy, row = y * W;
    for (let vx = 0; vx < vw; vx++) {
      const x = x0 + vx, i = row + x, t = grid[i];
      let c;
      if (t === AIR) c = food[i] ? SEEDC[food[i]] : skyPal[y];
      else if (t === SAND) c = (y === surf[x]) ? GRASS : sandPal[band[i] * 4 + tint[i]];
      else c = nurserySet[i] ? nurPal[tint[i]] : tunPal[tint[i]];
      if (cfg.show) {                         // scent trails: blue toward home, green toward seeds
        const h = scent(HOME, i), f = scent(FOOD, i);
        if (h > 0.02 || f > 0.02) {
          let r = c & 255, g = (c >> 8) & 255, b = (c >> 16) & 255;
          if (h > 0.02) { const k = Math.min(0.85, h * 1.1); r += (60 - r) * k; g += (120 - g) * k; b += (255 - b) * k; }
          if (f > 0.02) { const k = Math.min(0.85, f * 1.1); r += (40 - r) * k; g += (255 - g) * k; b += (80 - b) * k; }
          c = rgb(r | 0, g | 0, b | 0);
        }
      }
      px[vy * vw + vx] = c;
    }
  }
  // the store fills from the first cell on: large seeds, then medium, small, and the opened food
  if (storeApart()) {                         // seeds waiting in the top chamber to be carried down
    let k = 0;
    for (const kind of [LARGE, MEDIUM, SMALL]) for (let n = 0; n < dropped[kind] && k < topCells.length; n++) { const c = topCells[k++]; put(c % W, (c / W) | 0, SEEDC[kind]); }
  }
  let cell = 0;
  for (const [count, colour] of [[pile[LARGE], SEEDC[LARGE]], [pile[MEDIUM], SEEDC[MEDIUM]], [pile[SMALL], SEEDC[SMALL]], [stored, STOREC]])
    for (let k = 0; k < count && cell < storeCells.length; k++) { const c = storeCells[cell++]; put(c % W, (c / W) | 0, colour); }
  for (const e of eggs) if (e.st !== E_CARRIED) put(e.x, e.y, (e.timer < HOUR && (tick >> 3) & 1) ? EGGSOON : EGGC);
  for (const m of marks) for (let k = 5; k <= 9; k++) put(m.x, m.y - k, FLAG);      // a flag over each flagged patch
  for (const d of corpses) put(d.x, d.y, CORPSEC);
  for (const sp of spiders) {                  // only where an ant can see it
    if (cfg.fog && !vis[sp.y * W + sp.x]) continue;
    const bc = sp.hit ? SPIDERHIT : SPIDERC;
    for (let dy = -3; dy <= 2; dy++) for (let dx = -4; dx <= 4; dx++) if (dx * dx + dy * dy * 2 <= 16) put(sp.x + dx, sp.y + dy, bc);
    for (const s of [-1, 1]) for (let k = 1; k <= 3; k++) { put(sp.x + s * (4 + k), sp.y - 3 + k * 2, bc); put(sp.x + s * (3 + k), sp.y + 3 - k, bc); }
    put(sp.x + sp.face * 2, sp.y - 1, SPIDEREYE); put(sp.x + sp.face * 3, sp.y - 1, SPIDEREYE);
  }
  if (cfg.fog) {
    for (let vy = 0; vy < vh; vy++) {
      const row = (y0 + vy) * W + x0;
      for (let vx = 0; vx < vw; vx++) {
        const i = row + vx;
        if (vis[i]) continue;
        if (!explored[i]) { px[vy * vw + vx] = FOGC; continue; }
        const c = px[vy * vw + vx];           // seen before, nobody here now: dim and cool it
        px[vy * vw + vx] = ((255 << 24) | ((((c >> 16) & 255) * 0.55 | 0) << 16) | ((((c >> 8) & 255) * 0.42 | 0) << 8) | ((c & 255) * 0.38 | 0)) >>> 0;
      }
    }
  }
  vctx.putImageData(img, 0, 0);
  cctx.imageSmoothingEnabled = false;
  cctx.drawImage(vc, 0, 0, vw, vh, Math.round((x0 - camX) * zoom), Math.round((y0 - camY) * zoom), vw * zoom, vh * zoom);
  drawAnts();
}

// ───────────────────────── the ants themselves ─────────────────────────
// Ants are drawn as ants, on top of the pixel world: head, thorax, a narrow waist and a gaster, six
// legs seen as three from the side, and a pair of elbowed antennae. A minor worker is about four
// cells long (6.4 mm), a major has a much larger head, and the queen is nearly twice the size.
// The Florida harvester ant is rusty red. A new adult is pale amber and darkens over its first days.
const mix = (a, b, t) => a + (b - a) * t;
function antColour(a) {
  const t = Math.min(1, a.age / CALLOW), old = Math.min(1, a.age / (2 * FORAGE_AGE));
  let r = mix(214, mix(168, 132, old), t), g = mix(160, mix(58, 40, old), t), b = mix(96, mix(28, 22, old), t);
  if (a.life < HUNGRY) { r = mix(r, 150, 0.6); g = mix(g, 150, 0.6); b = mix(b, 145, 0.6); }   // a hungry ant goes grey
  return [r | 0, g | 0, b | 0];
}
const css = ([r, g, b], k = 1) => `rgb(${r * k | 0},${g * k | 0},${b * k | 0})`;

// Draw one ant with its head at world cell (x, y), facing the way it last moved.
function drawAnt(x, y, dx, dy, face, size, headSize, colour, moving, carried) {
  const z = zoom, hx = (x + 0.5 - camX) * z, hy = (y + 0.5 - camY) * z;
  if (z < 3) {                                 // zoomed right out: a short bar is all there is room for
    cctx.fillStyle = css(colour);
    cctx.fillRect(hx - (dx > 0 || (!dx && face > 0) ? 3 * z * size : 0), hy - z / 2, 3 * z * size, z);
    return;
  }
  let ux = dx, uy = dy;
  if (!ux && !uy) ux = face;
  const n = Math.hypot(ux, uy); ux /= n; uy /= n;
  // "down" for the legs: the side of the body that points toward the ground
  let nx = -uy, ny = ux;
  if (ny < -0.01 || (Math.abs(ny) <= 0.01 && nx * face < 0)) { nx = -nx; ny = -ny; }
  const u = size * z, at = t => [hx - ux * t * u, hy - uy * t * u];       // a point t cells back from the head
  const angle = Math.atan2(uy, ux);
  const blob = (t, rx, ry, k) => {
    const [cx, cy] = at(t);
    cctx.fillStyle = css(colour, k);
    cctx.beginPath(); cctx.ellipse(cx, cy, rx * u, ry * u, angle, 0, 6.2832); cctx.fill();
  };
  const back = (headSize - 1) * 0.5;           // a bigger head pushes the rest of the body back
  // legs first, so the body covers where they join
  cctx.strokeStyle = css(colour, 0.55); cctx.lineWidth = Math.max(1, z * 0.17 * size); cctx.lineCap = 'round';
  const step = moving ? ((tick >> 2) & 1 ? 0.28 : -0.28) : 0;
  cctx.beginPath();
  for (let k = 0; k < 3; k++) {
    const [lx, ly] = at(1.05 + back + k * 0.32), reach = (1 - k) * 0.75 + (k % 2 ? -step : step);   // front leg forward, hind leg back
    const kx = lx + nx * 0.55 * u + ux * reach * 0.5 * u, ky = ly + ny * 0.55 * u + uy * reach * 0.5 * u;   // the knee
    cctx.moveTo(lx, ly); cctx.lineTo(kx, ky);
    cctx.lineTo(lx + nx * 1.15 * u + ux * reach * u, ly + ny * 1.15 * u + uy * reach * u);
  }
  // antennae: out and up from the front of the head, with an elbow
  const [ax, ay] = at(-0.25 * headSize);
  cctx.moveTo(ax, ay);
  cctx.lineTo(ax + (ux * 0.55 - nx * 0.45) * u, ay + (uy * 0.55 - ny * 0.45) * u);
  cctx.lineTo(ax + (ux * 1.15 - nx * 0.2) * u, ay + (uy * 1.15 - ny * 0.2) * u);
  cctx.stroke();
  blob(2.95 + back, 0.85, 0.6, 0.78);          // gaster, a little darker
  blob(2.1 + back, 0.24, 0.22, 0.85);          // the waist
  blob(1.35 + back, 0.72, 0.42, 1);            // thorax
  blob(0.3, 0.55 * headSize, 0.5 * headSize, 0.92);   // head
  if (carried) {                               // held in the jaws, just in front of the head
    const [cx, cy] = at(-0.75 * headSize);
    cctx.fillStyle = carried;
    cctx.beginPath(); cctx.ellipse(cx, cy, 0.5 * z, 0.5 * z, 0, 0, 6.2832); cctx.fill();
  }
}

const hex = c => `rgb(${c & 255},${(c >> 8) & 255},${(c >> 16) & 255})`;
function drawAnts() {
  const xa = camX - 8, xb = camX + vw + 8, ya = camY - 8, yb = camY + vh + 8;
  for (const a of ants) {
    if (a.x < xa || a.x > xb || a.y < ya || a.y > yb) continue;
    const carried = a.carry ? hex(SEEDC[a.carry]) : a.egg ? hex(EGGC) : a.load ? hex(sandPal[a.shade * 4 + 1]) : null;
    const still = a.state === REST;            // a resting ant stands level on the floor
    drawAnt(a.x, a.y, still ? a.face : a.dx, still ? 0 : a.dy, a.face, 1, a.caste === MAJOR ? 1.6 : 1, antColour(a), !still && !a.sleep, carried);
  }
  if (queen.x >= xa && queen.x <= xb && queen.y >= ya && queen.y <= yb)
    drawAnt(queen.x, queen.y, queen.dx, queen.dy, queen.face, 1.7, 1.05, queen.dead ? [120, 112, 110] : [150, 40, 30], false, null);
}

// The minimap: the whole world, one dot for every eight cells, redrawn a few times a second.
const MINI = 8;
mini.width = W / MINI; mini.height = Math.ceil(H / MINI);
const mimg = mctx.createImageData(mini.width, mini.height), mpx = new Uint32Array(mimg.data.buffer);
const MSKY = rgb(96, 140, 190), MSAND = rgb(150, 118, 76), MTUN = rgb(244, 226, 170), MDIM = rgb(26, 22, 26);
function drawMini() {
  for (let my = 0; my < mini.height; my++) for (let mx = 0; mx < mini.width; mx++) {
    const i = Math.min(H - 1, my * MINI + 4) * W + mx * MINI + 4;
    mpx[my * mini.width + mx] = (cfg.fog && !explored[i]) ? MDIM : grid[i] === AIR ? MSKY : MSAND;
  }
  for (let k = 0; k < plan.order.length; k++) {           // the nest, so that a thin shaft still shows
    const c = plan.order[k];
    if (grid[c] === TUNNEL) mpx[(((c / W) | 0) / MINI | 0) * mini.width + ((c % W) / MINI | 0)] = MTUN;
  }
  mctx.putImageData(mimg, 0, 0);
  mctx.strokeStyle = '#fff'; mctx.lineWidth = 1;
  mctx.strokeRect(camX / MINI + 0.5, camY / MINI + 0.5, vw / MINI - 1, vh / MINI - 1);
}

// ───────────────────────── mouse and keyboard ─────────────────────────
const keys = {};
let mouse = { down: false, x: 0, y: 0, cx: 0, cy: 0 };   // x,y = world cell; cx,cy = window px
let panning = false, panX = 0, panY = 0, miniDrag = false;
const updateMouseWorld = () => {             // recomputed every frame so pouring follows a scrolling view
  mouse.x = Math.floor(camX + mouse.cx * dpr / zoom); mouse.y = Math.floor(camY + mouse.cy * dpr / zoom);
};
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('pointerdown', e => {
  mouse.cx = e.clientX; mouse.cy = e.clientY; canvas.setPointerCapture(e.pointerId);
  if (e.button === 0) mouse.down = true; else { panning = true; panX = e.clientX; panY = e.clientY; }
});
canvas.addEventListener('pointermove', e => {
  mouse.cx = e.clientX; mouse.cy = e.clientY;
  if (panning) { camX -= (e.clientX - panX) * dpr / zoom; camY -= (e.clientY - panY) * dpr / zoom; panX = e.clientX; panY = e.clientY; clampCam(); }
});
const release = () => { mouse.down = panning = false; };
canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
addEventListener('wheel', e => {
  e.preventDefault();
  if (e.ctrlKey) { setZoom(zoom + (e.deltaY < 0 ? 1 : -1), e.clientX * dpr, e.clientY * dpr); return; }
  const step = e.deltaY / zoom * 1.2;
  if (e.shiftKey) camX += step; else camY += step;
  camX += e.deltaX / zoom; clampCam();
}, { passive: false });
const miniJump = e => {
  const r = mini.getBoundingClientRect();
  camX = (e.clientX - r.left) / r.width * W - vw / 2; camY = (e.clientY - r.top) / r.height * H - vh / 2; clampCam();
};
mini.addEventListener('pointerdown', e => { miniDrag = true; mini.setPointerCapture(e.pointerId); miniJump(e); });
mini.addEventListener('pointermove', e => { if (miniDrag) miniJump(e); });
mini.addEventListener('pointerup', () => { miniDrag = false; });

function scrollView(dt) {
  const sp = 420 / zoom * (keys.shift ? 3 : 1) * dt / 1000 * 3;      // cells per second
  let dx = 0, dy = 0;
  if (keys.a || keys.arrowleft) dx -= 1;
  if (keys.d || keys.arrowright) dx += 1;
  if (keys.w || keys.arrowup) dy -= 1;
  if (keys.s || keys.arrowdown) dy += 1;
  if (dx || dy) { camX += dx * sp; camY += dy * sp; clampCam(); }
}
function pour() {                             // left-drag above ground: small seeds from the sky
  if (!mouse.down) return;
  for (let k = 0; k < 3; k++) placeSeed(mouse.x + ((Math.random() * 7 - 3) | 0), mouse.y + ((Math.random() * 7 - 3) | 0), SMALL);
}

const toggle = (btn, key) => { cfg[key] = !cfg[key]; btn.classList.toggle('on', cfg[key]); };
$('bFog').onclick   = () => toggle($('bFog'), 'fog');
$('bPher').onclick  = () => toggle($('bPher'), 'show');
$('bPause').onclick = () => toggle($('bPause'), 'paused');
$('bSpiders').onclick = () => toggle($('bSpiders'), 'spiders');
$('bSpawn').onclick = () => { if (spiders.length < 3) spawnSpider(); };
$('bCentre').onclick = centerCam;
$('bZoomIn').onclick = () => setZoom(zoom + 1);
$('bZoomOut').onclick = () => setZoom(zoom - 1);
const setRate = k => { cfg.rate = k; owed = 0; $('bRate').textContent = RATE_NAME[k] + ' (T)'; $('bRate').classList.toggle('on', k > 0); };
$('bRate').onclick = () => setRate((cfg.rate + 1) % RATES.length);
function showSettings() {
  $('bFog').classList.toggle('on', cfg.fog); $('bPher').classList.toggle('on', cfg.show);
  $('bPause').classList.toggle('on', cfg.paused); $('bSpiders').classList.toggle('on', cfg.spiders);
}
// A colony may be days or weeks old, so starting over asks first.
$('bReset').onclick = () => {
  if (!confirm('Start a new colony? The one you have now will be gone for good.')) return;
  genWorld(); centerCam(); awayTicks = 0; saveGame();
};
function toggleHud() {
  const hid = $('hud').classList.toggle('hidden');
  $('bShow').style.display = hid ? 'block' : 'none';
}
$('bHud').onclick = $('bShow').onclick = toggleHud;
$('bFull').onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
};
for (const b of document.querySelectorAll('button')) b.addEventListener('click', () => b.blur());   // keep Space/Enter for the game
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'p') $('bPher').click();
  else if (k === 'f') $('bFog').click();
  else if (k === ' ') { e.preventDefault(); $('bPause').click(); }
  else if (k === 'r') $('bReset').click();
  else if (k === 'g') $('bFull').click();
  else if (k === 'x') $('bSpiders').click();
  else if (k === 'k') $('bSpawn').click();
  else if (k === 'h') toggleHud();
  else if (k === 't') $('bRate').click();
  else if (k === 'c') centerCam();
  else if (k === '+' || k === '=') setZoom(zoom + 1);
  else if (k === '-') setZoom(zoom - 1);
  keys[k] = true;
  if (k.startsWith('arrow')) e.preventDefault();
});
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; release(); });
addEventListener('resize', resize);

// ───────────────────────── the panel ─────────────────────────
function hud() {
  const jobs = [0, 0, 0, 0, 0];
  for (const a of ants) jobs[taskOf(a)]++;
  const swatch = ['rgb(214,160,96)', 'rgb(190,100,56)', 'rgb(168,58,28)', 'rgb(132,40,22)', 'rgb(150,50,26)'];
  $('roster').innerHTML = [T_CALLOW, T_BROOD, T_TRANSFER, T_FORAGER, T_MAJOR].map(k =>
    `<div class="card"><i style="background:${swatch[k]}"></i><div>` +
    `<b>${TASK_NAME[k]}</b> ${jobs[k]}<br><small>${TASK_ROLE[k]}</small></div></div>`).join('') +
    `<div class="card"><i style="background:#ec4899"></i><div><b>Flagged seed patches</b> ${marks.length}<br>` +
    `<small>${lying} seeds lying outside</small></div></div>` +
    (cfg.spiders || spiders.length ? `<div class="card"><i style="background:#2e163a"></i><div><b>Spiders</b> ${spiders.length} <small>about</small><br>` +
    `<small>killed ${spidersKilled} · ants lost ${lostToSpiders}</small></div></div>` : '');
  const n = { explore: 0, forage: 0, home: 0, rest: 0, dig: 0, nurse: 0, patrol: 0, haul: 0 };
  for (const a of ants) {
    switch (a.state) {
      case EXPLORE: n.explore++; break;
      case FORAGE: n.forage++; break;
      case RETURN: n.home++; break;
      case REST: n.rest++; break;
      case PATROL: case DEFEND: n.patrol++; break;
      case FETCH: case CARRYEGG: n.nurse++; break;
      case HAUL: n.haul++; break;
      default: n.dig++;                        // digging, or carrying a pellet out
    }
  }
  const dug = plan.order.length - plan.left;
  $('stats').innerHTML =
    `<span>colony age <b>${ageText(tick)}</b>${behind ? ` · running at ×${Math.round(behind)}, not ×${RATES[cfg.rate]}` : ''}</span>` +
    `<span>${saveProblem ? `<span style="color:#e0645a">not saved: ${saveProblem}</span>` : lastSave ? `saved (${Math.max(1, Math.round(savedBytes / 1024))} KB)` : 'not saved yet'}</span>` +
    `<span>ants <b>${ants.length}</b>, right now: on patrol <b>${n.explore}</b> foraging <b>${n.forage}</b> on guard <b>${n.patrol}</b> going home <b>${n.home}</b> ` +
    `digging <b>${n.dig}</b> carrying seeds down <b>${n.haul}</b> carrying brood <b>${n.nurse}</b> resting <b>${n.rest}</b></span>` +
    `<span>nest <b>${plan.left ? Math.floor(100 * dug / plan.order.length) + '% dug' : 'finished'}</b>: ${dug} of ${plan.order.length} cells, planned depth ${Math.round(plan.depthCm)} cm · sand on the disc <b>${moundCells}</b></span>` +
    `<span>${storeApart() ? `waiting in the top chamber <b>${waiting()}</b> · ` : ''}store <b>${inStore()}/${storeCells.length}</b>: ready to eat <b>${stored}</b> · unopened small <b>${pile[SMALL]}</b>, medium <b>${pile[MEDIUM]}</b>, large <b>${pile[LARGE]}</b></span>` +
    `<span>seeds brought home <b>${delivered}</b> · husks <b>${husks}</b>${wasted ? ` · large seeds thrown out <b>${wasted}</b>` : ''}</span>` +
    `<span>brood <b>${eggs.length}</b>${eggs.some(e => e.st !== E_INCUB) ? ` (${eggs.filter(e => e.st !== E_INCUB).length} waiting to be carried)` : ''}</span>` +
    `<span>born <b>${born}</b> · died <b>${died}</b>: outside <b>${diedOutside}</b>, hunger <b>${diedHungry}</b>, old age <b>${diedOld}</b></span>` +
    (queen.dead ? `<span style="color:#e0645a">the queen is dead: no more eggs</span>` : `<span>queen <b>${Math.floor(queen.age / (365 * DAY))}</b> year${queen.age < 2 * 365 * DAY ? '' : 's'} old</span>`) +
    (ants.length === 0 && !eggs.length ? `<span style="color:#e0645a">no ants left: press R for a new colony</span>` : '');
}

// ───────────────────────── saving ─────────────────────────
// The colony is kept in the browser's database on this computer (js/store.js). When the page has
// been closed or hidden, the colony lives through the time it missed, up to CATCHUP_MAX, by
// running the same simulation quickly.
const SAVE_EVERY = 60 * 1000;                 // ms between automatic saves
// For trying things out: index.html?trial=24 starts a fresh colony 24 hours old that is never saved
// and leaves your real colony alone.
const TRIAL = Math.max(0, Math.min(240, Number(new URLSearchParams(location.search).get('trial')) || 0));
const CATCHUP_MAX = 3 * 24 * 3600 * 1000;     // ms of absence the colony lives through; anything longer is skipped
let lastSave = 0, saving = false, saveProblem = '', savedBytes = 0;
let awayTicks = 0, awayTotal = 0, awayNote = '';

async function saveGame() {
  if (saving || TRIAL) return;
  saving = true;
  try {
    const record = await packSave(saveState());
    await putRecord(record);
    savedBytes = packedSize(record); lastSave = Date.now(); saveProblem = '';
  } catch (e) {
    console.warn('The colony could not be saved.', e);
    saveProblem = 'this browser would not store the colony';   // a private window, or storage switched off or full
  } finally { saving = false; }
}
// Returns true if a saved colony was restored.
async function loadGame() {
  try {
    const record = await getRecord();
    if (!record) return false;
    const state = await unpackSave(record);
    loadState(state);
    savedBytes = packedSize(record); lastSave = Date.now();
    if (!cfg.paused) beenAway(Date.now() - state.meta.savedAt);
    return true;
  } catch (e) {
    console.warn('The saved colony could not be read, so a new one was started.', e);
    genWorld();
    return false;
  }
}
// The colony missed `ms` of real time: queue it up to be lived through.
function beenAway(ms) {
  if (ms < 5000) return;
  const lived = Math.min(ms, CATCHUP_MAX);
  awayTicks += Math.round(lived / 1000 * TPS); awayTotal = awayTicks;
  awayNote = ms > CATCHUP_MAX
    ? `You were away ${ageText(ms / 1000 * TPS)}. The colony lives through the first ${ageText(CATCHUP_MAX / 1000 * TPS)} of that; the rest is skipped.`
    : `Catching up on ${ageText(ms / 1000 * TPS)} away.`;
}
addEventListener('pagehide', saveGame);                     // closing the page (a save in progress may not finish)
document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });   // switching away from it

// ───────────────────────── the clock ─────────────────────────
// Time is taken from the wall clock, so the colony keeps real time even when frames are slow.
let last = performance.now(), lastWall = Date.now(), owed = 0, frameNo = 0;
let behind = 0;                                // when fast-forward is more than the PC can do: the rate really reached
function frame(now) {
  const dt = Math.min(100, now - last); last = now;
  const wall = Date.now(), real = Math.max(0, wall - lastWall); lastWall = wall;
  if (real > 2000 && !cfg.paused) beenAway(real);          // the page was hidden: frames stop, the clock does not
  if (awayTicks > 0) {
    const t0 = performance.now();
    while (awayTicks > 0 && performance.now() - t0 < 30) {
      for (let k = 0; k < 64 && awayTicks > 0; k++) { simTick(); awayTicks--; }
    }
    $('away').style.display = 'block';
    $('away').textContent = awayTicks > 0
      ? `${awayNote} ${Math.floor(100 * (1 - awayTicks / awayTotal))}% done.`
      : awayNote.replace('Catching up on', 'Caught up on').replace('lives through', 'lived through').replace('is skipped', 'was skipped');
    if (awayTicks <= 0) { setTimeout(() => { if (awayTicks <= 0) $('away').style.display = 'none'; }, 8000); saveGame(); }
  } else if (!cfg.paused) {
    owed += Math.min(real, 1000) / 1000 * TPS * RATES[cfg.rate];
    const t0 = performance.now();
    let n = 0;
    while (owed >= 1 && performance.now() - t0 < 12) {       // at most 12 ms of simulating per frame
      for (let k = 0; k < 16 && owed >= 1; k++) { simTick(); owed--; n++; }
    }
    if (owed > TPS * RATES[cfg.rate]) {                      // more than a second behind: this rate is out of reach
      behind = n / (Math.min(real, 1000) / 1000 * TPS || 1); owed = 0;
    } else if (frameNo % 30 === 0) behind = 0;
  }
  scrollView(dt); updateMouseWorld();
  pour(); draw();
  if (frameNo % 12 === 0) drawMini();
  if (wall - lastSave > SAVE_EVERY && awayTicks <= 0) saveGame();
  if (frameNo++ % 6 === 0) hud();            // the panel's text doesn't need 60 updates a second
  requestAnimationFrame(frame);
}

resize();
genWorld();
try { localStorage.removeItem('ant-colony-save'); } catch (e) { /* the save of the earlier, smaller world; it cannot be read any more */ }
const begin = () => { showSettings(); setRate(0); setZoom(Number(new URLSearchParams(location.search).get('zoom')) || zoom); centerCam(); lastWall = Date.now(); requestAnimationFrame(frame); };
if (TRIAL) {                                  // a throwaway colony, run ahead; the saved one is not touched
  for (let k = 0; k < TRIAL * HOUR; k++) simTick();
  saveProblem = 'this is a trial colony (the address has ?trial in it)';
  begin();
} else loadGame().then(begin);
