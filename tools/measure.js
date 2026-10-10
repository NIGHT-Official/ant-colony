// Runs the Ant Colony simulation without a browser and measures how colonies fare when left alone.
//
//   node tools/measure.js              4 colonies per scenario, 14 simulated days each
//   node tools/measure.js 8 30         8 colonies per scenario, 30 simulated days each
//   node tools/measure.js 4 14 --spiders   also measure with spiders switched on
//
// It reads the <script> out of index.html, so it always measures the game as it is now.
// Nobody pours food: each colony lives on the seeds that fall by themselves. Use it before
// and after a change to see whether the change helps. Random numbers are not seeded, so two
// runs give slightly different figures; look at the spread, not one number.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const TRIALS = Number(process.argv[2]) || 4;
const DAYS = Number(process.argv[3]) || 14;

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
    document: { addEventListener() {}, hidden: false, querySelectorAll: () => [], getElementById: () => fake(), createElement: () => fake(), body: fake(), documentElement: fake() },
    window: { devicePixelRatio: 1 }, localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    addEventListener() {}, requestAnimationFrame() {}, confirm: () => true,
    innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
    performance: { now: () => 0 }, console, Math, Date, JSON, btoa, atob,
    Uint8Array, Float32Array, Int16Array, Int32Array, Uint32Array, Uint8ClampedArray, Map, Set,
  });
  vm.runInContext(script, context);
  return context;
}
exports.newColony = newColony;
if (require.main !== module) return;       // used as a helper by the other tools

let ticksRun = 0, msRun = 0;

function run({ spiders }) {
  const c = newColony();
  vm.runInContext(`cfg.spiders = ${spiders};`, c);
  const DAY = vm.runInContext('DAY', c);
  const step = vm.runInContext(`(function (n) { for (let k = 0; k < n; k++) simTick();
    let lying = 0; for (let i = 0; i < 100 * W; i++) lying += food[i];
    return [ants.length, stored, eggs.length, queen.dead, tunnelCells, born, died, lostToSpiders, delivered, lying, chambers,
      diedOutside, diedHungry, diedOld, ants.reduce((k, a) => k + (a.age >= FORAGE_AGE), 0)]; })`, c);
  const start = vm.runInContext('ants.length', c);
  const perDay = [];
  let s, low = start, emptyDays = 0;
  const t0 = Date.now();
  for (let day = 1; day <= DAYS; day++) {
    for (let part = 0; part < 24; part++) {
      s = step(DAY / 24); ticksRun += DAY / 24;
      if (s[0] < low) low = s[0];
      if (s[1] === 0) emptyDays += 1 / 24;
    }
    perDay.push(s[0]);
    if (s[0] === 0 && s[2] === 0) break;       // no ants and no brood: the colony is over
  }
  msRun += Date.now() - t0;
  return { days: perDay.length, start, end: s[0], low, emptyDays, stored: s[1], brood: s[2], queenDead: s[3], tunnels: s[4],
           born: s[5], died: s[6], toSpiders: s[7], delivered: s[8], lying: s[9], rooms: s[10],
           outside: s[11], hungry: s[12], old: s[13], grown: s[14], perDay };
}

function report(name, options) {
  const rows = [];
  for (let k = 0; k < TRIALS; k++) rows.push(run(options));
  const mean = key => rows.reduce((n, r) => n + r[key], 0) / rows.length;
  const list = key => rows.map(r => Math.round(r[key])).join(', ');
  console.log(`\n== ${name} (${TRIALS} colonies, ${DAYS} days each)`);
  console.log(`   alive at the end: ${rows.filter(r => r.end > 0).length} of ${TRIALS}`);
  console.log(`   ants: started with ${rows[0].start}; at the end ${list('end')}; fewest at any time ${list('low')}`);
  console.log(`   brood growing at the end: ${list('brood')}; born ${list('born')}; of the ants at the end, old enough to work outside: ${list('grown')}`);
  console.log(`   died ${list('died')}: outside ${list('outside')}, hunger ${list('hungry')}, old age ${list('old')}, spiders ${list('toSpiders')}`);
  console.log(`   seeds carried home: ${list('delivered')} (${(mean('delivered') / DAYS).toFixed(1)} a day); in store at the end ${list('stored')}; lying outside ${list('lying')}`);
  console.log(`   days with an empty store: ${rows.map(r => r.emptyDays.toFixed(1)).join(', ')}`);
  console.log(`   tunnel cells at the end: ${list('tunnels')}; rooms dug: ${list('rooms')}; queen killed in ${rows.filter(r => r.queenDead).length} of ${TRIALS}`);
  console.log(`   ants day by day, first colony: ${rows[0].perDay.join(' ')}`);
}

report('Left alone, spiders off (the default)', { spiders: false });
if (process.argv.includes('--spiders')) report('Left alone, spiders on', { spiders: true });
console.log(`\nSpeed of this run: ${Math.round(ticksRun / (msRun / 1000)).toLocaleString('en')} ticks a second, ` +
  `which is ${Math.round(ticksRun / (msRun / 1000) / 9).toLocaleString('en')} times real time.`);
