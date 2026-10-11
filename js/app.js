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
const STOREC = rgb(232, 220, 186);          // opened seed, ready to eat: pale crumbs
const SEEDC = [0, rgb(206, 170, 104), rgb(158, 110, 62), rgb(96, 58, 38)];   // small: tan, medium: brown, large: dark brown
const seedShade = (c, i) => { const k = 0.86 + ((i * 7919) % 5) * 0.06;     // no two seeds quite the same
  return rgb(Math.min(255, (c & 255) * k) | 0, Math.min(255, ((c >> 8) & 255) * k) | 0, Math.min(255, ((c >> 16) & 255) * k) | 0); };
const CHARCOAL = rgb(52, 46, 44), SPROUTC = rgb(112, 168, 70), HUSKC = rgb(214, 196, 150);
const EGGC = rgb(244, 240, 226);
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

// The sky by the hour: blue by day, warm at dawn and dusk, dark at night.
const skyNow = new Uint32Array(H);
let skyFor = -1;
function paintSky() {
  const day = Math.min(1, sky.sun * 4), glow = sky.sun > 0 ? Math.max(0, 1 - sky.sun * 5) : 0;   // glow: the sun is low
  const key = Math.round(day * 40) * 100 + Math.round(glow * 40);
  if (key === skyFor) return;
  skyFor = key;
  for (let y = 0; y < H; y++) {
    const c = skyPal[y], t = Math.min(1, y / GROUND);
    let r = mix(10, c & 255, day), g = mix(14, (c >> 8) & 255, day), b = mix(34, (c >> 16) & 255, day);
    r = mix(r, 236, glow * t * 0.75); g = mix(g, 150, glow * t * 0.55); b = mix(b, 96, glow * t * 0.5);
    skyNow[y] = rgb(r | 0, g | 0, b | 0);
  }
}

function draw() {
  x0 = Math.floor(camX); y0 = Math.floor(camY);
  paintSky();
  if (cfg.fog) light();
  for (let vy = 0; vy < vh; vy++) {
    const y = y0 + vy, row = y * W;
    for (let vx = 0; vx < vw; vx++) {
      const x = x0 + vx, i = row + x, t = grid[i];
      let c;
      if (t === AIR) c = food[i] ? seedShade(SEEDC[food[i]], i) : skyNow[y];
      // the sand disc carries flecks of charcoal [research; the ants collecting it is not modelled, the flecks are only drawn]
      else if (t === SAND) c = y < surf[x] ? ((Math.imul(i, 2654435761) >>> 19) % 13 === 0 ? CHARCOAL : sandPal[band[i] * 4 + tint[i]])
                             : (y === surf[x]) ? GRASS : sandPal[band[i] * 4 + tint[i]];
      else if (t === PLUG) c = sandPal[tint[i]];                    // the entrance, filled in for the night
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
    for (const kind of [LARGE, MEDIUM, SMALL]) for (let n = 0; n < dropped[kind] && k < dropCells.length; n++) { const c = dropCells[k++]; put(c % W, (c / W) | 0, seedShade(SEEDC[kind], c)); }
  }
  // The store: one mixed heap, the kinds scattered through it in their true numbers. A sprouted
  // seed shows green. (Opened seed is eaten or fed to the brood; it is not drawn.)
  const total = inStore(), shown = Math.ceil(total / SEEDS_PER_CELL);
  for (let k = 0; k < shown && k < heapCells.length; k++) {
    const c = heapCells[k], r = (Math.imul(c, 2654435761) >>> 8) % 1000 / 1000 * total;
    const colour = r < sprouted ? SPROUTC : r < sprouted + pile[LARGE] ? SEEDC[LARGE] : r < sprouted + pile[LARGE] + pile[MEDIUM] ? SEEDC[MEDIUM] : SEEDC[SMALL];
    put(c % W, (c / W) | 0, colour === SPROUTC ? colour : seedShade(colour, c));
  }
  if (zoom < 3) for (const e of eggs) if (e.st !== E_CARRIED) put(e.x, e.y, EGGC);     // closer in, brood is drawn with the ants
  // the husk heap by the entrance [research: husks go to their own rubbish pile on the mound; carrying them out is not modelled]
  for (let k = 0, n = Math.min(260, husks >> 2); k < n; k++) {
    const col = k % 26, x = ENTR.x - 34 - col + ((k / 26 | 0) & 1), y = ground[x] - 1 - (k / 26 | 0);
    if (Math.abs(col - 13) <= 13 - (k / 26 | 0) * 2) put(x, y, HUSKC);
  }
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
// Ants are drawn as ants, on top of the pixel world. A harvester ant has three clear parts: a head,
// a narrow thorax that carries all six legs, and a big round gaster, joined by a waist of two small
// knobs (the mark of its family). The antennae bend like an elbow.
//   minor worker: the standard ant, about four cells long (6.4 mm)
//   major worker: only a little longer, with a big square head
//   queen:        the largest, with a bulky thorax, a long gaster and stubs where her wings were
// The Florida harvester ant is rusty red to reddish brown: the head and gaster darker, the thorax
// and legs lighter. A new adult is pale amber and darkens over its first days.
const mix = (a, b, t) => a + (b - a) * t;
function antColour(a) {
  const t = Math.min(1, a.age / CALLOW), old = Math.min(1, a.age / (2 * FORAGE_AGE));
  let r = mix(216, mix(170, 142, old), t), g = mix(170, mix(80, 62, old), t), b = mix(110, mix(44, 34, old), t);
  if (a.life < HUNGRY) { r = mix(r, 150, 0.6); g = mix(g, 150, 0.6); b = mix(b, 145, 0.6); }   // a hungry ant goes grey
  return [r, g, b];
}
const css = ([r, g, b], k = 1) => `rgb(${Math.min(255, r * k) | 0},${Math.min(255, g * k) | 0},${Math.min(255, b * k) | 0})`;
const MINOR_BODY = { size: 0.92, head: [0.5, 0.46, false], thorax: [0.7, 0.34], gaster: [0.86, 0.66], stubs: false };
const MAJOR_BODY = { size: 0.98, head: [0.78, 0.74, true], thorax: [0.74, 0.37], gaster: [0.88, 0.68], stubs: false };
const QUEEN_BODY = { size: 1.55, head: [0.5, 0.46, false], thorax: [0.92, 0.56], gaster: [1.35, 0.78], stubs: true };

// Draw one ant with its head at world cell (x, y), facing along (dx, dy). `legs`: 0 none (a pupa),
// 1 standing, 2 walking.
function drawAnt(x, y, dx, dy, face, body, colour, legs, carried) {
  const z = zoom, hx = (x + 0.5 - camX) * z, hy = (y + 0.5 - camY) * z;
  if (z < 3) {                                 // zoomed right out: a short bar is all there is room for
    cctx.fillStyle = css(colour, 0.85);
    const len = 3.6 * z * body.size;
    cctx.fillRect(hx - (dx > 0 || (!dx && face > 0) ? len : 0), hy - z / 2, len, z);
    return;
  }
  let ux = dx, uy = dy;
  if (!ux && !uy) ux = face;
  const n = Math.hypot(ux, uy); ux /= n; uy /= n;
  // "down" for the legs: the side of the body that points toward the ground
  let nx = -uy, ny = ux;
  if (ny < -0.01 || (Math.abs(ny) <= 0.01 && nx * face < 0)) { nx = -nx; ny = -ny; }
  const u = body.size * z, angle = Math.atan2(uy, ux);
  const [hrx, hry, square] = body.head, [trx, try_] = body.thorax, [grx, gry] = body.gaster;
  // places along the body, in cells back from the front of the head
  const tHead = hrx, tThorax = 2 * hrx + trx - 0.1, tKnob1 = tThorax + trx + 0.14, tKnob2 = tKnob1 + 0.34, tGaster = tKnob2 + 0.12 + grx;
  const at = (t, off = 0) => [hx - ux * (t - tHead) * u + nx * off * u, hy - uy * (t - tHead) * u + ny * off * u];
  const oval = (t, rx, ry, k, off = 0) => {
    const [cx, cy] = at(t, off);
    cctx.fillStyle = css(colour, k);
    cctx.beginPath(); cctx.ellipse(cx, cy, rx * u, ry * u, angle, 0, 6.2832); cctx.fill();
  };
  cctx.lineCap = 'round'; cctx.lineJoin = 'round';
  cctx.strokeStyle = css(colour, 1.08); cctx.lineWidth = Math.max(1, z * 0.15 * body.size);
  cctx.beginPath();
  if (legs) {                                  // six legs, all from the thorax; three show from the side
    const step = legs === 2 ? ((tick >> 2) & 1 ? 0.26 : -0.26) : 0;
    for (let k = 0; k < 3; k++) {
      const [lx, ly] = at(tThorax - trx * 0.55 + k * trx * 0.55), reach = (1 - k) * 0.7 + (k % 2 ? -step : step);   // front leg forward, hind leg back
      cctx.moveTo(lx, ly);
      cctx.lineTo(lx + nx * 0.5 * u - ux * reach * 0.45 * u * -1, ly + ny * 0.5 * u - uy * reach * 0.45 * u * -1);        // the knee
      cctx.lineTo(lx + nx * 1.0 * u + ux * reach * 0.95 * u, ly + ny * 1.0 * u + uy * reach * 0.95 * u);                  // the foot
    }
    // antennae: up and forward from the front of the head, then bent like an elbow
    const [ax, ay] = at(0.12, -hry * 0.3);
    cctx.moveTo(ax, ay);
    cctx.lineTo(ax + (ux * 0.5 - nx * 0.55) * u, ay + (uy * 0.5 - ny * 0.55) * u);
    cctx.lineTo(ax + (ux * 1.1 - nx * 0.15) * u, ay + (uy * 1.1 - ny * 0.15) * u);
  }
  if (body.stubs) {                            // where the queen's wings were
    for (const t of [tThorax - 0.2, tThorax + 0.25]) { const [sx, sy] = at(t, -try_ * 0.8); cctx.moveTo(sx, sy); cctx.lineTo(sx - (ux * 0.3 + nx * 0.3) * u, sy - (uy * 0.3 + ny * 0.3) * u); }
  }
  cctx.stroke();
  oval(tGaster, grx, gry, 0.74);               // gaster: darker than the thorax
  oval(tGaster - grx * 0.15, grx * 0.45, gry * 0.28, 1.25, -gry * 0.42);   // a highlight along its back
  oval(tKnob1, 0.17, 0.17, 0.9); oval(tKnob2, 0.19, 0.2, 0.85);            // the two knobs of the waist
  oval(tThorax, trx, try_, 1);                 // thorax: narrow, and the lightest part
  if (square) {                                // a major's head: big and square
    const [cx, cy] = at(tHead);
    cctx.save(); cctx.translate(cx, cy); cctx.rotate(angle);
    cctx.fillStyle = css(colour, 0.8);
    cctx.beginPath(); cctx.roundRect(-hrx * u, -hry * u, 2 * hrx * u, 2 * hry * u, hry * u * 0.42); cctx.fill();
    cctx.restore();
  } else oval(tHead, hrx, hry, 0.8);           // head: darker too
  if (z >= 5) { const [ex, ey] = at(tHead - hrx * 0.35, -hry * 0.2); cctx.fillStyle = '#1a0e0a'; cctx.beginPath(); cctx.ellipse(ex, ey, 0.1 * u, 0.1 * u, 0, 0, 6.2832); cctx.fill(); }
  if (carried) {                               // held in the jaws, just in front of the head
    const [cx, cy] = at(-0.42);
    cctx.fillStyle = carried;
    cctx.beginPath(); cctx.ellipse(cx, cy, 0.5 * z, 0.5 * z, 0, 0, 6.2832); cctx.fill();
  }
}

// Brood, in its three stages [research: egg 8 days, larva 19, pupa 11; harvester ants spin no cocoon]:
// an egg is a tiny white speck, a larva a cream-coloured curled grub, a pupa a pale, still ant with
// its legs folded away.
const EGG_DAYS = 8, LARVA_DAYS = 19;
const PUPA_BODY = { size: 0.72, head: [0.5, 0.46, false], thorax: [0.7, 0.36], gaster: [0.86, 0.66], stubs: false };
function drawBrood(e) {
  const z = zoom, cx = (e.x + 0.5 - camX) * z, cy = (e.y + 0.5 - camY) * z, age = HATCH - e.timer;
  if (age < EGG_DAYS * DAY) {
    cctx.fillStyle = '#f6f3ea';
    cctx.beginPath(); cctx.ellipse(cx, cy + 0.2 * z, 0.28 * z, 0.2 * z, 0, 0, 6.2832); cctx.fill();
  } else if (age < (EGG_DAYS + LARVA_DAYS) * DAY) {
    const grown = (age / DAY - EGG_DAYS) / LARVA_DAYS;       // a larva grows as it is fed
    cctx.strokeStyle = '#efe2bd'; cctx.lineWidth = (0.42 + 0.3 * grown) * z; cctx.lineCap = 'round';
    cctx.beginPath(); cctx.arc(cx, cy, (0.3 + 0.3 * grown) * z, 0.6, 4.6); cctx.stroke();
  } else drawAnt(e.x, e.y, (e.slot & 1) ? 1 : -1, 0, 1, PUPA_BODY, [236, 218, 178], 0, null);
}

const hex = c => `rgb(${c & 255},${(c >> 8) & 255},${(c >> 16) & 255})`;
function drawAnts() {
  const xa = camX - 10, xb = camX + vw + 10, ya = camY - 10, yb = camY + vh + 10;
  const seen = (x, y) => x >= xa && x <= xb && y >= ya && y <= yb && (!cfg.fog || vis[y * W + x]);
  if (zoom >= 3) for (const e of eggs) if (e.st !== E_CARRIED && seen(e.x, e.y)) drawBrood(e);
  for (const a of ants) {
    if (!seen(a.x, a.y)) continue;
    const carried = a.carry === SPROUTED ? hex(SPROUTC) : a.mill ? hex(SEEDC[a.mill]) : a.carry ? hex(SEEDC[a.carry]) : a.egg ? '#f2ead2' : a.load ? hex(sandPal[a.shade * 4 + 1]) : null;
    const still = a.state === REST;            // a resting ant stands level on the floor
    drawAnt(a.x, a.y, still ? a.face : a.dx, still ? 0 : a.dy, a.face, a.caste === MAJOR ? MAJOR_BODY : MINOR_BODY,
            antColour(a), still || a.sleep ? 1 : 2, carried);
  }
  if (seen(queen.x, queen.y)) drawAnt(queen.x, queen.y, queen.face, 0, queen.face, QUEEN_BODY, queen.dead ? [128, 120, 116] : [150, 62, 36], 1, null);
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
  const n = { explore: 0, forage: 0, home: 0, rest: 0, dig: 0, nurse: 0, patrol: 0, haul: 0, mill: 0 };
  for (const a of ants) {
    switch (a.state) {
      case EXPLORE: n.explore++; break;
      case FORAGE: n.forage++; break;
      case RETURN: n.home++; break;
      case REST: n.rest++; break;
      case PATROL: case DEFEND: n.patrol++; break;
      case FETCH: case CARRYEGG: n.nurse++; break;
      case HAUL: case FEED: n.haul++; break;
      case MILL: n.mill++; break;
      default: n.dig++;                        // digging, or carrying a pellet out
    }
  }
  const dug = plan.order.length - plan.left;
  $('stats').innerHTML =
    `<span><b>${dateText()}</b>, year ${sky.year} · day <b>${1 + Math.floor(tick / DAY)}</b> of the colony${behind ? ` · running at ×${Math.round(behind)}, not ×${RATES[cfg.rate]}` : ''}</span>` +
    `<span>sand surface <b>${Math.round(sky.surface)} °C</b> · ${sky.outside ? 'working hours' : `<span style="color:#e0b45a">${sky.why}</span>`}${sky.laying ? '' : ' · the queen is not laying'}</span>` +
    `<span>${saveProblem ? `<span style="color:#e0645a">not saved: ${saveProblem}</span>` : lastSave ? `saved (${Math.max(1, Math.round(savedBytes / 1024))} KB)` : 'not saved yet'}</span>` +
    `<span>ants <b>${ants.length}</b>, right now: on patrol <b>${n.explore}</b> foraging <b>${n.forage}</b> on guard <b>${n.patrol}</b> going home <b>${n.home}</b> ` +
    `digging <b>${n.dig}</b> carrying seeds down <b>${n.haul}</b> opening seeds <b>${n.mill}</b> carrying brood <b>${n.nurse}</b> resting <b>${n.rest}</b></span>` +
    `<span>nest <b>${plan.left ? Math.floor(100 * dug / plan.order.length) + '% dug' : 'finished'}</b>: ${dug} of ${plan.order.length} cells, planned depth ${Math.round(plan.depthCm)} cm · sand on the disc <b>${moundCells}</b></span>` +
    `<span>${storeApart() ? `waiting in the top chamber <b>${waiting()}</b> · ` : ''}store <b>${inStore()}/${storeCap()}</b> seeds: small <b>${pile[SMALL]}</b>, medium <b>${pile[MEDIUM]}</b>, large <b>${pile[LARGE]}</b>${sprouted ? ` · <span style="color:#8fc45a">sprouted <b>${sprouted}</b></span>` : ''}</span>` +
    `<span>food ready to eat <b>${stored}</b> meals · seeds brought home <b>${delivered}</b> · husks <b>${husks}</b>${wasted ? ` · large seeds thrown out <b>${wasted}</b>` : ''}</span>` +
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
