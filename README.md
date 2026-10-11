# Ant Colony

A digital ant colony that lives on your computer, seen from the side like an ant farm. It is modelled on
the Florida harvester ant (*Pogonomyrmex badius*). **Ants move in real time:** a second is a second, and a
foraging trip takes its true minutes. **Their calendar runs four times faster than ours,** so a day lasts six
hours and a whole year of colony life passes in each of our seasons. One pixel is 1.6 mm, which is one pellet
of sand, so a worker is four pixels long and you can watch the nest being carved out a pellet at a time.

Open `index.html` in a browser. Nothing needs installing. (For the fullscreen button, serve the folder
instead: `python -m http.server`.)

The colony is saved in the browser by itself. Close the page and come back later, and it has lived through
the time you were away (up to three of our days, which is twelve of theirs; longer absences are cut short and
the page says so).

## Controls

| Input | Action |
|---|---|
| `T` | Time: real time, fast (1 second = 1 minute), very fast (1 second = 10 minutes) |
| `W` `A` `S` `D` / arrows (Shift = fast) | Move the view |
| Mouse wheel (Shift = sideways), right-drag | Move the view |
| `+` `−`, or Ctrl + wheel | Zoom |
| `C` | Go to the nest |
| Map (top right) | Click or drag to jump |
| Left-drag (above ground) | Pour extra small seeds. Seeds also fall by themselves. |
| `F` fog · `P` scent trails · `Space` pause | Toggles |
| `R` | Start a new colony (asks first: the old one is gone for good) |
| `G` fullscreen · `H` hide the bottom panel | View |
| `X` spiders on/off · `K` summon a spider | Enemies (off unless you switch them on) |

If a fast-forward is more than the computer can do, the panel shows the rate it is really reaching.

**Trying things out:** `index.html?trial=24` starts a throwaway colony already 24 of our hours (four of its
days) old; add `&zoom=8` for a close look. It is never
saved and leaves your real colony alone.

## How it works

- **Scale.** One cell is 1.6 mm. The world is 3.2 m wide and 1.25 m deep; a worker walks about 3 cm a second.
- **The calendar.** A colony begins at eight in the morning on 1 June. The sun, the temperature of the sand and
  the season follow from the date (a simple model of north Florida), and the ants keep to them as in the
  research: work outside only by day, ending an hour and a half before sunset, on sand between 25 and 45 °C;
  the entrance filled in for the night; the queen laying from April to September; nobody outside from
  December to February, when the colony eats little; large seeds sprouting in spring and late autumn.
- **The start** is a young colony two days into moving house: 30 workers of mixed ages, each where its job
  puts it, 20 brood and the queen at the bottom, 20 meals, and a nest whose shaft and first niches are dug.
- **The nest** is dug to a plan set by the number of workers: a shaft that zigzags down (a spiral, seen
  from the side) with flat chambers on the outside of each bend, large and close together near the top,
  small and far apart below. For 30 workers that is 31 cm deep with four chambers.
  - Diggers bite one pellet loose, carry it up, and drop it on the sand disc around the entrance. Sand is
    coloured by the depth it came from, so the disc shows how deep the digging has reached.
  - Mostly the older workers dig, by day. The whole nest takes about four days; the part left at the start, about one.
  - The nest does not grow afterwards. A real colony gets a bigger nest by moving, and nest moves are not
    modelled yet.
- **Rooms get their use from who lives there:** outside workers rest in the top chamber, where seeds are
  dropped off; the store is in the middle; the brood, the queen and the young are at the bottom. As the nest
  deepens, the brood is carried down and the queen follows.
- **Ants** are small state machines on a cell grid, steering by momentum and scent trails. Each can go a
  number of days without eating, and eats a meal from the store when it gets low.
- **Age.** A new adult is pale and stays in the nest. At 43 days it starts working outside. Outside workers
  are lost at 3.35% a day, out on the surface; one that escapes that dies of old age after a little over a
  year. The dead lie where they fell for a day. The queen lives 15 to 30 years.
- **Seeds** fall onto the surface in small patches, each patch one kind. A forager carries one seed home per trip.
  - **Small** (tan, 1 mm or less): about a quarter of the pile is opened a day. One meal each.
  - **Medium** (brown, 1 to 1.4 mm): opened more slowly. Two meals each.
  - **Large** (dark brown, 1.4 mm and up): cannot be opened. They sit in the store until they sprout, then go
    to the brood. Five meals each. They take at most half of the store.
- **Castes and jobs.** A caste is the body an ant is born with: most workers are **minors**, and about 7% are
  large-headed **majors**. A job is what a worker does at its age, and it only ever moves up the nest:
  **callow** (pale, new) → **brood care** deep down → **transfer worker** in the middle, carrying seeds down
  to the store and sand up → **forager** at the top and outside. A forager's trips are mostly for seeds, with
  some patrols (looking for unflagged patches) and spells on guard. Majors stay in the store and speed up the
  opening of seeds. There are no soldiers: defence falls to the older workers at the surface.
- **Seeds are handed on.** Foragers leave seeds in the top chamber and transfer workers carry them down to
  the store, where they lie in mixed heaps.
- **Opening a seed is work.** Small and medium seeds come due at the measured rates; an ant then sits at the
  heap and grinds one open, majors mostly. A large seed that sprouts turns green and is carried to the brood.
- **The ants are drawn as ants:** a head, a narrow thorax carrying the legs, a two-knob waist and a round
  gaster, rusty red-brown like the real species, pale when new. Majors have a big square head; the queen is
  the largest, with a long gaster and wing stubs.
- **Brood** shows its stage: an egg is a white speck, a larva a cream curled grub that grows, a pupa a pale,
  still ant with no legs showing.
- **Seeds lie in heaps** on the chamber floors, tan, brown and dark brown. The sand disc is drawn with flecks
  of charcoal, as real ones have; the ants collecting charcoal is not modelled.
- **Fog:** unexplored is black, explored is dim, and ants light up what they see. Above ground an ant sees a
  tall strip of ground and sky. The entrance and every flagged seed patch stay lit.
- **Spiders** are a leftover from the game this started as, not part of the research. They are off by default.

## What is real and what is a guess

The research is in `docs/research/`, with its sources. In `js/sim.js` every number is marked `[research]`,
`[borrowed]` (measured in a related species) or `[guess]`.

| Value | In the simulation | Status |
|---|---|---|
| Pellet of sand | one cell, 1.6 mm | Research (derived from about 162 grains a pellet) |
| Worker length | 4 cells (6.4 mm); soldiers 6 (9.6 mm) | Research: 6.35–9.5 mm |
| Walking speed | about 3 cm/s | Borrowed: 2–7 cm/s in related species |
| Nest depth | 10^0.95 × workers^0.37 cm | Research |
| Chamber area | 10^0.55 × workers^0.87 cm² | Research |
| Chamber spacing | 3 cm at the top, widening with depth | Research: 2–4 cm near the top, 20–30 cm deep down |
| Chamber height, shaft width | 1 cm, just under 1 cm | Research |
| Time to dig the nest | about 4 days | Research: 3–6 days. The 18 minutes of work a pellet is a guess set to match |
| Who digs | 82% of outside-age workers, 19% of younger ones | Research |
| Egg to adult | 38 days | Research, an estimate |
| Workers born per day | 0.092 × N^0.7 | Research: 0.6–3% growth a day |
| Age at first work outside | 43 days | Research (summer-born workers) |
| Outside workers lost | 3.35% a day | Research |
| Worker old age | 365–455 days | Research, an estimate |
| Queen lifespan | 15–30 years | Borrowed |
| Seeds per trip | 1 | Research |
| Majors | 7% of workers born; they stay inside | Research: 5–7%, about 10% in July |
| Start of transfer work | 25 days old | **Guess**, from the shares of workers in each job |
| Patrol and guard trips | a quarter and a twelfth of a forager's trips | **Guess.** Patrollers are borrowed from the red harvester ant |
| Seed kinds and opening rates | see above | Research |
| Scent trail | half gone in 12 minutes | Research: fades in 15–30 minutes |
| Food per ant | one meal every 2 days | **Guess.** Nobody has measured it |
| Sprouting of large seeds | up to 5% of the pile a day near 17.5 °C, almost none in summer | Research for the timing (spring and late autumn); the size is a **guess** |
| Large seeds in the store | at most half of it | Research: about half the seeds by number |
| Calendar speed | 4 times ours | **Our choice,** so that the seasons can be watched |
| Weather | a simple model of north Florida | **Guess.** What the ants do about it is research |
| Store capacity | two seeds to a cell, heaps filling half a chamber | **Guess** |
| Seeds falling | about 190 a day across the map | **Guess** |
| Rest between jobs | 2–10 minutes | **Guess** |

**Not modelled yet,** although the research covers it: nest moves (so the nest never grows), sand passed up
in a relay, sand left underground, the
long-lived autumn workers, midden workers, foraging set off by returning patrollers, insect food, the
husk heap, carrying the dead away, and the mating flight.

## Files

- `index.html`: the page.
- `js/sim.js`: the whole simulation. It uses nothing from the browser, so the tools can run it too.
- `js/app.js`: drawing, mouse and keyboard, the panel, and the clock.
- `js/store.js`: saving, in the browser's database (IndexedDB), compressed.
- `tools/`: see below. `docs/research/`: the research and the question list.

## Tools

Both need Node.js.

- `node tools/measure.js` runs colonies without a browser and reports how they fare when left alone
  (2 colonies for 5 days of their calendar; `node tools/measure.js 2 60` for 60 days, about five minutes).
  A run stops itself after 14 minutes.
- `node tools/test-save.js` checks that a colony can be saved and put back exactly, and carries on afterwards.

### Measurements

- **2026-10-10, the original game** (game time, food only from the mouse): left alone, every one of 20
  colonies was gone in about 4 minutes.
- **2026-10-10, real time, falling seeds, ageing** (the earlier, smaller world): two colonies grew from 30
  ants to 49 and 48 in 60 simulated days.
- **2026-10-10, the rebuilt world** (2 colonies, 5 simulated days): both dug their whole nest, in 4.1 and 4.3
  days, putting all 1,425 pellets on the disc. 33 and 32 ants at the end, none dead, the store never empty,
  about 42 seeds carried home a day. Five days is too short to say anything about the long run. The
  simulation ran about 5,600 times faster than real time, and a save is about 550 KB.
- **2026-10-10, with castes and jobs by age** (2 colonies, 5 simulated days): nests dug in 4.2 days each;
  29 and 30 ants at the end, 2 and 1 lost outside, none starved, about 44 seeds carried home a day. It ran
  about 3,300 times faster than real time, slower than before because more ants are out at once.
- **2026-10-11, with the calendar, seasons and the store reworked** (2 colonies, 60 calendar days, June and
  July): 51 and 49 ants at the end from 30, 45 and 42 born, 24 and 23 lost outside, none starved, 44 and 36
  brood growing. One colony had nothing ready to eat for 221 of the 1,440 hours, so food is tight. About 300
  large seeds per colony were thrown out for lack of room. Autumn, winter and spring have not been run.
  Three earlier runs that day each caught a fault: a store jammed with large seeds, brood that could not be
  carried between two nursery chambers, and a store made too small.
