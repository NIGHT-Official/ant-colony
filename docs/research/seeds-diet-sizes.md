# Pogonomyrmex badius: seeds, diet, and seed sizes for the sim

Date: 2026-10-10. Companion to `Pogonomyrmex-badius-Sim-Facts.md`.

Labels: **P. badius** means the value comes directly from Florida harvester ant data. **BORROWED (species)** means it comes from another species. **DERIVED** means I calculated it from cited numbers. **via abstract** or **via search snippet** means I did not read the full text. **Couldn't find it** means no source was found.

## Summary
- **What they store.** Nests at Ant Heaven, a Florida sandhill site near Tallahassee, held at least **58 seed species from 20 plant families** (31 nests in 1989; 9 nests in 2014). The most common by seed count (1989 / 2014) were:
  - *Dichanthelium commutatum*: 35.1% / 11.6%
  - *Paspalum setaceum*: 29.0% / 21.6%
  - *Croton michauxii*: 12.2% / 37.9%
  - *Digitaria* sp. A: 5.5% / <0.1%
  - *Rhus glabra*: 3.7% / 0.4%
  - *Trichostema dichotomum*: 2.6% / <0.1%
  - *Diodia teres*: 2.5% / 14.5%
  - *Polygonella gracilis*: 2.4% / 0.1%
  - *Lespedeza hirta*: 1.7% / 0.7%
  
  Source: Tschinkel & Domínguez 2017, Table 1.
- **What is missing.** Legumes (Fabaceae) and grasses are over-represented. Dog fennel (*Eupatorium capillifolium*) and broomsedge (*Andropogon*) were common at the site but **absent** from the stores. Gallberry and shiny blueberry were abundant at the site but rare in the stores. Most Asteraceae were also absent. Wiregrass (*Aristida stricta*) was absent from the site itself, so I found no store data for it.
- **Size limit.** Workers can open only seeds **≤ about 1 mm wide** (sieve 18, mean about 0.8 mg) on their own. Seeds 1.4 mm and wider are effectively unopenable. **Majors open more seeds, but not bigger ones.**
- **Large seeds wait for germination.** Unopenable seeds make up about **70% of store weight and 50% of store numbers**. When these seeds germinate in the chambers, the ants quickly remove them and feed them to larvae.
- **Seed masses.** Store seeds range from **0.34 mg** (smallest sieve class) to **14.45 mg** (sieve 8+, wider than 2.36 mm). The heaviest species are about **80–90× the smallest** and up to about 4 mm across.
- **Diet beyond seeds.** Larvae also get insect protein, with larger castes getting more. I found **no published seed:insect percentage** for P. badius.

## Measured size classes (P. badius stores, Tschinkel & Kwapich 2016, Table 1)
| Sieve | Width class (mm) | Mean mass 1989 (mg ± SD) | 2014 mean (mg) | Mass vs worker (2.2 mg)* | Openable? |
|---|---|---|---|---|---|
| 8+ | >2.36 | 14.45 ± 6.89 | – | 6.6× | No |
| 10 | 2.00–2.36 | 7.30 ± 1.96 | 10.9 (includes larger seeds) | 3.3× | No |
| 12 | 1.7–2.0 | 5.28 ± 1.94 | 4.24 | 2.4× | No |
| 14 | 1.4–1.7 | 2.31 ± 0.76 | 2.61 | 1.05× | No ("smallest size not readily opened") |
| 16 | 1.18–1.4 | 1.47 ± 0.34 | – | 0.67× | Marginal |
| 18 | 1.00–1.18 | 0.83 ± 0.16 | 1.49 (includes sieve 16) | 0.38× | Yes, largest readily opened |
| 20 | 0.85–1.0 | 0.63 ± 0.28 | 0.65 | 0.29× | Yes ("medium": 60% opened in about 6 days) |
| 25 | 0.71–0.85 | 0.51 | – | 0.23× | Yes |
| 30 | 0.60–0.71 | 0.37 | – | 0.17× | Yes |
| 35 | 0.50–0.60 | 0.34 | – | 0.15× | Yes |

*DERIVED: mass divided by a 2.2 mg lean dry minor worker.

In the lab, 80% of "small" seeds and 60% of "medium" seeds were opened within about 6 days. Almost no large or very large seeds were opened within 12 days.

## Seed table (main species)
Sim reference worker: minor, 7 mm long, 2.2 mg lean dry mass.

Botanical dimensions are for the dispersal unit the ant carries (achene, spikelet, or mericarp) unless noted. "Rel. wt" is mass relative to the smallest store seed, *Polygonella gracilis* = 1.0 (Tschinkel & Domínguez 2017). Mass in mg is **DERIVED** as rel. wt × 0.34 mg. This assumes *Polygonella* weighs about the same as the smallest sieve class (0.34 mg); the paper does not give its absolute mass.

| Species | Common name | Share 1989 / 2014 | L × W (× T) mm | Mass mg | Size vs 7 mm worker | Openable? (vs 1–1.4 mm limit) | Notes | Source |
|---|---|---|---|---|---|---|---|---|
| *Dichanthelium commutatum* | variable panicgrass | 35.1% / 11.6% | spikelet 2.2–3.2 × 1.1–1.3; T: Couldn't find it | rel 2.2 → ~0.75 (DERIVED) | L 31–46%; mass ~34% | Yes. Dominated sieve 20 in 2015 | Main "quick food" grass | FNA (via nwwildflowers FNA mirror); T&D 2017 |
| *Paspalum setaceum* | thin paspalum | 29.0% / 21.6% | spikelet 1.4–2.6 long; W/T: Couldn't find it | Couldn't find it (no rel. wt given) | L 20–37% | Yes. Dominated sieve 18 in 2015 | Quick food | FNA; T&K 2016 |
| *Croton michauxii* | Michaux's croton, rushfoil | 12.2% / 37.9% | achene 2.5–3 × 1–1.2; seed 2–2.5 × 1 | rel 7.4 → ~2.5 (DERIVED) | L 29–43%; mass ~114% | **No in practice.** Sieve 14 (≥1.4 mm) was almost entirely this species and was not readily opened | Germination peaks around 15 °C (sieve-14 data) | FNA (efloras); T&K 2016 |
| *Diodia teres* | poorjoe | 2.5% / 14.5% | fruit 3–3.5 × 3–3.5; seed ~2.5 long | rel 10.7 → ~3.6 (DERIVED) | L ~36–50%; mass ~1.7× | No. Dominated sieve 12 | Germination driven by elapsed time and largely temperature-indifferent | Missouriplants; Flora of China (efloras); T&K 2016 |
| *Rhus glabra* | smooth sumac | 3.7% / 0.4% | stone ~3 × 2 (via search snippet, unverified) | rel 20 → ~6.8 (DERIVED) | L ~43%; mass ~3× | No | Long-term store | Cambridge SSR abstract (via search snippet); T&D 2017 |
| *Rhus copallinum* | winged sumac | 0.2% / 3.2% | Couldn't find it | rel 21 → ~7.1 (DERIVED) | mass ~3.2× | No. Was in sieve 12 in 2015 | Long-term store | T&D 2017; T&K 2016 |
| *Polygonella gracilis* | tall jointweed | 2.4% / 0.1% | achene 2–3.4 × 1–1.4 (via search snippet) | rel 1.0 (smallest seed in stores) | L 29–49% | Yes (example of an ant-opened seed) | Reference "unit" seed | FNA (efloras); T&D 2017 |
| *Trichostema dichotomum* | forked bluecurls | 2.6% / <0.1% | Couldn't find it | rel 4.6 → ~1.6 (DERIVED) | mass ~71% | Probably borderline (not tested) | | T&D 2017 |
| *Lespedeza hirta* | hairy bushclover | 1.7% / 0.7% | Couldn't find it | rel 11 → ~3.7 (DERIVED) | mass ~1.7× | Probably no (not tested) | Legume | T&D 2017 |
| *Rubus trivialis* | southern dewberry | 0.5% / 2.3% | Couldn't find it | rel 3.8 → ~1.3 (DERIVED) | mass ~59% | Not tested | | T&D 2017 |
| *Commelina erecta* | whitemouth dayflower | 0.7% / <0.1% | Couldn't find it | rel 23 → ~7.8 (DERIVED) | mass ~3.5× | No | | T&D 2017 |
| *Vicia* sp. | vetch | 0.5% / 0.6% | Couldn't find it | rel 37 → ~12.6 (DERIVED) | mass ~5.7× | No | | T&D 2017 |
| *Smilax auriculata* | earleaf greenbrier | 0.1% / 0.1% | Couldn't find it | rel 77 → ~26 (DERIVED) | mass ~12× | No. "Must germinate" | Germinates fairly regularly; about 70× the food of a *Polygonella* seed | T&D 2017 |
| *Cnidoscolus stimulosus* | tread-softly | 0.1% / 0.2% | Couldn't find it | rel 78 → ~27 (DERIVED) | mass ~12× | No | | T&D 2017 |
| *Opuntia humifusa* | prickly-pear | 0.3% / <0.1% | Couldn't find it | rel 87 → ~30 (DERIVED) | mass ~13× | No | Heaviest in the list | T&D 2017 |

- **Other species present.** These include *Digitaria* spp., Galactia, Crotalaria, Chamaecrista, Stylosanthes, Dalea, Senna, *Croton argyranthemus*, *Euphorbia floridana*, *Stillingia*, Cuscuta, Stylisma, *Cyperus retrorsus*, *Scleria*, *Pinus palustris/elliottii/taeda*, Ilex, Gaylussacia, Hypericum, Rumex, Eriogonum, *Vitis rotundifolia*, Nyssa, Phytolacca, Tradescantia, *Chrysopsis lanuginosa*, and 10 unidentified species. Each is ≤0.9% in either year except *Digitaria* sp. A (5.5% in 1989).
- **Not found in this search.** I found no seed-store data for Tephrosia, Pityopsis, or *Aristida stricta*. I did not check Harrison & Gentry 1981 or Gentry 1974 for forager-load species lists.

## Preferences
- **Size (P. badius).** Foragers bring in all sizes. Sieve 18 (about 1 mm) is the size returning foragers carry most often, and foragers carry more large seeds than the chaff shows being eaten. The colony then **eats** small seeds and **stores** large ones. Store composition is therefore collection minus use, not a forager preference.
- **Species (P. badius).** The authors infer some selectivity because of which seeds were missing despite being abundant at the site (dog fennel, Andropogon, most Asteraceae) and which were rare (gallberry, blueberry). They note that no cafeteria experiment has been done with Ant Heaven seeds. **Couldn't find a P. badius seed-choice experiment** apart from Ferster & Traniello 1995 (distance baits; see the facts file).
- **Germinating seeds (P. badius).** Germinating seeds are strongly preferred and are fed to larvae.
  - Field test: 74% of germinated seed-equivalents showed up as husks in the middens, versus 2% of non-germinated seeds.
  - 40% of germinated husks appeared within 1 day.
  - In the lab, 45% of larvae were dyed pink within 2 days.
- **Colony and site.** Seed-size mixes differed strongly between colonies but little between chambers within a colony. This reflects each colony's foraging patch, and possibly colony preference. Stores also shifted as the vegetation changed: there were fewer small grass seeds in 2014 than in 1989.
- **Season.** Seed and insect collection were similar to each other. Both peaked in summer and autumn and declined from late November; the decline was significant for insects only (Bossart et al. 2024, via abstract).
- **Majors vs minors (P. badius).** With majors present, colonies milled more small and medium seeds (33 small and 18 medium husks) and left fewer seeds in the arena (9.3 vs 18). The **maximum size opened did not change.**
- **Elaiosomes and fat content.** Couldn't find it for P. badius.
- **BORROWED (P. occidentalis).**
  - Kelrick et al. 1986 (via abstract): ants ranked seeds by **calories per seed and % soluble carbohydrate**, not by size or lipid content. They preferred millet (*Panicum miliaceum*).
  - Crist & MacMahon 1992 (via abstract): from natural soil seed, ants harvested **small, sound seeds**. In trials 10 m from the nest, they preferred **large, energy-rich seeds**; near the nest they were unselective.
- **Not read.** I did not read Pulliam & Brand 1975.

## Storage, longevity, germination
- **Where seeds are kept (P. badius).** Seeds sit in dedicated chambers about 30–100 cm deep (also given as 40–100 cm). Foragers drop seeds in the top chambers, and transfer workers carry them down (see the facts file). A large colony can hold up to 300,000 seeds weighing about 0.5 kg.
- **Quick vs long-term use.**
  - Seeds ≤1 mm wide are opened within days (80% of small seeds in about 6 days in the lab).
  - Seeds ≥1.4 mm stay intact. In the lab, 60% of marked non-germinating large seeds were still unopened at the end of the run, with only rare openings after about 1 week.
  - Large seeds probably build up over the colony's whole life, and the entire store is moved when the colony relocates.
- **Germination in stores.**
  - Buried seeds germinated mainly according to **temperature and season**, not depth. Germination peaked in **April and December** (soil about 18–22 °C) and was lowest in August.
  - In the lab, germination peaked at **15 °C** for sieve 14/18 seeds. Sieve 20 seeds fell steadily from **35% at 10 °C to 10% at 32 °C**.
  - The largest seeds (sieve 12) mostly germinated within 10 days.
  - Maximum germination was about 35% for 2015 seeds, roughly half the 2014 maximum.
- **Do the ants remove germinating seeds?** Yes. In chambers split by a barrier, the side the ants could not reach had a mean of **21 germinating seeds** (out of about 4,400 seeds). The side they could reach had **1.33** (out of about 6,500). Wheeler reported masses of sprouting seeds in winter that the ants dumped on the surface (cited in T&K 2016).
- **Chaff.** Husks go to a separate husk midden on or near the mound, mostly from small seeds (Panicum husks per Gordon 1984). Each husk is half a seed coat.
- **Mold and spoilage.** Couldn't find it for P. badius. The authors suggest that tightly packed seeds may inhibit each other's germination, but this is untested.
- **Viability over time.** Couldn't find it beyond the above. Germination batches differ with seed age and history, and 2014 seeds tested a year later germinated more than fresh 2015 seeds.
- **Stores as a buffer.** Stores are not an emergency buffer. In starved colonies the seeds went unused (Smith 2007; see the facts file).

## Non-seed food (brief)
- P. badius eats seeds and insects (the facts file also lists charcoal, which they collect but do not eat).
- Larger castes assimilate relatively more insect protein (Smith & Suarez 2010, via abstract).
- A colony's seed:insect proportion varies widely between colonies.
- **No numeric seed:insect diet share found for P. badius: Couldn't find it.**

## Sim notes
- **Seed classes:**
  - **QuickFood:** width ≤1.0 mm (grasses: Dichanthelium, Paspalum, Digitaria, Polygonella). Mass 0.34–0.83 mg. Opening takes days (80% within about 6 days).
  - **Marginal:** 1.0–1.4 mm, about 0.8–1.5 mg. Slow to open, and majors raise the rate.
  - **MustGerminate:** ≥1.4 mm (Croton michauxii, Diodia, Rhus, legumes, Smilax, Opuntia). Mass 2.3–30 mg. Each tick, a seed germinates with probability p(temp, species): peak at about 15–20 °C (April and December), low in August. Once germinated, workers carry it out within 1–4 days and feed it to larvae, then send the husk to the midden.
- **Foragers:** one seed per trip; sample seed sizes from the habitat mix and never reject by size.
- **Store build-up:** the store is collection minus use, so large seeds build up toward about 70% of store weight.
- **Drawing scale:** at 7 mm per worker, a Croton achene is about 0.4 worker lengths, a grass spikelet about 0.3–0.45, and the largest seeds (about 4 mm across) about 0.57.

## References
- Tschinkel WR, Domínguez DJ 2017. An illustrated guide to seeds found in nests of P. badius. PLoS ONE 12:e0171419. https://doi.org/10.1371/journal.pone.0171419 (full text, local src/PMC5331987.txt)
- Tschinkel WR, Kwapich CL 2016. P. badius relies on germination to consume large seeds. PLoS ONE 11:e0166907. https://doi.org/10.1371/journal.pone.0166907 (full text, local src/PMC5125654.txt)
- Flora of North America: *Croton michauxii*, http://www.efloras.org/florataxon.aspx?flora_id=1&taxon_id=242416382 ; *Paspalum setaceum*, https://floranorthamerica.org/Paspalum_setaceum ; *Dichanthelium commutatum*, https://nwwildflowers.com/flora/?t=Dichanthelium+commutatum ; *Polygonella gracilis*, http://www.efloras.org/florataxon.aspx?flora_id=1&taxon_id=250060713
- *Diodia teres*: https://www.missouriplants.com/Diodia_teres_page.html ; Flora of China http://www.efloras.org/florataxon.aspx?flora_id=2&taxon_id=242416448
- *Rhus* seed morphology (Seed Science Research), https://www.cambridge.org/core/journals/seed-science-research/article/abs/seed-morphology-and-physical-dormancy-of-several-north-american-rhus-species-anacardiaceae/4BCAE2F41EBF53149E87F1A173D9D889 (via search snippet)
- Kelrick MI, MacMahon JA, Parmenter RR, Sisson DV 1986. Oecologia 68:327–337. https://doi.org/10.1007/BF01036734 (via abstract)
- Crist TO, MacMahon JA 1992. Harvester ant foraging and shrub-steppe seeds. Ecology (via abstract; DOI not verified)
- Smith CR, Suarez AV 2010. The trophic ecology of castes in harvester ant colonies. Funct Ecol 24:122–130. https://experts.illinois.edu/en/publications/the-trophic-ecology-of-castes-in-harvester-ant-colonies/ (via abstract)
- Bossart et al. 2024. Seasonal diet change of P. badius… Southeastern Naturalist 23(3). https://www.eaglehill.us/SENAonline/articles/SENA-23-3/15-Bossart.shtml (via abstract)
- Gordon DM 1984 (local src/g1984.pdf): husk midden, mostly Panicum.
