'use strict';
// Ant Colony: the simulation.
//
// Everything the colony does is in this file. It draws nothing and uses nothing from the
// browser, so the same code runs in the page (js/app.js), and without a browser in the
// tools (tools/*.js).
//
// The colony is modelled on the Florida harvester ant (Pogonomyrmex badius). Numbers are
// marked [research] (docs/research/*.md), [borrowed] (measured in a related species) or
// [guess] (nobody has measured it; the value is ours).

// ───────────────────────── scale and time ─────────────────────────
const CELL_MM = 1.6;     // one cell is 1.6 mm: one pellet of sand [research: a pellet is about 162 grains; the 1.6 mm is derived]
const CELL_CM = CELL_MM / 10;
const TPS     = 19;      // ticks per second. An ant walks one cell per tick: about 3 cm/s [borrowed: 2–7 cm/s]
const SEC = TPS, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR;   // real durations, in ticks
const RATES = [1, 60, 600];                                          // real time, and two fast-forwards
const RATE_NAME = ['real time', 'fast: 1 s = 1 min', 'very fast: 1 s = 10 min'];

// ───────────────────────── the world ─────────────────────────
const W = 2000;          // 3.2 m of ground, a slice of the colony's territory
const H = 900;           // 19 cm of sky and 1.25 m of sand below it
const GROUND = 120;      // the row the surface sits at, give or take a few cells
const N = W * H;
const AIR = 0, SAND = 1, TUNNEL = 2;

const grid     = new Uint8Array(N);    // what each cell is
const food     = new Uint8Array(N);    // the kind of seed lying in the cell (0 = none)
const tint     = new Uint8Array(N);    // per-cell colour noise, 0–3
const band     = new Uint8Array(N);    // for sand: how deep it came from (0 = top, 15 = deepest); a pellet keeps its band
const explored = new Uint8Array(N);    // ever seen by an ant
const surf     = new Int16Array(W);    // the ground's original height in each column
const ground   = new Int16Array(W);    // the ground's height now (the sand disc raises it)

// ───────────────────────── tuning ─────────────────────────
const MAXT    = 1100;    // a scent trail's length: its strength fades with steps walked
const TRAIL_HALF = 12 * MIN;   // a trail loses half its strength in this time [research: fades in 15–30 min]
const MAXANTS = 400;
// An ant's "life" is how long it can still go without eating; its age is counted separately.
const EAT_GAIN   = 2 * DAY;   // one meal keeps an adult going this long [guess: no intake per ant has been measured]
const LIFE_MAX   = 12 * DAY;  // a well-fed ant can go this long without food [guess: adults live off their fat]
const EAT_BELOW  = 6 * DAY;   // an ant resting in the nest eats once it is below this
const HUNGRY     = 3 * DAY;   // below this an ant heads home to eat (if there's food)
const EGG_COST   = 5;         // meals it takes to raise one worker [guess, from seed and worker weights]
const RESERVE    = 3;         // meals the queen leaves in the store for the workers
const HATCH      = 38 * DAY;  // egg to adult: 8 days as an egg, 19 as a larva, 11 as a pupa [research, an estimate]
const MAX_LOOSE  = 3;         // eggs waiting to be carried before the queen pauses
// Workers born per day grow with colony size N as 0.092 × N^0.7: about 3% a day in a colony
// of 30 and under 1% a day in one of 3,000 [research: 0.6–3% a day in July].
const layGap = n => DAY / (0.092 * Math.max(1, n) ** 0.7) * (0.6 + Math.random() * 0.8);
const fedFor = () => (7 + Math.random() * 5) * DAY;      // how well fed a new ant starts out
const restTime = () => (2 + Math.random() * 8) * MIN;    // a pause between jobs [guess]
const tripTime = () => ((5 + Math.random() * 10) * MIN) | 0;   // how long a trip outside lasts before giving up [borrowed: 1.5–47 min, 13 on average]
const START_ANTS = 30;        // a young colony [research: the smallest colonies have fewer than 100 workers]
const START_BROOD = 20;       // brood of every age already in the nest [research: a summer colony always holds brood]
const SIGHT = 9;              // cells at which a forager notices a seed (about 1.5 cm) [guess]

// ── ageing and death ──
const FORAGE_AGE = 43 * DAY;  // a worker stays inside until it is this old, then works outside [research: 43 days for summer-born workers]
const OUTSIDE_DEATHS = 0.0335;   // share of the outside workers that die each day, out on the surface [research: 3.35% a day]
const CALLOW = 10 * DAY;      // a new adult is pale for its first days [research: callows darken with age; the 10 days is a guess]
const CORPSE_TIME = DAY;      // a dead ant lies where it fell this long [guess; nestmates carrying the dead away is not modelled]
const oldAge = () => (365 + Math.random() * 90) * DAY;             // [research: a worker lives "probably somewhat more than a year"]
const queenLife = () => (15 + Math.random() * 15) * 365 * DAY;     // [borrowed: 15–30 years]

// ── castes and jobs ── (docs/research/roles-behavior.md)
// A caste is the body an ant is born with. The workers come in two: minors, and a few large-headed
// majors. A job is what a worker is doing at its age; it moves up through the nest as it gets older
// and never goes back:
//   callow       pale and new, deep in the nest
//   brood care   deep in the nest, carrying and tending the brood
//   transfer     the middle of the nest: carries seeds down to the store and sand up
//   forager      the top chamber and outside: collects seeds, and some trips are patrols or guard duty
// Majors keep to the store, where they speed up the opening of seeds. They do not fight: there is no
// soldier caste, and defence falls to the older workers at the surface. [research]
const MINOR = 0, MAJOR = 1;
const MAJOR_SHARE = 0.07;     // of workers born [research: 5–7% of workers, about 10% in July]
const NURSE_UNTIL = 25 * DAY; // brood care ends and transfer work begins [guess, from 35% of workers deep, 25% transfer, 40% foragers]
const T_CALLOW = 0, T_BROOD = 1, T_TRANSFER = 2, T_FORAGER = 3, T_MAJOR = 4;
const TASK_NAME = ['Callows', 'Brood care', 'Transfer workers', 'Foragers', 'Majors'];
const TASK_ROLE = ['new adults, still pale', 'tend and carry the brood', 'seeds down, sand up', 'collect seeds · patrol · guard', 'open seeds in the store'];
const taskOf = a => a.caste === MAJOR ? T_MAJOR : a.age < CALLOW ? T_CALLOW : a.age < NURSE_UNTIL ? T_BROOD : a.age < FORAGE_AGE ? T_TRANSFER : T_FORAGER;
const newCaste = () => Math.random() < MAJOR_SHARE ? MAJOR : MINOR;
// Ages for a colony met in summer [research: about 40% foragers, 25% transfer workers, the rest deep inside].
const startAge = () => { const r = Math.random();
  return r < 0.4 ? FORAGE_AGE + Math.random() * 45 * DAY : r < 0.65 ? NURSE_UNTIL + Math.random() * (FORAGE_AGE - NURSE_UNTIL) : Math.random() * NURSE_UNTIL; };

// ── seeds ── (docs/research/seeds-diet-sizes.md)
// Three kinds, told apart by width, because width decides what the ants can do with a seed:
//   SMALL  1 mm wide or less (panicgrass, paspalum): opened within days and eaten
//   MEDIUM 1 to 1.4 mm: opened too, but slowly
//   LARGE  1.4 mm and up (croton, poorjoe, sumac): cannot be opened; stored until it sprouts
const SMALL = 1, MEDIUM = 2, LARGE = 3;
const SEED_NAME = ['', 'small', 'medium', 'large'];
// Food in a seed, counted in meals. One meal is one small seed (about 0.6 mg) and feeds an adult
// for EAT_GAIN. [research for the weights: about 0.6, 1.2 and 3 mg; the meal itself is a guess]
const SEED_MEALS = [0, 1, 2, 5];
// Share of an unopened pile that the workers open each day. [research: 80% of small and 60% of
// medium seeds were opened within about 6 days in the lab]
const OPEN_PER_DAY = [0, 0.268, 0.153, 0];
// Share of the stored large seeds that sprout each day; a sprouted seed is soft and is eaten at once.
// [guess: sprouting really follows the seasons, peaking in April and December; there are no seasons yet]
const SPROUT_PER_DAY = 0.01;
const SEED_MIX = [0, 0.65, 0.10, 0.25];   // what falls: each patch is one kind [guess]
const LARGE_SHARE = 0.7;      // large seeds may fill this much of the store [research: about 70% of its weight]
// Seeds fall onto the surface by themselves, in small patches. [guess for the amounts]
const SEED_PATCHES_PER_DAY = 34, SEED_PATCH_MIN = 3, SEED_PATCH_MAX = 8;
const SEED_MAX = 900;         // no more fall while this many lie on the ground

// ── the nest ── (docs/research/nest-excavation.md)
// A colony digs its whole nest in a few days, to a plan set by its number of workers:
//   depth in cm        = 10^0.95 × workers^0.37   [research]
//   chamber area, cm²  = 10^0.55 × workers^0.87   [research]
// A shaft about 1 cm wide spirals down; in this side view it is a zigzag. Flat chambers 1 cm high
// hang on the outside of each bend, large and close together near the top, small and far apart
// lower down. The nest does not grow afterwards: a real colony gets a bigger nest by moving, and
// nest moves are not modelled yet.
const SHAFT_HALF = 16;        // the zigzag swings this far each side of the entrance [research: the spiral is 4–6 cm across]
const CHAMBER_H  = 6;         // a chamber is about 1 cm high [research]
const AREA_FALL  = 0.68;      // each tenth of the depth holds this share of the tenth above it [research: 25–40% less]
const PELLET_TIME = 18 * MIN; // work to bite one pellet loose [guess, set so that a nest takes 3–6 days as in the research]
const DIG_OLD = 0.82, DIG_YOUNG = 0.19;   // share of the older (transfer and forager) and of the younger workers that dig [research]
const MOUND_H = 5;            // the sand disc is at most this many cells deep [research: about 1 cm]

// ───────────────────────── state ─────────────────────────
let tick = 0;
let ants = [], eggs = [], marks = [], spiders = [], corpses = [];
let stored = 0;                            // meals ready to eat
let pile = [0, 0, 0, 0];                   // unopened seeds in the store, by kind
let dropped = [0, 0, 0, 0];                // seeds left in the top chamber by foragers, waiting to be carried down
let opening = [0, 0, 0, 0];                // parts of a seed opened so far, by kind
let husks = 0, wasted = 0;                 // seed coats thrown out; large seeds brought home with no room for them
let delivered = 0, born = 0, died = 0, diedOutside = 0, diedOld = 0, diedHungry = 0;
let tunnelCells = 0, moundCells = 0, lying = 0;   // lying: seeds on the ground outside
let mapsDirty = true;
const cfg = { spiders: false, fog: true, rate: 0, show: false, paused: false };
const ENTR = { x: W >> 1, y: 0 };          // the nest entrance
const queen = { x: 0, y: 0, px: -1, py: -1, dx: 1, dy: 0, face: 1, vert: false, vface: 1, cd: 0, hp: 0, dead: false, age: 0, maxAge: 0 };
let plan = null;                           // the nest being dug: see makePlan()
let nurseryCells = [], slotTaken = [], storeCells = [], topCells = [];
let heapCells = [], dropCells = [];            // the store's and the top chamber's cells from the floor up, for drawing the seed piles
let nurseryRooms = '';                     // which chambers the nursery is in, as text, to notice a change
const nurserySet = new Uint8Array(N);      // 1 = nursery floor
const E_LOOSE = 0, E_CARRIED = 2, E_INCUB = 3;
const inStore = () => stored + pile[SMALL] + pile[MEDIUM] + pile[LARGE];   // everything taking up room in the store
const waiting = () => dropped[SMALL] + dropped[MEDIUM] + dropped[LARGE];    // seeds in the top chamber
const storeApart = () => storeCells !== topCells;                           // is there a store chamber yet?

// spiders: a leftover from the game this started as, not part of the research; off unless switched on
const SPIDER_HP = 12, SPIDER_LIFE = 30 * MIN, QUEEN_HP = 60, QUEEN_MORTAL = true;
const spiderCap = () => ants.length >= 20 ? 2 : 1;
let spiderTimer = DAY, spidersKilled = 0, lostToSpiders = 0, alarm = 0;

const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
const DX  = [1, 1, 0, -1, -1, -1, 0, 1];
const DY  = [0, 1, 1, 1, 0, -1, -1, -1];
const LEN = [1, 1.414, 1, 1.414, 1, 1.414, 1, 1.414];
const wts = new Float32Array(8);
const solid = (x, y) => !inb(x, y) || grid[y * W + x] === SAND;

// ───────────────────────── scent trails ─────────────────────────
// Each cell remembers how strong a trail was and when it was laid; its strength now is worked
// out when somebody asks. Nothing has to sweep the map to fade the trails.
const HOME = 1, FOOD = 2;
const scentS = [null, new Float32Array(N), new Float32Array(N)];   // strength when laid
const scentT = [null, new Int32Array(N), new Int32Array(N)];       // when: tick / 16
const FADE = Math.LN2 / TRAIL_HALF;
function scent(f, i) {
  const s = scentS[f][i];
  return s > 0 ? s * Math.exp((scentT[f][i] * 16 - tick) * FADE) : 0;
}
function layTrail(f, i, steps) {
  if (steps >= MAXT) return;
  const v = 1 - steps / MAXT;
  if (v > scent(f, i)) { scentS[f][i] = v; scentT[f][i] = tick >> 4; }
}

// ───────────────────────── routes through the tunnels ─────────────────────────
// A map holds, for every tunnel cell, the number of steps to the nearest of some set of cells.
// An ant follows one by stepping to the neighbour with the smaller number.
const BIG = 32000, QCAP = 300000;
function newMap() { return { d: new Int16Array(N).fill(BIG), q: new Int32Array(QCAP), n: 0 }; }
const exitMap = newMap();    // to the entrance
const topMap = newMap();     // to the top chamber: where seeds are dropped and outside workers rest
const midMap = newMap();     // to the store chambers: where the middle-aged rest
const nurseMap = newMap();   // to the nursery: brood, queen and the young
const digMap = newMap();     // to the places being dug
const eggMap = newMap();     // to eggs waiting to be carried
const spiderMap = newMap();  // to a spider that has got inside

function bfs(map, srcs) {
  const d = map.d, q = map.q;
  for (let k = 0; k < map.n; k++) d[q[k]] = BIG;       // forget the last answer, touching only what it reached
  let qh = 0, qt = 0;
  for (const i of srcs) if (grid[i] === TUNNEL && d[i] !== 0 && qt < QCAP) { d[i] = 0; q[qt++] = i; }
  while (qh < qt) {
    const i = q[qh++], x = i % W, y = (i / W) | 0, nd = d[i] + 1;
    for (let k = 0; k < 8; k++) {
      const nx = x + DX[k], ny = y + DY[k];
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx;
      if (grid[j] !== TUNNEL || d[j] <= nd) continue;
      if ((k & 1) && solid(x + DX[k], y) && solid(x, y + DY[k])) continue;   // no squeezing between two corners
      d[j] = nd;
      if (qt < QCAP) q[qt++] = j;
    }
  }
  map.n = qt;
}

// The cells of the entrance: tunnel with open air above.
function mouthCells() {
  const out = [];
  for (let x = ENTR.x - 4; x <= ENTR.x + 4; x++)
    for (let y = ENTR.y - 1; y <= ENTR.y + 1; y++)
      if (grid[y * W + x] === TUNNEL && grid[(y - 1) * W + x] === AIR) out.push(y * W + x);
  return out;
}

// ───────────────────────── the nest plan ─────────────────────────
// Returns the nest a colony of `workers` digs: its chambers, and every cell to dig in the order
// the digging goes. The first shaft and the top chamber are already dug when a colony starts,
// as if the move were a day old.
function makePlan(workers) {
  const ex = ENTR.x, sy = surf[ex];
  const depthCm = 10 ** 0.95 * workers ** 0.37, areaCm2 = 10 ** 0.55 * workers ** 0.87;
  // Chamber depths: 2–4 cm apart near the top, widening to 20–30 cm lower down [research].
  const zs = [];
  for (let z = 3; z < depthCm - 2; z += 3 + 25 * z / depthCm) zs.push(z);
  zs.push(depthCm);
  const weight = zs.map(z => AREA_FALL ** (10 * z / depthCm));
  const total = weight.reduce((a, b) => a + b, 0);

  const inPlan = new Set();
  const add = (list, x, y) => {
    if (x < 3 || x >= W - 3 || y >= H - 3 || y < surf[x]) return;
    const c = y * W + x;
    if (!inPlan.has(c)) { inPlan.add(c); list.push(c); }
  };
  // A length of shaft: a round brush about five cells wide dragged along a line.
  const shaft = (x0, y0, x1, y1) => {
    const list = [], steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let s = 0; s <= steps; s++) {
      const cx = Math.round(x0 + (x1 - x0) * s / steps), cy = Math.round(y0 + (y1 - y0) * s / steps);
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (dx * dx + dy * dy <= 5) add(list, cx + dx, cy + dy);
    }
    return list;
  };

  const chambers = [], segs = [];
  let px = ex, py = sy + 2;
  zs.forEach((z, k) => {
    const side = k % 2 ? -1 : 1, bx = ex + side * SHAFT_HALF, by = sy + Math.round(z / CELL_CM);
    segs.push(shaft(px, py, bx, by));
    // In this slice a round chamber of a given area shows as wide as its diameter.
    const area = areaCm2 * weight[k] / total;
    const width = Math.max(8, Math.round(2 * Math.sqrt(area / Math.PI) / CELL_CM));
    const floor = by + 2, cells = [];
    for (let s = 0; s <= width + 2; s++)               // outward from the bend, column by column
      for (let h = 0; h < CHAMBER_H; h++) {
        const end = width + 2 - s;                      // a flat floor, a low domed ceiling and a rounded far end
        if (h >= CHAMBER_H - (s < 1 ? 1 : 0) - (end < 3 ? (3 - end) * 2 : end < 6 ? 1 : 0)) continue;
        if (h === 0 && end < 2) continue;
        add(cells, bx + side * s, floor - h);
      }
    const role = k === 0 ? 'top' : z / depthCm >= 0.55 ? 'nursery' : 'store';
    chambers.push({ z, role, cells, dug: [], niche: Math.ceil(cells.length / 3) });
    px = bx; py = by;
  });

  // The order of digging: down the shaft with a small niche at each bend, widening the chambers
  // already started along the way, so that deepening and widening go on together [research].
  const order = [];
  const push = list => { for (const c of list) order.push(c); };
  push(segs[0]); push(chambers[0].cells);
  const start = order.length;                      // everything before this is dug at the start
  for (let k = 1; k < chambers.length; k++) {
    push(segs[k]); push(chambers[k].cells.slice(0, chambers[k].niche));
    const rest = chambers[k].cells.slice(chambers[k].niche), half = rest.length >> 1;
    if (k > 1) push(chambers[k - 1].cells.slice(chambers[k - 1].niche + ((chambers[k - 1].cells.length - chambers[k - 1].niche) >> 1)));
    push(rest.slice(0, half));
    if (k === chambers.length - 1) push(rest.slice(half));
  }
  const cellRoom = new Map();
  chambers.forEach((ch, k) => { for (const c of ch.cells) cellRoom.set(c, k); });
  return { workers, depthCm, areaCm2, chambers, order, start, first: 0, left: order.length, cellRoom, claims: new Map(), frontier: new Set() };
}

function setTunnel(c) {
  if (grid[c] === TUNNEL) return;
  grid[c] = TUNNEL; tunnelCells++; mapsDirty = true;
  const k = plan.cellRoom.get(c);
  if (k !== undefined) plan.chambers[k].dug.push(c);
  plan.left--;
}

// Decide what each part of the nest is used for, from what has been dug so far. Nobody plans
// this: the young live deep and the old near the top, and the rooms follow [research].
function assignRooms() {
  const rooms = plan.chambers, ready = ch => ch.dug.length >= 24;
  topCells = rooms[0].dug;
  let nurs = rooms.filter(ch => ch.role === 'nursery' && ready(ch));
  if (!nurs.length) {                                   // not dug yet: the deepest room there is
    for (let k = rooms.length - 1; k >= 0; k--) if (ready(rooms[k])) { nurs = [rooms[k]]; break; }
  }
  const stores = rooms.filter(ch => ch.role === 'store' && ready(ch));
  storeCells = stores.length ? [].concat(...stores.map(ch => ch.dug)) : rooms[0].dug;
  // Seeds lie in heaps on the floor: fill each room from its floor up, from the middle outward.
  const heap = cells => { let lo = 1e9, hi = -1e9; for (const c of cells) { const x = c % W; if (x < lo) lo = x; if (x > hi) hi = x; }
    const mid = (lo + hi) / 2; return cells.slice().sort((a, b) => ((b / W) | 0) + Math.abs(b % W - mid) * 0.22 - ((a / W) | 0) - Math.abs(a % W - mid) * 0.22); };
  heapCells = stores.length ? [].concat(...stores.map(ch => heap(ch.dug))) : heap(rooms[0].dug);
  dropCells = heap(rooms[0].dug);
  const names = nurs.map(ch => rooms.indexOf(ch)).join(',');
  if (names !== nurseryRooms) {
    // The nursery has moved deeper: the brood is where it was and has to be carried down.
    nurseryRooms = names;
    for (const c of nurseryCells) nurserySet[c] = 0;
    nurseryCells = [];
    for (const e of eggs) if (e.st === E_INCUB) { e.st = E_LOOSE; e.slot = -1; }
    for (const a of ants) if (a.egg) { a.egg.st = E_LOOSE; a.egg.slot = -1; a.egg = null; }
    slotTaken = [];
  }
  for (const ch of nurs)                                // new floor is added at the end, so brood keeps its place
    for (const c of ch.dug) if (!nurserySet[c]) { nurserySet[c] = 1; nurseryCells.push(c); slotTaken.push(0); }
}

function computeMaps() {
  assignRooms();
  bfs(exitMap, mouthCells());
  bfs(topMap, topCells);
  bfs(midMap, storeCells);
  bfs(nurseMap, nurseryCells);
  mapsDirty = false;
}

// Find the cells that can be dug right now (next in the plan and touching open tunnel), and the
// route to them.
function findDigging() {
  const P = plan, f = P.frontier;
  f.clear();
  while (P.first < P.order.length && grid[P.order[P.first]] !== SAND) P.first++;
  const srcs = [];
  for (let k = P.first; k < P.order.length && k < P.first + 500 && f.size < 40; k++) {
    const c = P.order[k];
    if (grid[c] !== SAND) continue;
    let open = -1;
    if (grid[c - 1] === TUNNEL) open = c - 1; else if (grid[c + 1] === TUNNEL) open = c + 1;
    else if (grid[c - W] === TUNNEL) open = c - W; else if (grid[c + W] === TUNNEL) open = c + W;
    if (open < 0) continue;
    f.add(c); srcs.push(open);
  }
  bfs(digMap, srcs);
}

// ───────────────────────── a new colony ─────────────────────────
function genWorld() {
  grid.fill(AIR); food.fill(0); explored.fill(0); nurserySet.fill(0); rimDone.fill(0);
  scentS[HOME].fill(0); scentS[FOOD].fill(0);
  for (const m of [exitMap, topMap, midMap, nurseMap, digMap, eggMap, spiderMap]) { m.d.fill(BIG); m.n = 0; }
  tick = 0; ants = []; eggs = []; marks = []; spiders = []; corpses = []; falling = [];
  stored = 20; pile = [0, 0, 0, 0]; dropped = [0, 0, 0, 0]; opening = [0, 0, 0, 0]; husks = 0; wasted = 0;   // [research: one young colony held 20 seeds]
  delivered = born = died = diedOutside = diedOld = diedHungry = 0;
  tunnelCells = moundCells = lying = 0;
  spiderTimer = DAY; spidersKilled = lostToSpiders = 0; alarm = 0;
  nurseryCells = []; slotTaken = []; storeCells = []; topCells = []; nurseryRooms = '';

  // Sandhill ground: gently rolling, flat around the nest, and no stones [research].
  const p1 = Math.random() * 6.28, p2 = Math.random() * 6.28;
  for (let x = 0; x < W; x++) {
    const flat = Math.min(1, Math.abs(x - ENTR.x) / 260);        // 0 at the entrance, 1 from 40 cm away
    surf[x] = ground[x] = Math.round(GROUND + flat * (6 * Math.sin(x * 0.012 + p1) + 3 * Math.sin(x * 0.04 + p2)));
    for (let y = surf[x]; y < H; y++) {
      const i = y * W + x;
      grid[i] = SAND; band[i] = Math.min(15, (y - surf[x]) / 48 | 0);
    }
  }
  for (let i = 0; i < N; i++) tint[i] = (Math.random() * 4) | 0;
  ENTR.y = surf[ENTR.x];

  plan = makePlan(START_ANTS);
  for (let k = 0; k < plan.start; k++) setTunnel(plan.order[k]);
  plan.first = plan.start;
  computeMaps();

  const home = topCells;
  const floor = Math.max(...home.map(c => (c / W) | 0));
  const onFloor = home.filter(c => ((c / W) | 0) === floor);
  const q = onFloor[onFloor.length >> 1];
  Object.assign(queen, { x: q % W, y: (q / W) | 0, px: -1, py: -1, cd: HOUR, hp: QUEEN_HP, dead: false,
                         age: 365 * DAY, maxAge: queenLife() });   // she is a year old when we meet her
  for (let n = 0; n < START_ANTS; n++) spawnAnt(fedFor(), undefined, undefined, n < 2 ? MAJOR : MINOR, startAge());   // two majors in thirty
  for (let k = 0; k < START_BROOD && k < nurseryCells.length; k++) {      // brood at every stage of growing up
    const c = nurseryCells[k];
    slotTaken[k] = 1;
    eggs.push({ x: c % W, y: (c / W) | 0, st: E_INCUB, slot: k, timer: (Math.random() * HATCH) | 0, caste: newCaste() });
  }
  for (let x = ENTR.x - 60; x <= ENTR.x + 60; x++)       // you start with a view of the ground around the entrance
    for (let y = 0; y <= surf[x] + 2; y++) explored[y * W + x] = 1;
}

// ───────────────────────── ants ─────────────────────────
const FORAGE = 0, RETURN = 1, REST = 2, DIGGO = 3, HAUL = 4, DUMP = 5, FETCH = 6, CARRYEGG = 7,
      EXPLORE = 8, PATROL = 10, DEFEND = 12;

function spawnAnt(life = fedFor(), x, y, caste = MINOR, age = 0) {
  if (x === undefined) {
    const c = topCells[(Math.random() * topCells.length) | 0];
    x = c % W; y = (c / W) | 0;
  }
  const d = (Math.random() * 8) | 0;
  ants.push({
    x, y, px: -1, py: -1, dx: DX[d], dy: DY[d], face: 1, vert: false, vface: 1,
    state: REST, timer: (Math.random() * 2 * MIN) | 0, sleep: 0,
    caste, life, age, maxAge: oldAge(),
    carry: 0, hauled: false, load: 0, shade: 0, egg: null, mark: null,
    stepsHome: 0, stepsFood: 0, hx: 1, post: 0,
    dig: Math.random(),                    // whether it is one of the diggers: see wantsToDig()
    work: 0, tcell: -1, dropX: 0,
    rx: -1, ry: -1,                        // where it last lit up the map
    doomed: false, cause: '',              // doomed: will not come back from its next time outside
  });
}
const wantsToDig = a => a.caste === MINOR && a.dig < (a.age >= NURSE_UNTIL ? DIG_OLD : DIG_YOUNG);

// Can an ant stand here?  Tunnels always; open air only if it's touching the ground, a tunnel
// or a seed (so ants crawl along the surface but don't walk through the sky).
function walkable(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return false;
  const t = grid[y * W + x];
  if (t === TUNNEL) return true;
  if (t !== AIR) return false;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    if (!i && !j) continue;
    const xx = x + i, yy = y + j;
    if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
    const k = yy * W + xx;
    if (grid[k] !== AIR || food[k]) return true;
  }
  return false;
}

// Pick a neighbour cell by weighted roulette.
//  f:      scent to follow (HOME, FOOD or 0)
//  vBias:  >0 prefers up, <0 prefers down
//  tx,ty:  a place to head for (or -1)
//  ax,ay,ar2: stay within a circle (for guards)
function chooseMove(a, f, vBias, tx, ty, mom = 1, ax = 0, ay = 0, ar2 = 0) {
  const ll = Math.hypot(a.dx, a.dy) || 1;
  let fvx = 0, fvy = 0;
  if (tx >= 0) {
    fvx = tx - a.x; fvy = ty - a.y;
    const n = Math.hypot(fvx, fvy) || 1; fvx /= n; fvy /= n;
  }
  let sum = 0;
  for (let d = 0; d < 8; d++) {
    const nx = a.x + DX[d], ny = a.y + DY[d];
    let w = 0;
    if (walkable(nx, ny) && (d % 2 === 0 || !(solid(a.x + DX[d], a.y) && solid(a.x, a.y + DY[d])))) {
      const ux = DX[d] / LEN[d], uy = DY[d] / LEN[d];
      w = 0.2 + mom * Math.max(0, (ux * a.dx + uy * a.dy) / ll);   // momentum
      if (nx === a.px && ny === a.py) w *= 0.08;                  // don't dither backwards
      if (f) w *= 1 + scent(f, ny * W + nx) * 20;
      if (tx >= 0) w *= 1 + 5 * Math.max(0, ux * fvx + uy * fvy);
      if (vBias) w *= Math.max(0.1, 1 - vBias * uy);
      if (ar2 && (nx - ax) ** 2 + (ny - ay) ** 2 > ar2) w = 0;
    }
    wts[d] = w; sum += w;
  }
  if (sum <= 0) return false;
  let r = Math.random() * sum, d = 0;
  while (d < 7 && (r -= wts[d]) > 0) d++;
  moveTo(a, a.x + DX[d], a.y + DY[d]);
  return true;
}

function moveTo(a, x, y) {
  a.dx = x - a.x; a.dy = y - a.y;
  if (a.dx) a.face = a.dx > 0 ? 1 : -1;
  if (a.dy && !a.dx) { a.vert = true; a.vface = a.dy > 0 ? 1 : -1; }   // moving straight up/down: stand upright
  else if (a.dx && !a.dy) a.vert = false;
  a.px = a.x; a.py = a.y; a.x = x; a.y = y;
}

// Step to the neighbouring tunnel cell closest to a map's goal; false if there's no way.
function descend(a, map) {
  const d = map.d;
  let best = -1, bv = 1e9;
  for (let k = 0; k < 8; k++) {
    const nx = a.x + DX[k], ny = a.y + DY[k];
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const j = ny * W + nx;
    if (grid[j] !== TUNNEL) continue;
    if ((k & 1) && solid(a.x + DX[k], a.y) && solid(a.x, a.y + DY[k])) continue;
    const v = d[j] + Math.random() * 0.6;
    if (v < bv) { bv = v; best = k; }
  }
  if (best < 0 || bv >= BIG) return false;
  moveTo(a, a.x + DX[best], a.y + DY[best]);
  return true;
}

// Where an ant rests: callows and brood-care workers deep in the nursery, transfer workers and
// majors among the stores, and foragers in the top chamber [research: workers move up as they age].
const homeMap = a => a.caste === MAJOR ? midMap : a.age < NURSE_UNTIL ? nurseMap : a.age < FORAGE_AGE ? midMap : topMap;
const defender = a => a.caste === MINOR && a.age >= FORAGE_AGE;      // the older workers at the surface

function goHome(a) { a.state = RETURN; a.tcell = -1; a.work = 0; a.timer = 30 * MIN; }

function stepAnt(a) {
  const i = a.y * W + a.x, inside = grid[i] === TUNNEL;
  if (spiders.length) {
    if (defender(a)) {                        // once the alarm is up, the workers at the surface turn out
      if (alarm > 0 && (a.state === PATROL || a.state === REST || a.state === RETURN) && !a.carry) { a.state = DEFEND; a.sleep = 0; }
    } else if (a.state === FORAGE || a.state === EXPLORE || a.state === DIGGO) {
      const sp = nearestSpider(a);            // everyone else bolts for home when one gets close
      if (sp && (sp.x - a.x) ** 2 + (sp.y - a.y) ** 2 <= (inside ? 120 : 320)) goHome(a);
    }
  }
  if (a.life < HUNGRY && stored > 0 && (a.state === FORAGE || a.state === DIGGO || a.state === EXPLORE || a.state === PATROL)) {
    goHome(a);                                // starving: go home and eat
  }
  switch (a.state) {

    case REST: {                              // looked at about once a second; the ant sleeps in between
      a.sleep = TPS - 1; a.timer -= TPS;
      if (stored > 0 && a.life <= EAT_BELOW) { stored--; a.life += EAT_GAIN; }
      const task = taskOf(a);
      if (task <= T_TRANSFER && a.life > HUNGRY && Math.random() < (task === T_TRANSFER ? 0.1 : 0.5) && eggs.some(e => e.st === E_LOOSE)) {
        a.state = FETCH; a.timer = 10 * MIN; a.sleep = 0; return;         // brood comes first, and mostly for the young
      }
      if (Math.random() < 0.3) {              // shuffle about, staying in the room
        const d = (Math.random() * 8) | 0, nx = a.x + DX[d], ny = a.y + DY[d];
        if (inb(nx, ny) && grid[ny * W + nx] === TUNNEL && homeMap(a).d[ny * W + nx] <= 2) moveTo(a, nx, ny);
      }
      if (a.timer > 0) break;
      a.sleep = 0;
      if (plan.left > 0 && a.life > HUNGRY && wantsToDig(a) && Math.random() < 0.7) {
        a.state = DIGGO; a.timer = 30 * MIN; a.tcell = -1; a.work = 0;
      } else if (task === T_FORAGER) {        // only the oldest workers leave the nest [research]
        const r = Math.random();
        if (!marks.length || r < 0.25) {      // a patrol: look for seed patches nobody has flagged [borrowed: patrollers]
          a.state = EXPLORE; a.timer = tripTime(); a.hx = Math.random() < 0.5 ? -1 : 1; a.stepsHome = 0;
        } else if (r < 0.33) {                // a spell on guard at the entrance
          a.state = PATROL; a.timer = ((5 + Math.random() * 4) * MIN) | 0;
        } else if (inStore() + waiting() < storeCells.length * 0.95) {
          a.state = FORAGE; a.timer = tripTime(); a.stepsHome = 0;
          a.mark = marks[(Math.random() * marks.length) | 0];
        } else a.timer = restTime() | 0;
      } else if (task === T_TRANSFER && waiting() > 0 && storeApart()) {
        a.state = HAUL; a.timer = 20 * MIN;   // seeds are waiting in the top chamber: carry one down
      } else a.timer = restTime() | 0;        // nothing to do: loiter
      break;
    }

    case FORAGE: {
      layTrail(HOME, i, a.stepsHome++);
      if (--a.timer <= 0) { goHome(a); return; }
      if (inside && exitMap.d[i] > 0) { if (!descend(a, exitMap)) goHome(a); break; }   // make for the entrance
      if (food[i]) {                         // found a seed: pick it up and turn around
        a.carry = food[i]; food[i] = 0; lying--; a.stepsFood = 0;
        goHome(a); a.dx = -a.dx; a.dy = -a.dy; a.px = -1; return;
      }
      // a seed in sight?
      let tx = -1, ty = -1, bd = 1e9;
      for (let y = a.y - 4; y <= a.y + 4; y++) for (let x = a.x - SIGHT; x <= a.x + SIGHT; x++) {
        if (inb(x, y) && food[y * W + x]) {
          const d = (x - a.x) ** 2 + (y - a.y) ** 2;
          if (d < bd) { bd = d; tx = x; ty = y; }
        }
      }
      if (tx < 0 && a.mark) {                // none: keep on toward the flagged patch
        if (Math.abs(a.x - a.mark.x) <= 6) a.mark = null;        // got there and it is gone
        else { tx = a.mark.x; ty = a.mark.y; }
      }
      chooseMove(a, FOOD, 0, tx, ty);
      break;
    }

    case RETURN: {
      if (a.carry) layTrail(FOOD, i, a.stepsFood++);
      if (!inside) {                         // on the surface: make for the entrance
        chooseMove(a, HOME, 0, ENTR.x, ENTR.y);
        break;
      }
      if (a.carry) {                         // seeds are dropped in the top chamber [research]
        if (topMap.d[i] <= 1) {
          const kind = a.carry;
          a.carry = 0;
          if (a.hauled) { a.hauled = false; dropped[kind]++; break; }   // a transfer worker that turned back: put it down again
          delivered++;
          // A large seed with no room left for large seeds is dropped on the rubbish heap.
          if (kind === LARGE && pile[LARGE] + dropped[LARGE] >= storeCells.length * LARGE_SHARE) wasted++;
          else if (inStore() + waiting() >= storeCells.length) wasted++;
          else if (storeApart()) dropped[kind]++;          // left here; transfer workers carry it down [research]
          else pile[kind]++;                               // no store chamber yet: this room is the store
        } else if (!descend(a, topMap)) a.carry = 0;
        break;
      }
      const m = homeMap(a);
      if (m.d[i] === 0 || !descend(a, m)) {  // in its room (or as near as it can get)
        a.stepsHome = 0; a.state = REST; a.timer = restTime() | 0;
      }
      break;
    }

    case EXPLORE: {                           // scout: roam the surface for seeds nobody has flagged
      layTrail(HOME, i, a.stepsHome++);
      if (--a.timer <= 0) { goHome(a); return; }
      if (inside && exitMap.d[i] > 0) { if (!descend(a, exitMap)) goHome(a); break; }
      let bx = -1, by = -1, bd = 1e9;
      for (let y = a.y - 5; y <= a.y + 5; y++) for (let x = a.x - 15; x <= a.x + 15; x++) {
        if (inb(x, y) && food[y * W + x]) {
          const d = (x - a.x) ** 2 + (y - a.y) ** 2;
          if (d < bd && !knownNear(x, y)) { bd = d; bx = x; by = y; }
        }
      }
      if (bx >= 0 && bd <= 25) { marks.push({ x: bx, y: by }); goHome(a); return; }
      if (a.x < 6) a.hx = 1; else if (a.x > W - 7) a.hx = -1;
      if (bx < 0) { bx = a.hx > 0 ? W - 4 : 3; by = a.y; }       // nothing in sight: keep going the way it set out
      chooseMove(a, 0, 0, bx, by, 2);
      break;
    }

    case PATROL: {                            // soldier: stand guard around the entrance
      if (--a.timer <= 0) { goHome(a); return; }
      if (inside && exitMap.d[i] > 0) { if (!descend(a, exitMap)) goHome(a); break; }
      chooseMove(a, 0, 0, -1, -1, 1, ENTR.x, ENTR.y, 900);
      break;
    }

    case DIGGO: {                             // go to where the nest is being dug and bite a pellet loose
      if (plan.left <= 0 || --a.timer <= 0) { plan.claims.delete(a.tcell); goHome(a); return; }
      if (!inside) { chooseMove(a, HOME, 0, ENTR.x, ENTR.y); break; }
      if (a.tcell >= 0) {
        if (grid[a.tcell] !== SAND) { a.tcell = -1; a.work = 0; break; }
        a.work += 1;                          // working the pellet loose
        if (a.work < PELLET_TIME) { const nap = Math.min(TPS - 1, PELLET_TIME - a.work); a.sleep = nap; a.work += nap; a.timer -= nap; break; }
        const c = a.tcell;
        plan.claims.delete(c); plan.frontier.delete(c);
        a.shade = band[c]; setTunnel(c);
        a.tcell = -1; a.work = 0; a.load = 1; a.state = DUMP; a.timer = 20 * MIN;
        const reach = Math.min(420, 20 + 5 * Math.sqrt(moundCells));       // the disc spreads as it grows
        a.dropX = ENTR.x + (Math.random() < 0.5 ? -1 : 1) * Math.round(7 + Math.random() * reach);
        break;
      }
      // at the digging face? claim a cell of the plan beside this one
      for (let k = 0; k < 8; k += 2) {
        const c = i + DX[k] + DY[k] * W;
        if (plan.frontier.has(c) && grid[c] === SAND) {
          const o = plan.claims.get(c);
          if (o && o !== a && o.tcell === c && o.life > 0) continue;       // somebody is on it
          plan.claims.set(c, a); a.tcell = c; a.work = 0; break;
        }
      }
      if (a.tcell < 0 && !descend(a, digMap)) { a.timer -= TPS; a.sleep = TPS - 1; }   // no way there just now: wait
      break;
    }

    case HAUL: {                              // transfer worker: carry a seed from the top chamber down to the store
      if (--a.timer <= 0 || !inside) { goHome(a); return; }
      if (!a.carry) {
        if (!waiting()) { goHome(a); return; }
        if (topMap.d[i] === 0) {
          const kind = dropped[LARGE] ? LARGE : dropped[MEDIUM] ? MEDIUM : SMALL;
          dropped[kind]--; a.carry = kind; a.hauled = true;
        } else if (!descend(a, topMap)) goHome(a);
      } else if (midMap.d[i] === 0) {
        pile[a.carry]++; a.carry = 0; a.hauled = false;
        if (!waiting() || Math.random() < 0.3) goHome(a);
      } else if (!descend(a, midMap)) goHome(a);
      break;
    }

    case DUMP: {                              // carry the pellet up and out onto the sand disc
      if (--a.timer <= 0) { a.load = 0; goHome(a); return; }
      if (inside) {
        if (exitMap.d[i] > 0) { if (!descend(a, exitMap)) { a.load = 0; goHome(a); } break; }
      } else if (Math.abs(a.x - a.dropX) <= 1) {
        dropPellet(a.x, a.shade); a.load = 0;
        if (plan.left > 0 && a.life > HUNGRY && Math.random() < 0.7) { a.state = DIGGO; a.timer = 30 * MIN; a.tcell = -1; a.work = 0; }
        else goHome(a);
        break;
      }
      chooseMove(a, 0, 0, a.dropX, ground[a.dropX] - 1);
      break;
    }

    case DEFEND: {                            // soldier: run the spider down
      const sp = nearestSpider(a);
      if (!sp || alarm <= 0) { goHome(a); return; }
      const spInside = grid[sp.y * W + sp.x] === TUNNEL;
      if (inside && !spInside) { if (exitMap.d[i] > 0 && descend(a, exitMap)) break; }
      else if (inside && spInside && descend(a, spiderMap)) break;
      chooseMove(a, 0, 0, sp.x, sp.y, 1);
      break;
    }

    case FETCH: {                             // go to an egg that needs carrying and pick it up
      if (--a.timer <= 0 || !inside) { goHome(a); return; }
      const e = eggs.find(e => e.st === E_LOOSE && Math.abs(e.x - a.x) <= 1 && Math.abs(e.y - a.y) <= 1);
      if (e) {
        const slot = slotTaken.indexOf(0);
        if (slot < 0) { goHome(a); return; }                     // the nursery is full
        slotTaken[slot] = 1; e.slot = slot; e.st = E_CARRIED; a.egg = e; a.state = CARRYEGG; a.timer = 20 * MIN;
        return;
      }
      if (!eggs.some(e => e.st === E_LOOSE) || !descend(a, eggMap)) goHome(a);
      break;
    }

    case CARRYEGG: {                          // carry it to the nursery and set it down in its place
      const e = a.egg;
      if (!e) { goHome(a); return; }
      e.x = a.x; e.y = a.y;
      if (--a.timer <= 0) { dropEgg(a); goHome(a); return; }
      if (nurserySet[i]) {
        const sc = nurseryCells[e.slot], sx = sc % W, sy = (sc / W) | 0;
        if (Math.abs(a.x - sx) <= 1 && Math.abs(a.y - sy) <= 1) {
          e.x = sx; e.y = sy; e.st = E_INCUB; a.egg = null; goHome(a); return;
        }
        chooseMove(a, 0, 0, sx, sy);
      } else if (!descend(a, nurseMap)) { dropEgg(a); goHome(a); }
      break;
    }
  }
}

// carrier died, gave up or got lost: the egg lies loose where it is
function dropEgg(a) {
  const e = a.egg; if (!e) return;
  if (e.slot >= 0) slotTaken[e.slot] = 0;
  e.slot = -1; e.st = E_LOOSE; a.egg = null;
}

// ───────────────────────── what the colony has seen ─────────────────────────
// Above ground an ant lights a tall strip: the ground at its feet and all of the sky over it.
// Underground it lights the open tunnel cells nearby plus a rim of sand around each of them.
const RIM = 4;
const rimDone = new Uint8Array(N);    // tunnel cells whose rim has been marked explored
const stamped = new Uint32Array(N);   // which tunnel cells already lit their rim this pass
let pass = 0;                         // bumped once per batch of reveals
let vis = null;                       // set by the page: the cells lit right now (the tools leave it out)
function revealAt(x0, y0, half, setVis) {
  if (grid[y0 * W + x0] !== TUNNEL) { revealStrip(x0, half, setVis); return; }
  const r = 9, r2 = r * r + 1;
  const ya = Math.max(0, y0 - r), yb = Math.min(H - 1, y0 + r), xa = Math.max(0, x0 - r), xb = Math.min(W - 1, x0 + r);
  for (let y = ya; y <= yb; y++) {
    const dy2 = (y - y0) * (y - y0);
    for (let x = xa; x <= xb; x++) {
      if ((x - x0) * (x - x0) + dy2 > r2) continue;
      const c = y * W + x;
      if (grid[c] !== TUNNEL || stamped[c] === pass) continue;   // many ants share the same cells
      stamped[c] = pass;
      if (!setVis) { if (rimDone[c]) continue; rimDone[c] = 1; }   // its rim is already on the map for good
      const y1 = Math.max(0, y - RIM), y2 = Math.min(H - 1, y + RIM), x1 = Math.max(0, x - RIM), x2 = Math.min(W - 1, x + RIM);
      for (let yy = y1; yy <= y2; yy++)
        for (let xx = x1; xx <= x2; xx++) { explored[yy * W + xx] = 1; if (setVis) vis[yy * W + xx] = 1; }
    }
  }
}
function revealStrip(x0, half, setVis) {
  const xa = Math.max(0, x0 - half), xb = Math.min(W - 1, x0 + half);
  for (let x = xa; x <= xb; x++) {
    const bottom = Math.min(H - 1, surf[x] + 3);
    for (let c = x, y = 0; y <= bottom; y++, c += W) { explored[c] = 1; if (setVis) vis[c] = 1; }
  }
}
const sightOf = a => a.state === EXPLORE ? 26 : a.state === PATROL ? 18 : 12;   // a patrolling ant looks further
const revealAnt = (a, setVis) => revealAt(a.x, a.y, sightOf(a), setVis);

// ───────────────────────── spiders ─────────────────────────
function nearestSpider(a) {
  let best = null, bd = 1e9;
  for (const sp of spiders) { const d = (sp.x - a.x) ** 2 + (sp.y - a.y) ** 2; if (d < bd) { bd = d; best = sp; } }
  return best;
}
function spawnSpider() {
  const left = Math.random() < 0.5, x = left ? 4 : W - 5;
  spiders.push({ x, y: ground[x] - 1, px: -1, py: -1, dx: left ? 1 : -1, dy: 0, face: left ? 1 : -1, vert: false, vface: 1,
                 hp: SPIDER_HP, cd: 2 * SEC, life: SPIDER_LIFE, hit: 0 });
}
function spiderTick(sp) {
  if (--sp.life <= 0) return false;           // loses interest and wanders off
  if (sp.cd > 0) sp.cd--;
  if (sp.hit > 0) sp.hit--;
  let n = 0;                                   // the older workers sting hard; the others do a little
  for (const a of ants) if (Math.abs(a.x - sp.x) <= 4 && Math.abs(a.y - sp.y) <= 4) n += defender(a) ? 1 : 0.25;
  if (n && Math.random() < n * 0.2) { sp.hp--; sp.hit = 4; }
  if (sp.hp <= 0) { spidersKilled++; return false; }
  if (sp.cd <= 0) {                           // bite: the nearest ant within reach, or the queen
    let victim = null, bd = 26;
    for (const a of ants) { const d = (a.x - sp.x) ** 2 + (a.y - sp.y) ** 2; if (d < bd && a.life > 0) { bd = d; victim = a; } }
    if (victim) {
      sp.cd = 2 * SEC;
      if (!defender(victim) || Math.random() < 0.5) { victim.life = 0; victim.cause = 'spider'; lostToSpiders++; }
    } else if (QUEEN_MORTAL && !queen.dead && Math.abs(queen.x - sp.x) <= 8 && Math.abs(queen.y - sp.y) <= 4) {
      sp.cd = 2 * SEC; queen.hp -= 4;
      if (queen.hp <= 0) queen.dead = true;
    }
  }
  let near = null, bd = 1e9;
  for (const a of ants) { const d = (a.x - sp.x) ** 2 + (a.y - sp.y) ** 2; if (d < bd) { bd = d; near = a; } }
  const inTunnel = grid[sp.y * W + sp.x] === TUNNEL;
  if (near && bd <= (inTunnel ? 700 : 4400)) {                 // something to hunt in sight: go for it
    if (!(inTunnel && bd > 120 && descend(sp, nurseMap))) chooseMove(sp, 0, 0, near.x, near.y, 2);
  } else if (inTunnel) { if (!descend(sp, nurseMap)) chooseMove(sp, 0, 0, queen.x, queen.y, 2); }   // inside: toward the brood
  else chooseMove(sp, 0, 0, ENTR.x, ENTR.y, 2);                // outside: toward the entrance
  return true;
}

// ───────────────────────── flagged seed patches ─────────────────────────
const knownNear = (x, y) => marks.some(m => (m.x - x) ** 2 + (m.y - y) ** 2 <= 1089);   // one flag per patch
// A flag comes down once the patch has been cleared.
function marksTick() {
  for (let k = marks.length - 1; k >= 0; k--) {
    const m = marks[k];
    let any = false;
    for (let y = m.y - 6; y <= m.y + 6 && !any; y++) for (let x = m.x - 13; x <= m.x + 13; x++)
      if (inb(x, y) && food[y * W + x]) { any = true; break; }
    if (!any) marks.splice(k, 1);
  }
}

// ───────────────────────── queen and brood ─────────────────────────
function queenTick() {
  if (queen.hp < QUEEN_HP && !queen.dead) queen.hp += 0.006;
  if (!queen.dead && ++queen.age > queen.maxAge) queen.dead = true;      // old age, after many years
  for (let k = eggs.length - 1; k >= 0; k--) {          // brood grows wherever it lies, and comes out in the nursery
    const e = eggs[k];
    if (e.timer > 0) e.timer--;
    else if (e.st === E_INCUB && ants.length < MAXANTS) {
      slotTaken[e.slot] = 0; spawnAnt(fedFor(), e.x, e.y, e.caste); born++; eggs.splice(k, 1);
    }
  }
  if (queen.dead) return;                     // no more eggs
  const qi = queen.y * W + queen.x;
  if (tick % 8 === 0 && nurseMap.d[qi] > 0 && nurseMap.d[qi] < BIG) descend(queen, nurseMap);   // she walks down to the nursery
  if (queen.cd > 0) queen.cd--;
  else if (stored >= EGG_COST + RESERVE && eggs.length < nurseryCells.length && eggs.filter(e => e.st !== E_INCUB).length < MAX_LOOSE) {
    stored -= EGG_COST;
    eggs.push({ x: queen.x, y: queen.y, st: E_LOOSE, slot: -1, timer: HATCH, caste: newCaste() });
    queen.cd = layGap(ants.length) | 0;
  }
}

// ───────────────────────── sand ─────────────────────────
// Put one pellet on the disc near x. It rolls downhill, never plugs the entrance, and the disc
// stays shallow. The pellet keeps the colour of the depth it was dug from.
function dropPellet(x, shade) {
  for (let g = 0; g < 40; g++) {
    x = Math.max(2, Math.min(W - 3, x));
    if (Math.abs(x - ENTR.x) <= 5) { x += x >= ENTR.x ? 6 : -6; continue; }
    const y = ground[x];
    const canL = ground[x - 1] > y + 1 && Math.abs(x - 1 - ENTR.x) > 5, canR = ground[x + 1] > y + 1 && Math.abs(x + 1 - ENTR.x) > 5;
    if (canL || canR) { x += canL && canR ? (Math.random() < 0.5 ? -1 : 1) : (canL ? -1 : 1); continue; }
    if (y - 1 < surf[x] - MOUND_H) { x += x >= ENTR.x ? 3 : -3; continue; }           // deep enough here: further out
    const c = (y - 1) * W + x;
    grid[c] = SAND; band[c] = shade; tint[c] = (Math.random() * 4) | 0;
    if (food[c]) { food[c] = 0; lying--; }       // a seed lying there is buried
    ground[x] = y - 1; moundCells++;
    return;
  }
}

// ───────────────────────── seeds ─────────────────────────
let falling = [];                              // cells holding a seed that is still falling or rolling
function placeSeed(x, y, kind) {
  if (!inb(x, y)) return false;
  const c = y * W + x;
  if (grid[c] !== AIR || food[c]) return false;
  food[c] = kind; lying++; falling.push(c);
  return true;
}
// Now and then a small patch of seeds lands somewhere on the surface, as if dropped by a plant.
function seedTick() {
  if (Math.random() >= SEED_PATCHES_PER_DAY / DAY || lying >= SEED_MAX) return;
  const cx = 12 + ((Math.random() * (W - 24)) | 0);
  const n = SEED_PATCH_MIN + ((Math.random() * (SEED_PATCH_MAX - SEED_PATCH_MIN + 1)) | 0);
  const r = Math.random(), kind = r < SEED_MIX[SMALL] ? SMALL : r < SEED_MIX[SMALL] + SEED_MIX[MEDIUM] ? MEDIUM : LARGE;   // one plant, one kind
  for (let k = 0; k < n; k++) {
    const x = cx + ((Math.random() * 19 - 9) | 0);
    placeSeed(x, ground[x] - 1 - ((Math.random() * 4) | 0), kind);
  }
}
// Seeds fall and roll until they come to rest. Only the ones still moving are looked at.
function fallSeeds() {
  for (let k = falling.length - 1; k >= 0; k--) {
    const i = falling[k], v = food[i];
    let to = -1;
    if (v) {
      const b = i + W;
      if (grid[b] === AIR && !food[b]) to = b;
      else {
        const s = Math.random() < 0.5 ? -1 : 1;
        for (const t of [s, -s]) if (grid[b + t] === AIR && !food[b + t] && grid[i + t] === AIR && !food[i + t]) { to = b + t; break; }
      }
    }
    if (to >= 0) { food[to] = v; food[i] = 0; falling[k] = to; }
    else { falling[k] = falling[falling.length - 1]; falling.pop(); }       // at rest (or picked up)
  }
}
// In the store: workers open the small and medium seeds bit by bit, and a few large ones sprout.
// Either way the seed becomes meals and leaves a husk.
function storeTick() {
  // With its usual share of majors a colony opens seeds at the measured rate; with none, at half of it.
  // [research: majors raise the rate for small and medium seeds; the half is a guess]
  let majors = 0;
  for (const a of ants) majors += a.caste;
  const mill = 0.5 + 0.5 * Math.min(1, majors / Math.max(1, ants.length) / MAJOR_SHARE);
  for (let k = SMALL; k <= LARGE; k++) {
    if (!pile[k]) continue;
    opening[k] += pile[k] * (k === LARGE ? SPROUT_PER_DAY : OPEN_PER_DAY[k] * mill) / DAY * TPS;
    while (opening[k] >= 1 && pile[k] > 0) { opening[k]--; pile[k]--; stored += SEED_MEALS[k]; husks++; }
  }
}

// ───────────────────────── one tick ─────────────────────────
function simTick() {
  tick++;
  const second = tick % TPS === 0;
  if (second) {
    if (mapsDirty) computeMaps();
    if (plan.left > 0) findDigging();
    if (eggs.some(e => e.st === E_LOOSE)) bfs(eggMap, eggs.filter(e => e.st === E_LOOSE).map(e => e.y * W + e.x));
    marksTick();
  }
  for (const a of ants) {
    a.life--; a.age++;
    if (a.sleep > 0) a.sleep--; else stepAnt(a);
    if (a.age > a.maxAge) { a.life = 0; a.cause = 'old'; continue; }
    if (a.age < FORAGE_AGE || a.caste === MAJOR) continue;
    // Outside workers are lost at a steady daily rate, to fights, lizards and the heat. The loss is
    // decided here and happens the next time the ant is out on the surface, away from the entrance.
    if (a.doomed) {
      if (grid[a.y * W + a.x] === AIR && Math.abs(a.x - ENTR.x) > 30) { a.life = 0; a.cause = 'outside'; }
    } else if (second && Math.random() < OUTSIDE_DEATHS / DAY * TPS) a.doomed = true;
  }
  if (cfg.spiders && --spiderTimer <= 0) {
    if (spiders.length < spiderCap()) spawnSpider();
    spiderTimer = ((2 + Math.random() * 2) * DAY) | 0;          // one every two to four days
  }
  if (spiders.length) {
    for (let k = spiders.length - 1; k >= 0; k--) if (!spiderTick(spiders[k])) spiders.splice(k, 1);
    for (const sp of spiders) {                  // an ant that sees a spider raises the alarm for everyone
      for (const a of ants) if ((a.x - sp.x) ** 2 + (a.y - sp.y) ** 2 <= 700) { alarm = 100 * SEC; break; }
    }
    if (second) {                                // soldiers need a route to a spider that is inside
      const inside = spiders.find(sp => grid[sp.y * W + sp.x] === TUNNEL);
      if (inside) bfs(spiderMap, [inside.y * W + inside.x]);
    }
  }
  if (alarm > 0) alarm--;
  let n = 0;
  for (const a of ants) {
    if (a.life > 0) { ants[n++] = a; continue; }
    died++; dropEgg(a); plan.claims.delete(a.tcell);
    if (a.cause === 'outside') diedOutside++; else if (a.cause === 'old') diedOld++; else if (a.cause !== 'spider') diedHungry++;
    corpses.push({ x: a.x, y: a.y, t: tick });
  }
  ants.length = n;
  if (corpses.length && (tick - corpses[0].t > CORPSE_TIME || corpses.length > 300)) corpses.shift();
  queenTick();
  if (tick % 3 === 0) {                        // the map of what has been seen keeps up at any speed
    pass++;
    for (const a of ants) {                    // only where an ant has moved: any step below ground, a few cells above it
      const far = Math.abs(a.x - a.rx) + Math.abs(a.y - a.ry);
      if (far >= 6 || (far && grid[a.y * W + a.x] === TUNNEL)) { revealAt(a.x, a.y, sightOf(a), false); a.rx = a.x; a.ry = a.y; }
    }
    if (tick % 300 === 0) revealAt(queen.x, queen.y, 11, false);
  }
  seedTick();
  if (tick % TPS === 7) storeTick();           // once a second
  if (falling.length) fallSeeds();
}

// ───────────────────────── saving ─────────────────────────
// A colony as plain data: `meta` can be written as text, `arrays` are the big maps.
// Scent trails are left out: they fade in minutes anyway.
const SAVE_VERSION = 5;
function saveState() {
  const P = plan;
  return {
    meta: {
      version: SAVE_VERSION, savedAt: Date.now(), W, H,
      n: { tick, stored, delivered, born, died, diedOutside, diedOld, diedHungry, tunnelCells, moundCells, lying, husks, wasted,
           spiderTimer, spidersKilled, lostToSpiders, alarm },
      pile, dropped, opening, ENTR: { ...ENTR }, queen: { ...queen }, eggs, marks, spiders, corpses,
      nurseryCells, nurseryRooms, slotTaken,
      // an ant points at the egg it carries and the patch it is heading for; those are saved as positions in their lists
      ants: ants.map(a => ({ ...a, egg: a.egg ? eggs.indexOf(a.egg) : -1, mark: a.mark ? marks.indexOf(a.mark) : -1 })),
      plan: { workers: P.workers, depthCm: P.depthCm, areaCm2: P.areaCm2, order: P.order, start: P.start, first: P.first,
              chambers: P.chambers.map(ch => ({ z: ch.z, role: ch.role, cells: ch.cells, dug: ch.dug, niche: ch.niche })) },
      cfg: { spiders: cfg.spiders, fog: cfg.fog, show: cfg.show, paused: cfg.paused },
    },
    arrays: { grid: grid.slice(), food: food.slice(), tint: tint.slice(), band: band.slice(), explored: explored.slice(),
              surf: surf.slice(), ground: ground.slice() },
  };
}

// Put a saved colony back. Throws if the data is not a save this version can read.
function loadState(s) {
  const d = s && s.meta, A = s && s.arrays;
  if (!d || !A || d.version !== SAVE_VERSION || d.W !== W || d.H !== H) throw new Error('not a save this version can read');
  for (const [name, into] of [['grid', grid], ['food', food], ['tint', tint], ['band', band], ['explored', explored], ['surf', surf], ['ground', ground]]) {
    if (!A[name] || A[name].length !== into.length) throw new Error('a saved map has the wrong size');
  }
  grid.set(A.grid); food.set(A.food); tint.set(A.tint); band.set(A.band); explored.set(A.explored); surf.set(A.surf); ground.set(A.ground);
  ({ tick, stored, delivered, born, died, diedOutside, diedOld, diedHungry, tunnelCells, moundCells, lying, husks, wasted,
     spiderTimer, spidersKilled, lostToSpiders, alarm } = d.n);
  pile = d.pile; dropped = d.dropped; opening = d.opening;
  Object.assign(ENTR, d.ENTR); Object.assign(queen, d.queen);
  eggs = d.eggs; marks = d.marks; spiders = d.spiders; corpses = d.corpses;
  nurseryCells = d.nurseryCells; nurseryRooms = d.nurseryRooms; slotTaken = d.slotTaken;
  nurserySet.fill(0); for (const c of nurseryCells) nurserySet[c] = 1;
  const cellRoom = new Map();
  d.plan.chambers.forEach((ch, k) => { for (const c of ch.cells) cellRoom.set(c, k); });
  plan = { ...d.plan, cellRoom, claims: new Map(), frontier: new Set(), left: d.plan.order.reduce((n, c) => n + (grid[c] === SAND), 0) };
  ants = d.ants.map(o => {
    const a = { ...o, egg: o.egg >= 0 ? eggs[o.egg] : null, mark: o.mark >= 0 ? marks[o.mark] : null, tcell: -1, work: 0, rx: -1, ry: -1 };
    if (a.state === CARRYEGG && !a.egg) a.state = RETURN;        // caught half way through something: start again
    return a;
  });
  Object.assign(cfg, d.cfg);
  scentS[HOME].fill(0); scentS[FOOD].fill(0); rimDone.fill(0);
  for (const m of [exitMap, topMap, midMap, nurseMap, digMap, eggMap, spiderMap]) { m.d.fill(BIG); m.n = 0; }
  falling = [];
  for (let i = 0; i < (GROUND + 40) * W; i++) if (food[i]) falling.push(i);   // let every seed settle again
  computeMaps();
}

// "3 d 4 h", "5 h 12 min", "40 s": a length of colony time in words
function ageText(t) {
  const sec = Math.floor(t / SEC), d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60);
  return d ? `${d} d ${h} h` : h ? `${h} h ${m} min` : m ? `${m} min` : `${sec} s`;
}
