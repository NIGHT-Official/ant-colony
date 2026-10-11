# Ant Colony

A digital ant colony that lives on your computer, seen from the side as if the camera were in the earth.
It is modelled on the Florida harvester ant (*Pogonomyrmex badius*) and runs in **real time**: one second on
the clock is one second for the ants. One file, no dependencies: open `index.html` in a browser.
(For the fullscreen button, serve it instead: `python -m http.server`.)

The colony is saved in the browser by itself. Close the page and come back later, and it has lived through
the time you were away (up to three days; longer absences are cut short and the page says so).

## Controls

| Input | Action |
|---|---|
| `T` | Time: real time, fast (1 second = 1 minute), very fast (1 second = 10 minutes) |
| Left-drag (above ground) | Pour extra food. Seeds also fall by themselves. |
| `A` `D` / arrows (Shift = fast) | Scroll the map |
| Mouse wheel, right-drag, screen edges | Scroll the map |
| Minimap (top right) | Click or drag to jump |
| `F` fog · `P` scent trails · `Space` pause | Toggles |
| `R` | Start a new colony (asks first: the old one is gone for good) |
| `G` fullscreen · `H` hide the bottom panel | View |
| `X` spiders on/off · `S` summon a spider | Enemies (off unless you switch them on) |

The "dig drive" slider sets how eagerly idle workers dig. If a fast-forward is more than the computer can
do, the panel shows the rate it is really reaching.

## How it works

- **Scale.** One cell is 3.5 mm, so a worker is two cells long. An ant walks about 3 cm a second.
- **Ants** are small state machines on a cell grid, steering by momentum and scent trails. Each can go a
  number of days without eating, and eats a seed from the nest's store when it gets low.
- **Age.** A new adult is pale and stays in the nest, nursing and digging. At 43 days it starts working
  outside. Outside workers are lost at 3.35% a day, out on the surface; a worker that escapes that dies of
  old age after a little over a year. The dead lie where they fell for a day. The queen lives 15 to 30 years.
- **The start** is a young colony met in summer: 30 workers of mixed ages, 20 brood of every age, 20 seeds.
- **Seeds** fall onto the surface in small patches, about one patch an hour, each patch one kind. A forager
  carries one seed home per trip and never turns one down for its size. There are three kinds, by width:
  - **Small** (straw-coloured, 1 mm or less, like panicgrass): workers open about a quarter of the pile a day. One meal each.
  - **Medium** (amber, 1 to 1.4 mm): opened more slowly. Two meals each.
  - **Large** (dark red-brown, 1.4 mm and up, like croton): cannot be opened. They sit in the store until they
    sprout, then are eaten at once. Five meals each. They may fill up to 70% of the store.
  The store is drawn from the floor up: large, medium, small, then the pale opened food. Every seed used leaves a husk.
- **Queen** lays eggs when the store can afford them (5 seeds each), faster as the colony grows.
  Workers carry eggs to the nursery, where they take **38 days** to become adults.
- **Types**, picked by the colony for each egg based on a target mix:
  - **Scouts** explore the surface and flag seed patches with a trail.
  - **Workers** forage flagged patches, carry eggs, and dig tunnels and rooms when idle. A cell takes about
    ten minutes of work. Sand is hauled out into mounds at the entrances. Finished rooms add food storage.
  - **Soldiers** guard the entrances and rush out against spiders.
- **Fog of war:** unexplored is black, explored is dim, and ants light up what they see. Above ground an
  ant sees a tall strip: the ground at its feet and all the sky over it. An entrance with a mound, and
  every flagged seed patch, stay lit with no ant there.
- **Spiders** are a leftover from the game this started as, not part of the research. They are off by default.

## What is real and what is a guess

The research is in `docs/research/` (`pogonomyrmex-badius-facts.md` and `seeds-diet-sizes.md`), with its sources. In `index.html` every
number is marked `[research]`, `[borrowed]` (measured in a related species) or `[guess]`.

| Value | In the simulation | Status |
|---|---|---|
| Worker length | 7 mm (two cells) | Research: 6.35–9.5 mm |
| Walking speed | about 3 cm/s | Borrowed: 2–7 cm/s in related species |
| Egg to adult | 38 days | Research, an estimate |
| Workers born per day | 0.092 × N^0.7 (about 1 a day in a colony of 30) | Research: 0.6–3% growth a day |
| Seeds per trip | 1 | Research |
| Seed kinds and what can be opened | small ≤ 1 mm, medium 1–1.4 mm, large ≥ 1.4 mm never opened | Research |
| Opening rate | 27% of small and 15% of medium seeds a day | Research: 80% and 60% opened in about 6 days (lab) |
| Large seeds in the store | up to 70% of it | Research: about 70% of store weight |
| Food in a seed | 1, 2 and 5 meals | Research for the weights (about 0.6, 1.2, 3 mg); the meal is a guess |
| Sprouting of large seeds | 1% of the pile a day | **Guess.** Really seasonal, peaking in April and December |
| Mix of seeds falling | 65% small, 10% medium, 25% large patches | **Guess** |
| Age at first work outside | 43 days | Research (summer-born workers) |
| Outside workers lost | 3.35% a day | Research |
| Worker old age | 365–455 days | Research, an estimate ("somewhat more than a year") |
| Queen lifespan | 15–30 years | Borrowed |
| Share working outside at the start | 40% | Research: 37–40% in summer |
| Scent trail | half gone in 12 minutes | Research: fades in 15–30 minutes |
| Foraging trip | 5–15 minutes before giving up | Borrowed: 1.5–47 minutes, 13 on average |
| Seeds in the store at the start | 20 | Research: one young colony had 20 |
| Food per ant | one meal (a small seed) every 2 days | **Guess.** Nobody has measured it |
| Days an ant survives unfed | 12 at most | **Guess** |
| Meals to raise one worker | 5 | **Guess** |
| Seeds falling | about 130 a day across the map | **Guess** |
| Time to dig one cell | 10 minutes of work | **Guess**, from sand moved per worker per day |
| Rest between jobs | 2–10 minutes | **Guess** |

**Not modelled yet,** although the research covers it: the full sequence of jobs by age (only "inside, then
outside" so far), the long-lived autumn-born workers, carrying the dead away, brood starving, majors opening seeds faster, sprouted seeds going to the larvae first,
insect food, the husk heap, winter and the seasons, day and night, major workers,
nest moves, the real shape of the nest (a spiral shaft with chambers, up to 3 m deep), and the mating flight.

## Tools

Both need Node.js and read the game straight out of `index.html`.

- `node tools/measure.js` runs colonies without a browser and reports how they fare when left alone
  (4 colonies per scenario for 14 simulated days; `node tools/measure.js 8 30` for 8 colonies and 30 days).
  A simulated day takes roughly 20 seconds, so the default run takes a good half hour.
- `node tools/test-save.js` checks that a colony can be saved and put back exactly, and carries on afterwards.

### Measurements

- **2026-10-10, before any of this** (game time, food only from the mouse): left alone, every one of 20
  colonies was gone in about 4 minutes.
- **2026-10-10, real time with falling seeds** (2 colonies per scenario, 14 simulated days, nobody feeding them):
  all 4 colonies alive at the end. Spiders off: 30 and 29 of the 30 starting ants alive, the store never empty,
  about 24 seeds carried home a day, 14 brood growing in each nest (none adult yet: that takes 38 days).
  Spiders on: 27 and 25 ants alive. This is a small sample over a short time; it shows the colony no longer
  starves, not that it thrives for months. The simulation ran about 6,500 times faster than real time.

- **2026-10-10, with ageing and death** (2 colonies, 60 simulated days, spiders off): both alive, grown from
  30 ants to 49 and 48, with 44 and 47 brood growing. 44 and 43 ants were born and 25 died in each, every one
  of them outside; none starved. That is about 2.6% of the outside workers a day, against the 3.35% aimed for.
  The colony dipped to 28–30 ants around day 38, before the first new workers were old enough to go out.

## Tuning

Constants near the top of the `<script>`: time and scale (`TPS`, `CELL_MM`, `RATES`), hunger (`EAT_GAIN`,
`LIFE_MAX`, `EGG_COST`), brood (`HATCH`, `layGap`), seeds (`SEED_*`), digging (`DIG_TIME`, `CAP`, `RIM`) and
spiders (`SPIDER_*`, `QUEEN_HP`). The soldier/scout/worker mix is in `targets()`. Main behaviour lives in
`stepAnt()`, `queenTick()`, `seedTick()` and `spiderTick()`. Saving is `saveState()` and `loadState()`.
