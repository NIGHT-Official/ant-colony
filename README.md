# Ant Colony

A pixel ant colony sandbox, seen from the side as if the camera were in the earth. One file, no dependencies:
open `index.html` in a browser. (For the fullscreen button, serve it instead: `python3 -m http.server`.)

## Controls

| Input | Action |
|---|---|
| Left-drag (above ground) | Pour food. It lights the spot only while you hold the mouse. |
| `A` `D` / arrows (Shift = fast) | Scroll the map |
| Mouse wheel, right-drag, screen edges | Scroll the map |
| Minimap (top right) | Click or drag to jump |
| `F` fog · `P` pheromones · `Space` pause · `R` reset | Toggles |
| `G` fullscreen · `H` hide the bottom panel | View |
| `X` spiders on/off · `S` summon a spider | Enemies |

The sliders set speed and "dig drive" (how eagerly idle workers dig).

## How it works

- **Ants** are small state machines on a cell grid, steering by momentum and pheromone trails. They have lifespans, and eat from the nest's food store to extend them.
- **Queen** (4×2) lays an egg for 5 food. Workers carry eggs to the nursery, where a 10-second hatch timer starts.
- **Types**, picked by the colony for each egg based on a target mix:
  - **Scouts** (1×1) explore the surface and flag food piles with a trail.
  - **Workers** (2×1) forage flagged piles, carry eggs, and dig tunnels and rooms when idle. Dirt is hauled out into mounds at the entrances. Finished rooms add food storage.
  - **Soldiers** (3×1) guard the entrances and rush out against spiders.
- **Fog of war:** unexplored is black, explored is dim, and ants light up what they see. Underground, only tunnels and chambers show, plus a 2-cell rim.
- **Spiders** spawn at the map edges every few minutes and hunt slowly. They bite ants and the queen. If the queen dies, no more eggs.

## Tuning

Constants near the top of the `<script>`: lifespans and food (`LIFE_MAX`, `EAT_GAIN`, `EGG_COST`), digging (`CAP`, `RIM`), and spiders (`SPIDER_*`, `QUEEN_HP`, `QUEEN_MORTAL`). The soldier/scout/worker mix is in `targets()`. Main behaviour lives in `stepAnt()`, `queenTick()` and `spiderTick()`.

## Measuring

`node tools/measure.js` runs the simulation without a browser and reports how long colonies last when nobody feeds them
(10 colonies per scenario, one simulated hour each; `node tools/measure.js 20 120` for 20 colonies and two hours).
It needs Node.js and takes a few minutes.

First measurement, 2026-10-10 (20 colonies per scenario): left alone, every colony was gone in about 4 minutes. One pile
of 150 food at the start stretched that to about 11 to 14 minutes. None lasted an hour.
