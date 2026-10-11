// Loads the simulation (js/sim.js) without a browser, for the tools in this folder.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const read = name => fs.readFileSync(path.join(__dirname, '..', 'js', name), 'utf8');
const SIM = new vm.Script(read('sim.js'), { filename: 'sim.js' });

// A fresh colony. `run(code)` runs code inside it and gives back the result.
function newColony(kind = 'queen') {
  const context = vm.createContext({ console, Math, Date, JSON, Map, Set, Object, Array,
    Uint8Array, Float32Array, Int16Array, Int32Array, Uint32Array });
  SIM.runInContext(context);
  vm.runInContext(`genWorld('${kind}')`, context);
  return { context, run: code => vm.runInContext(code, context) };
}
// The saving code (js/store.js), for checking that packing a save loses nothing.
function loadStore() {
  const context = vm.createContext({ console, JSON, Object, Promise, Blob, Response, CompressionStream, DecompressionStream,
    Uint8Array, Int16Array });
  vm.runInContext(read('store.js'), context);
  return code => vm.runInContext(code, context);
}
module.exports = { newColony, loadStore };
