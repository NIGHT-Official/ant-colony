// Runs colonies without a browser and reports how they fare when left alone.
//
//   node tools/measure.js              2 colonies, 5 simulated days each (about 3 minutes)
//   node tools/measure.js 4 14         4 colonies, 14 simulated days each
//   node tools/measure.js 2 5 --spiders   with spiders switched on
//
// Nobody pours food: each colony lives on the seeds that fall by themselves. Use it before
// and after a change to see whether the change helps. Random numbers are not seeded, so two
// runs give slightly different figures; look at the spread, not one number.
const { newColony } = require('./load.js');

const TRIALS = Number(process.argv[2]) || 2;
const DAYS = Number(process.argv[3]) || 5;
const SPIDERS = process.argv.includes('--spiders');
let ticksRun = 0, msRun = 0;

function run() {
  const c = newColony();
  if (SPIDERS) c.run('cfg.spiders = true');
  const HOUR = c.run('HOUR');
  const hour = c.run(`(function () { for (let k = 0; k < ${HOUR}; k++) simTick();
    return [ants.length, stored, eggs.length, plan.left, moundCells, born, died, diedOutside, diedHungry, diedOld, lostToSpiders,
            delivered, lying, pile[1], pile[2], pile[3], husks, wasted, storeCells.length,
            ants.reduce((k, a) => k + (a.age >= FORAGE_AGE), 0), eggs.filter(e => e.st !== E_INCUB).length, queen.dead]; })`);
  const start = { ants: c.run('ants.length'), cells: c.run('plan.order.length'), depth: c.run('Math.round(plan.depthCm)'), toDig: c.run('plan.left') };
  const perDay = [];
  let s, dugAt = 0, hungryHours = 0, low = start.ants;
  const t0 = Date.now();
  for (let h = 1; h <= DAYS * 24; h++) {
    s = hour(); ticksRun += HOUR;
    if (!dugAt && s[3] === 0) dugAt = h;
    if (s[1] === 0) hungryHours++;
    if (s[0] < low) low = s[0];
    if (h % 24 === 0) perDay.push(s[0]);
    if (s[0] === 0 && s[2] === 0) break;
  }
  msRun += Date.now() - t0;
  return { start, s, dugAt, hungryHours, low, perDay };
}

const rows = [];
for (let k = 0; k < TRIALS; k++) rows.push(run());
const list = f => rows.map(f).join(', ');
const S = k => list(r => r.s[k]);
console.log(`\n== Left alone${SPIDERS ? ', spiders on' : ''} (${TRIALS} colonies, ${DAYS} days each)`);
console.log(`   the nest: planned ${rows[0].start.depth} cm deep, ${rows[0].start.cells} cells, ${rows[0].start.toDig} of them to dig`);
console.log(`   finished digging after: ${list(r => r.dugAt ? (r.dugAt / 24).toFixed(1) + ' days' : 'not yet (' + r.s[3] + ' left)')}; sand on the disc: ${S(4)}`);
console.log(`   ants: started with ${rows[0].start.ants}; at the end ${S(0)}; fewest at any time ${list(r => r.low)}; old enough to work outside ${S(19)}`);
console.log(`   brood ${S(2)} (waiting to be carried: ${S(20)}); born ${S(5)}`);
console.log(`   died ${S(6)}: outside ${S(7)}, hunger ${S(8)}, old age ${S(9)}, spiders ${S(10)}; queen dead: ${S(21)}`);
console.log(`   seeds carried home: ${S(11)} (${(rows.reduce((n, r) => n + r.s[11], 0) / rows.length / DAYS).toFixed(1)} a day); lying outside ${S(12)}`);
console.log(`   store at the end: meals ready ${S(1)}; unopened small ${S(13)}, medium ${S(14)}, large ${S(15)}; room for ${S(18)}`);
console.log(`   husks ${S(16)}; large seeds thrown out for lack of room ${S(17)}; hours with nothing ready to eat ${list(r => r.hungryHours)}`);
console.log(`   ants day by day, first colony: ${rows[0].perDay.join(' ')}`);
console.log(`\nSpeed: ${Math.round(ticksRun / (msRun / 1000)).toLocaleString('en')} ticks a second, ` +
  `${Math.round(ticksRun / (msRun / 1000) / 19).toLocaleString('en')} times real time.`);
