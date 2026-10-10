// Runs the Ant Colony simulation without a browser and measures how long a colony lasts.
//
//   node tools/measure.js              10 colonies per scenario, one simulated hour each
//   node tools/measure.js 20 120       20 colonies per scenario, two simulated hours each
//
// It reads the <script> out of index.html, so it always measures the game as it is now.
// Nobody pours food: each colony is left alone. Use it before and after a change to see
// whether the change helps a colony survive. Random numbers are not seeded, so two runs
// give slightly different figures; look at the spread, not one number.
const fs = require('fs');
const vm = require('vm');

const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const TRIALS = Number(process.argv[2]) || 10;
const MINUTES = Number(process.argv[3]) || 60;
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));

// A stand-in for anything the page touches that only exists in a browser.
function fake() {
  const f = function () { return fake(); };
  return new Proxy(f, {
    get(_t, key) {
      if (key === Symbol.toPrimitive) return () => 0;
      if (key === 'data') return new Uint8ClampedArray(640 * 180 * 4);
      if (key === 'width' || key === 'height' || key === 'length') return 0;
      return fake();
    },
    set() { return true; },
  });
}

function newColony() {
  const context = vm.createContext({
    document: { querySelectorAll: () => [], getElementById: () => fake(), createElement: () => fake(), body: fake(), documentElement: fake() },
    window: { devicePixelRatio: 1 },
    addEventListener() {}, requestAnimationFrame() {},
    innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
    performance: { now: () => 0 }, console, Math,
    Uint8Array, Float32Array, Int16Array, Int32Array, Uint32Array, Uint8ClampedArray, Map, Set,
  });
  vm.runInContext(script, context);
  return context;
}

const TICKS_PER_MINUTE = 30 * 60;   // the game runs 30 ticks a second at 1x speed
const LIMIT = MINUTES * TICKS_PER_MINUTE;

function run({ spiders, pour }) {
  const c = newColony();
  vm.runInContext(`cfg.spiders = ${spiders};`, c);
  if (pour) {
    // One generous pile of food dropped on the surface 60 cells right of the main entrance, at the start.
    vm.runInContext(`{ const px = NEST.x + 60; let n = 0;
      for (let y = surf[px] - 12; y < surf[px]; y++) for (let x = px - 12; x <= px + 12; x++)
        if (grid[y * W + x] === AIR && n < ${pour}) { food[y * W + x] = 1; n++; } }`, c);
  }
  let peak = 0, peakAt = 0, firstStarve = 0;
  const step = vm.runInContext(`(function (n) { for (let k = 0; k < n; k++) simTick();
    return [ants.length, stored, eggs.length, queen.dead, tunnelCells, born, died, lostToSpiders, delivered]; })`, c);
  let t = 0, s;
  while (t < LIMIT) {
    s = step(30); t += 30;
    if (s[0] > peak) { peak = s[0]; peakAt = t; }
    if (!firstStarve && s[1] === 0) firstStarve = t;
    if (s[0] === 0 && s[2] === 0) break;       // no ants and no eggs: the colony is over
  }
  return { minutes: t / TICKS_PER_MINUTE, alive: s[0], survived: t >= LIMIT, peak, peakAtMin: peakAt / TICKS_PER_MINUTE,
           storeEmptyMin: firstStarve / TICKS_PER_MINUTE, queenDead: s[3], tunnels: s[4], born: s[5], died: s[6],
           toSpiders: s[7], delivered: s[8] };
}

function report(name, options, trials) {
  const rows = [];
  for (let k = 0; k < trials; k++) rows.push(run(options));
  const sorted = rows.map(r => r.minutes).sort((a, b) => a - b);
  const mean = key => (rows.reduce((n, r) => n + r[key], 0) / rows.length);
  console.log(`\n== ${name} (${trials} colonies)`);
  console.log(`   colony gone after: shortest ${sorted[0].toFixed(1)} min, middle ${sorted[trials >> 1].toFixed(1)} min, longest ${sorted[trials - 1].toFixed(1)} min`);
  console.log(`   still alive after ${MINUTES} min: ${rows.filter(r => r.survived).length} of ${trials}`);
  console.log(`   food store first empty: ${mean('storeEmptyMin').toFixed(1)} min (average)`);
  console.log(`   most ants at once: ${mean('peak').toFixed(1)} (average), reached at ${mean('peakAtMin').toFixed(1)} min`);
  console.log(`   born ${mean('born').toFixed(1)}, died ${mean('died').toFixed(1)}, of which to spiders ${mean('toSpiders').toFixed(1)}, food carried home ${mean('delivered').toFixed(1)}`);
  console.log(`   queen killed in ${rows.filter(r => r.queenDead).length} of ${trials}; tunnel cells at the end ${mean('tunnels').toFixed(0)}`);
}

const T = TRIALS;
report('Left alone, spiders on (the default)', { spiders: true, pour: 0 }, T);
report('Left alone, spiders off', { spiders: false, pour: 0 }, T);
report('One pile of 150 food at the start, then left alone, spiders off', { spiders: false, pour: 150 }, T);
report('One pile of 150 food at the start, then left alone, spiders on', { spiders: true, pour: 150 }, T);
