// Checks that a founding queen ends up sealed inside her chamber, not shut out of her own nest.
//
//   node tools/test-founding.js        (a few seconds)
const { newColony } = require('./load.js');
let bad = 0;
for (let n = 0; n < 6; n++) {
  const c = newColony();
  c.run('for (let k = 0; k < 4 * DAY; k++) simTick();');
  const r = JSON.parse(c.run('JSON.stringify({stage: queen.stage, sealed, inside: grid[queen.y * W + queen.x] === TUNNEL, inRoom: nurserySet[queen.y * W + queen.x] === 1, left: plan.left})'));
  if (!(r.stage === 'brood' && r.sealed && r.inside && r.inRoom)) bad++;
  console.log(JSON.stringify(r));
}
console.log(bad ? bad + ' queens were NOT sealed in their chamber' : 'All six queens sealed themselves inside their chamber');
process.exit(bad ? 1 : 0);
