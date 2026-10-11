// Checks that a colony can be saved and put back exactly, and carries on afterwards.
//
//   node tools/test-save.js        (about a minute)
//
// It saves colonies at several moments of their lives, packs each save the way the page does
// (compressed), unpacks it into a fresh colony, compares the two, and runs the loaded colony on.
const { newColony, loadStore } = require('./load.js');

const store = loadStore();
let failures = 0;
const check = (ok, what) => { if (!ok) { failures++; console.log('  FAILED: ' + what); } };

// What must be the same before and after: the maps, the counts, the nest plan and every ant.
const PICTURE = `JSON.stringify({
  maps: [grid, food, tint, band, explored, surf, ground].map(m => { let h = 0; for (let i = 0; i < m.length; i++) h = (h * 31 + m[i]) | 0; return h; }),
  n: [tick, stored, delivered, born, died, diedOutside, diedOld, diedHungry, tunnelCells, moundCells, lying, husks, wasted, spidersKilled, lostToSpiders],
  pile, dropped, opening, queen, ENTR, eggs, spiders, marks, corpses, nurseryCells, nurseryRooms, slotTaken, storeCells, top: topCells.length,
  plan: [plan.order.length, plan.left, plan.first, plan.chambers.map(ch => [ch.role, ch.cells.length, ch.dug.length])],
  ants: ants.map(a => [a.x, a.y, a.caste, a.state, a.life, a.age, a.maxAge, a.doomed, a.carry, a.load, a.shade, a.dig,
                       a.egg ? eggs.indexOf(a.egg) : -1, a.mark ? marks.indexOf(a.mark) : -1]),
  cfg: [cfg.spiders, cfg.fog, cfg.show, cfg.paused],
})`;

(async () => {
  const HOUR = newColony().run('HOUR');
  for (const [name, hours, setup] of [
    ['a new colony', 0, ''],
    ['3 hours in, digging under way', 3, ''],
    ['a day in, with a spider about', 24, 'cfg.spiders = true; spawnSpider();'],
    ['two days in', 48, ''],
  ]) {
    const first = newColony();
    if (setup) first.run(setup);
    first.run(`for (let k = 0; k < ${hours * HOUR}; k++) simTick();`);
    first.context.__state = first.run('saveState()');
    const record = await store('packSave')(first.context.__state);
    const size = store('packedSize')(record);
    const raw = Object.values(first.context.__state.arrays).reduce((n, a) => n + a.byteLength, 0);
    console.log(`${name}: ${first.run('ants.length')} ants, ${first.run('eggs.length')} brood, ` +
      `nest ${first.run('plan.order.length - plan.left')}/${first.run('plan.order.length')} dug; ` +
      `save ${(size / 1024).toFixed(0)} KB (the maps alone are ${(raw / 1048576).toFixed(1)} MB before compression)`);
    const second = newColony();
    let error = null;
    try { second.context.__state = await store('unpackSave')(record); second.run('loadState(__state)'); } catch (e) { error = e; }
    check(!error, 'loading threw: ' + (error && error.message));
    if (error) continue;
    check(first.run(PICTURE) === second.run(PICTURE), 'the loaded colony is not the same as the saved one');
    check(size < 5 * 1024 * 1024, 'the save is larger than 5 MB');
    try { second.run(`for (let k = 0; k < ${6 * HOUR}; k++) simTick();`); }
    catch (e) { check(false, 'the loaded colony broke when it carried on: ' + e.message); }
    check(second.run('ants.length') > 0, 'the loaded colony died within 6 hours');
    check(second.run('plan.left') <= first.run('plan.left'), 'digging went backwards after loading');
  }

  // Rubbish, or a save from another version, must be refused, not half loaded.
  const c = newColony();
  for (const bad of ['null', '({})', '({ meta: { version: 99 }, arrays: {} })', '({ meta: { version: 5, W: 10, H: 10 }, arrays: {} })',
                     '({ meta: { version: 5, W, H }, arrays: { grid: new Uint8Array(5) } })']) {
    let refused = false;
    try { c.run(`loadState(${bad})`); } catch (e) { refused = true; }
    check(refused, 'accepted a bad save: ' + bad);
  }
  check(c.run('ants.length') > 0 && c.run('tunnelCells') > 0, 'a refused save damaged the colony');

  console.log(failures ? `\n${failures} check(s) failed` : '\nAll save checks passed');
  process.exit(failures ? 1 : 0);
})();
