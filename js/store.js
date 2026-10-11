'use strict';
// Ant Colony: keeping the colony between visits.
//
// The colony is stored in the browser's own database (IndexedDB) on this computer. The big
// maps are compressed first: a world that is mostly untouched sand shrinks to a small fraction
// of its size.

const DB_NAME = 'ant-colony', DB_STORE = 'saves', DB_KEY = 'colony';

async function squeeze(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function unsqueeze(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Turn what saveState() gives into something small to store, and back.
async function packSave(state) {
  const arrays = {};
  for (const [name, a] of Object.entries(state.arrays)) {
    const raw = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    arrays[name] = { kind: a.constructor.name, data: await squeeze(raw) };
  }
  return { meta: JSON.stringify(state.meta), arrays };
}
async function unpackSave(record) {
  const KINDS = { Uint8Array, Int16Array };
  const arrays = {};
  for (const [name, a] of Object.entries(record.arrays)) {
    const raw = await unsqueeze(a.data), Kind = KINDS[a.kind];
    if (!Kind) throw new Error('a saved map is of an unknown kind');
    arrays[name] = new Kind(raw.buffer, raw.byteOffset, raw.byteLength / Kind.BYTES_PER_ELEMENT);
  }
  return { meta: JSON.parse(record.meta), arrays };
}
const packedSize = record => record.meta.length + Object.values(record.arrays).reduce((n, a) => n + a.data.length, 0);

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function dbDo(mode, action) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, mode), request = action(tx.objectStore(DB_STORE));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}
const putRecord = record => dbDo('readwrite', store => store.put(record, DB_KEY));
const getRecord = () => dbDo('readonly', store => store.get(DB_KEY));
const deleteRecord = () => dbDo('readwrite', store => store.delete(DB_KEY));
