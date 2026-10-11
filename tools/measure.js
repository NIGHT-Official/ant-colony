// Runs colonies without a browser and reports how they fare when left alone.
//
//   node tools/measure.js              2 colonies, 5 days of the colony's calendar each (about a minute)
//   node tools/measure.js 4 14         4 colonies, 14 simulated days each
//   node tools/measure.js 2 60 --colony    start from a young colony moving in, not from a lone queen
//   node tools/measure.js 2 5 --spiders   with spiders switched on
// A run stops by itself after 14 minutes and reports how far it got.
//
// Nobody pours food: each colony lives on the seeds that fall by themselves. Use it before
// and after a change to see whether the change helps. Random numbers are not seeded, so two
// runs give slightly different figures; look at the spread, not one number.
const { newColony } = require('./load.js');

const TRIALS = Number(process.argv[2]) || 2;
const DAYS = Number(process.argv[3]) || 5;
const SPIDERS = process.argv.includes('--spiders');
const KIND = process.argv.includes('--colony') ? 'colony' : 'queen';   // how each colony starts
// No run goes on longer than this many minutes; it stops early and says how far it got.
const CAP_MS = 14 * 60 * 1000, began = Date.now();
let ticksRun = 0, msRun = 0;

function run() {
  const c = newColony(KIND);
  if (SPIDERS) c.run('cfg.spiders = true');
  const HOUR = c.run('DAY / 24');        // an hour of the colony's calendar
  const hour = c.run(`(function () { for (let k = 0; k < ${HOUR}; k++) simTick();
    return [ants.length, stored, eggs.length, plan.left - 0, moundCells, born, died, diedOutside, diedHungry, diedOld, lostToSpiders,
            delivered, lying, pile[1], pile[2], pile[3], husks, wasted, storeCap(),
            ants.reduce((k, a) => k + (taskOf(a) === T_FORAGER), 0), eggs.filter(e => e.st !== E_INCUB).length, queen.dead, broodLost]; })`);
  const start = { ants: c.run('ants.length'), cells: c.run('plan.order.length'), depth: c.run('Math.round(plan.depthCm)'), toDig: c.run('plan.left') };
  const perDay = [];
  let s, dugAt = 0, hungryHours = 0, low = start.ants, stoppedAt = 0;
  const t0 = Date.now();
  for (let h = 1; h <= DAYS * 24; h++) {
    s = hour(); ticksRun += HOUR;
    if (!dugAt && s[3] === 0) dugAt = h;
    if (s[1] === 0 && s[0] > 0) hungryHours++;
    if (s[0] < low) low = s[0];
    if (h % 24 === 0) perDay.push(s[0]);
    if (s[0] === 0 && s[2] === 0 && (s[21] || h > 24 * 80)) break;   // nobody left (a lone queen is alone for her first weeks)
    if (Date.now() - began > CAP_MS) { stoppedAt = h; break; }
  }
  msRun += Date.now() - t0;
  return { start, s, dugAt, hungryHours, low, perDay, stoppedAt };
}

const rows = [];
for (let k = 0; k < TRIALS; k++) rows.push(run());
const list = f => rows.map(f).join(', ');
const S = k => list(r => r.s[k]);
console.log(`\n== ${KIND === 'queen' ? 'From a lone queen' : 'A young colony moving in'}, left alone${SPIDERS ? ', spiders on' : ''} (${TRIALS} colonies, ${DAYS} days each)`);
for (const r of rows) if (r.stoppedAt) console.log(`   STOPPED EARLY at the 14-minute cap: a colony reached day ${(r.stoppedAt / 24).toFixed(1)} of ${DAYS}`);
console.log(`   the nest: planned ${rows[0].start.depth} cm deep, ${rows[0].start.cells} cells, ${rows[0].start.toDig} of them to dig`);
console.log(`   finished digging after: ${list(r => r.dugAt ? (r.dugAt / 24).toFixed(1) + ' days' : 'not yet (' + r.s[3] + ' left)')}; sand on the disc: ${S(4)}`);
console.log(`   ants: started with ${rows[0].start.ants}; at the end ${S(0)}; fewest at any time ${list(r => r.low)}; foragers ${S(19)}`);
console.log(`   brood ${S(2)} (waiting to be carried: ${S(20)}); born ${S(5)}; larvae starved ${S(22)}`);
console.log(`   died ${S(6)}: outside ${S(7)}, hunger ${S(8)}, old age ${S(9)}, spiders ${S(10)}; queen dead: ${S(21)}`);
console.log(`   seeds carried home: ${S(11)} (${(rows.reduce((n, r) => n + r.s[11], 0) / rows.length / DAYS).toFixed(1)} a day); lying outside ${S(12)}`);
console.log(`   at the end: meals ready ${S(1)}; in the store small ${S(13)}, medium ${S(14)}, large ${S(15)}; room for ${S(18)}`);
console.log(`   husks ${S(16)}; large seeds thrown out for lack of room ${S(17)}; hours with ants and nothing ready to eat ${list(r => r.hungryHours)}`);
console.log(`   ants day by day, first colony: ${rows[0].perDay.join(' ')}`);
console.log(`\nSpeed: ${Math.round(ticksRun / (msRun / 1000)).toLocaleString('en')} ticks a second, ` +
  `${Math.round(ticksRun / (msRun / 1000) / 19).toLocaleString('en')} times real time.`);
