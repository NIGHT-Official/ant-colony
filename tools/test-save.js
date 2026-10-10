// Checks that a colony can be saved and put back exactly, and carries on afterwards.
//
//   node tools/test-save.js
//
// It saves colonies at several moments of their lives, loads each save into a fresh page,
// compares the two, and then runs the loaded colony on to see that nothing breaks.
const vm = require('vm');
const { newColony } = require('./measure.js');

const run = (c, code) => vm.runInContext(code, c);
const HOUR = run(newColony(), 'HOUR');
let failures = 0;
const check = (ok, what) => { if (!ok) { failures++; console.log('  FAILED: ' + what); } };

// What must be the same before and after: the maps, the counts, and every ant.
const PICTURE = `JSON.stringify({
  maps: [grid, food, tint, explored].map(m => { let h = 0; for (let i = 0; i < m.length; i++) h = (h * 31 + m[i]) | 0; return h; }),
  surf: Array.from(surf).join(','),
  n: [stored, delivered, tunnelCells, tick, born, died, moundCells, chambers, spidersKilled, lostToSpiders],
  queen, NEST, QHOME, ENTR, storeCells, nurseryCells, slots: Array.from(slotTaken),
  eggs, spiders, marks: marks.map(m => [m.x, m.y, m.path.length]),
  ants: ants.map(a => [a.x, a.y, a.type, a.life, a.carry, a.load, a.egg ? eggs.indexOf(a.egg) : -1, a.mark ? marks.indexOf(a.mark) : -1]),
  project: project && [project.cells.length, project.left, project.first, project.tip],
  cfg: [cfg.spiders, cfg.fog, cfg.dig, cfg.show, cfg.paused],
})`;

for (const [name, hours, setup] of [
  ['a new colony', 0, ''],
  ['after 6 hours', 6, ''],
  ['after 2 days, with a spider about', 48, 'cfg.spiders = true; spawnSpider();'],
  ['after 3 days, with a room being dug', 72, 'cfg.dig = 1;'],
]) {
  const first = newColony();
  if (setup) run(first, setup);
  run(first, `for (let k = 0; k < ${hours * HOUR}; k++) simTick();`);
  const text = run(first, 'JSON.stringify(saveState())');
  const second = newColony();
  let error = null;
  try { run(second, `loadState(JSON.parse(${JSON.stringify(text)}))`); } catch (e) { error = e; }
  console.log(`${name}: ${run(first, 'ants.length')} ants, ${run(first, 'eggs.length')} brood, save is ${(text.length / 1024).toFixed(0)} KB`);
  check(!error, 'loading threw: ' + (error && error.message));
  if (error) continue;
  check(run(first, PICTURE) === run(second, PICTURE), 'the loaded colony is not the same as the saved one');
  check(text.length < 4 * 1024 * 1024, 'the save is too big for a browser to keep');
  try { run(second, `for (let k = 0; k < ${12 * HOUR}; k++) simTick();`); }
  catch (e) { check(false, 'the loaded colony broke when it carried on: ' + e.message); }
  check(run(second, 'ants.length') > 0, 'the loaded colony died within 12 hours');
}

// A save from another version, or rubbish, must be refused, not half loaded.
const c = newColony();
for (const bad of ['null', '{}', '{"version":99}', '{"version":1,"W":10,"H":10}']) {
  let refused = false;
  try { run(c, `loadState(${bad})`); } catch (e) { refused = true; }
  check(refused, 'accepted a bad save: ' + bad);
}
check(run(c, 'ants.length') > 0, 'a refused save damaged the colony');

console.log(failures ? `\n${failures} check(s) failed` : '\nAll save checks passed');
process.exit(failures ? 1 : 0);
