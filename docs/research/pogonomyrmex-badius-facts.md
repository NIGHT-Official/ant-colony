# Florida Harvester Ant (*Pogonomyrmex badius*): Facts for the Ant Colony Simulation

Compiled 2026-10-10. Every answer gives a range if one exists, the unit, the source, and a status: **P. badius** (measured in this species), **BORROWED (species)** (taken from another species, usually the red harvester ant *P. barbatus*), or **Couldn't find it**. Notes like "via abstract" or "via AntWiki" mean the source was read only in summary form.

## Scale-setting answers at a glance

- **Q35 Nest depth:** mature nest 2.5–3.0 m (deepest cast 3.06 m); first-year nest about 30–50 cm (best value ~40 cm). *P. badius*, Tschinkel 2004.
- **Q19 Worker size:** body length 6.35–9.5 mm (smallest minor to largest major, via EDIS); lean dry mass of older minors 2.01–2.35 mg. *P. badius*.
- **Q1 Worker lifespan (field):** summer-born ~70–80 days; autumn-born ~8–13 months. Derived from age at first foraging plus time spent foraging (Kwapich & Tschinkel 2013); not directly measured.
- **Q30 Trip length:** average 13.1 min, median 9.6, range 1.5–47 min. BORROWED (*P. barbatus*, Beverly et al. 2009). Trips per day: couldn't find it (10/day is only a modelling assumption in Kwapich & Tschinkel 2016).
- **Q16 Food per ant per day:** couldn't find it; only a colony energy-flow figure exists (see Q16).
- **Q17 Seeds per trip:** one seed per successful trip; stored seeds average 0.72–2.00 mg. *P. badius*.

---

# Florida harvester ant (*Pogonomyrmex badius*): biology facts for the ant-colony simulation, Part 1 (Sections A–D)

Compiled 2026-10-10. "Full text" means I read the paper's full text (Tschinkel lab PDFs at bio.fsu.edu or Europe PMC). "Via abstract" means I saw only the abstract. "Via AntWiki" or "via EDIS" means the value comes from a secondary summary. Values are from the field (north Florida) unless marked "lab".

---
## A. Life cycle and lifespan

### Q1. Worker lifespan.
- **Answer:** No direct study measures a P. badius worker's lifespan from emergence to death. Combining the age when workers start foraging with how long foragers survive gives about **2.5–3 months for summer-born workers** (~43 days to first foraging + ~27–38 days as a forager) and **about 8–13 months for autumn-born workers** (210–360 days to first foraging + ~1 month as a forager). Tschinkel (1999) estimated "probably somewhat more than a year". In the lab, foragers lived up to 8 times longer than in the field (Kwapich & Tschinkel 2016).
- **Range:** ~70 to ~400 days total in the field (my derivation; see note).
- **Unit:** days
- **Status:** P. badius
- **Source(s):** Kwapich & Tschinkel 2013, *Behav Ecol Sociobiol* 67:2011–2027, doi:10.1007/s00265-013-1611-9 (full text; "~43 days", "210 to 360 days", forager survival 38 ± 10.1 days in March–July and 26.9 ± 7.93 days after July). Tschinkel 1999, *Ann Entomol Soc Am* 92:80–89 (full text; "longevity of harvester ant workers is probably somewhat more than a year", given as an estimate rather than a measurement). Kwapich & Tschinkel 2016, *Behav Ecol Sociobiol* 70:221–235, doi:10.1007/s00265-015-2039-1 (via abstract; foragers die within 27 days of starting to forage; lifespan rose 57% when colonies were penned and up to 8-fold in the lab).
- **Disagreement:** Tschinkel (1999) gives roughly 1 year. Kwapich & Tschinkel (2013) show two cohorts with very different lifespans. Gordon (P. barbatus) says "workers live only a year".
- **Sim note:** Track each worker's birth month. Workers born in June–July start foraging at ~43 days. Workers born in late August–October overwinter and start foraging the next March–July. Once a worker forages, kill it at ~3.35%/day, which gives a mean of ~30 days. Mortality before foraging is low.

### Q2. Do foragers die sooner than nest workers? How long does a worker live once it starts foraging?
- **Answer:** Yes. Foraging is a worker's last job, and foragers disappear at about **3.35% per day**. Mean survival after starting to forage is **38 days (spring cohort)** and **26.9 days (after July)**. Kwapich & Tschinkel (2016) report that foragers die within about 27 days. The deaths come from outside causes, mainly fights with neighbouring colonies, not from built-in ageing: field foragers moved to the lab lived hundreds of days.
- **Range:** 27–38 days (SD 8–10)
- **Unit:** days; %/day
- **Status:** P. badius
- **Source(s):** Kwapich & Tschinkel 2013 (full text). Kwapich & Tschinkel 2016 (via abstract). Kwapich & Tschinkel ESA 2013 talk abstract, https://esa.confex.com/esa/2013/webprogram/Paper77159.html (40% higher forager survival when neighbours were manipulated).
- **Sim note:** Use a constant daily hazard of ~0.0335 for foragers. Raise it with neighbour density, and drop it sharply if foraging is blocked.

### Q3. Queen lifespan.
- **Answer:** No measured value exists for P. badius queens. EDIS (secondary) reports one P. badius colony lasting "at least 19 years", citing Haack & Granovsky 1990. Since the colony dies with its queen, that implies a queen of ≥19 years. **BORROWED (P. barbatus):** colonies, and therefore queens, live **20–30 years**; earlier estimates were 15–20 years.
- **Range:** 15–30+ years
- **Unit:** years
- **Status:** BORROWED (P. barbatus), plus one secondary P. badius anecdote
- **Source(s):** Gordon 2024, *Phil Trans R Soc B* 379:20230332, https://pubmed.ncbi.nlm.nih.gov/39463251/ (via abstract). Gordon 1995, *Anim Behav*, https://web.stanford.edu/~dmgordon/previous/Gordon1995.pdf (via search snippet: "queen lives 15–20 years"). EDIS EENY-298, https://ask.ifas.ufl.edu/publication/IN536 (P. badius 19-year colony, secondary).
- **Sim note:** Treat ~20–30 years as effectively immortal for most runs.

### Q4. Days as an egg, as a larva, as a pupa.
- **Answer:** Only estimates exist. Smith & Tschinkel (2006) **assumed** 38 days from egg to adult for workers and 50 days for sexuals. They split this by the fire-ant ratio 1 : 2.4 : 1.3 (Porter 1988), giving **workers 8 egg / 19 larva / 11 pupa** and **sexuals 11 / 25 / 14** days. These figures come from a literature model, not direct P. badius measurements. Tschinkel (1999) did measure pupal duration in the lab at several temperatures, but reports it only inside birth-rate calculations.
- **Range:** workers 38 days total; sexuals 50 days total
- **Unit:** days
- **Status:** P. badius (estimate based on Porter 1988's multi-species average, ~27 °C)
- **Source(s):** Smith & Tschinkel 2006, *J Insect Sci* 6:32, doi:10.1673/2006_06_32.1, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2990325/ (full text).
- **Sim note:** Scale development time with temperature. Deep chambers are cooler, which slows development.

### Q5. Share of eggs that reach adulthood.
- **Answer:** Couldn't find it. No P. badius value for survival from egg to adult. Related finding: removing 50% of the foragers reduced larval survival, and larvae starve within about 7 days if the colony cannot forage.
- **Status:** Couldn't find it. I searched the Tschinkel and Kwapich papers and Smith & Tschinkel 2006.
- **Source(s):** Kwapich & Tschinkel 2013 (full text). Tschinkel & Kwapich 2016, PLoS ONE 11:e0166907 (full text).
- **Sim note:** Tie larval survival to how much food the foragers bring in.

### Q6. Male lifespan, and when males appear.
- **Answer:** No measured male lifespan. Males and gynes (future queens) are reared only in **spring**. Sexual adults started emerging **14 days before workers**, and a colony excavated on 3–15 April already contained sexual larvae. Mating flights happen around the **summer solstice (June)**, usually after the first heavy summer rain, and colonies keep rearing more sexuals for later flights. Males are thought to die after mating (stated for P. barbatus).
- **Range:** Sexual larvae from early April; flights June to early July (EDIS cites June–October from Haack & Granovsky)
- **Unit:** calendar dates
- **Status:** P. badius (timing). Lifespan: Couldn't find it.
- **Source(s):** Smith & Tschinkel 2006 (full text). Kwapich & Tschinkel 2013 (full text; "alates for mating flights in the days surrounding the summer solstice", from the FSU dissertation abstract https://repository.lib.fsu.edu/islandora/object/fsu%3A252854). Gordon & Kulig 1996 (P. barbatus, males die after mating).

## B. Queen and colony growth

### Q7. How a colony starts: does the queen raise the first workers alone, how many, and how long does it take?
- **Answer:** Each colony is founded by a single queen who has mated with many males. I found no direct P. badius study of founding. A secondary summary says P. badius is fully claustral: the queen seals herself in and raises the first small workers (nanitics) on her own body reserves. I could not confirm this from a primary source. Smith & Tschinkel (2006) measured gyne fat at 37%, similar to that of claustral relatives (~40%), which supports it. Incipient nests are **40–50 cm deep**. The single incipient colony Tschinkel excavated held **20 seeds**. Tschinkel's smallest colony size class was **<100 workers**.
- **Range:** Number in the first brood and time to first workers not found
- **Status:** P. badius (partial). Brood size and timing: Couldn't find it.
- **Source(s):** Smith & Tschinkel 2006 (full text). Tschinkel 2004, *J Insect Sci* 4:21 (full text). Tschinkel 1999 AESA (full text). Claustral context: Johnson/Gibbs 2014, *J Insect Physiol*, https://gibbs.faculty.unlv.edu/Ant%20Gyne%20MR%20JIP%202014.pdf (genus-level only).
- **Sim note:** Seal the queen in, with no foraging, until her first workers emerge. The development time from Q4 sets the earliest possible emergence (~38 days or more).

### Q8. Eggs laid per day, young colony and mature.
- **Answer:** No eggs-per-day figure exists. Proxies: the queen's ovaries have more active (vitellogenic) follicles in larger colonies, but egg-laying only **doubles for each 10-fold increase in colony size**. The queen becomes reproductively active in May and stops laying before October. In July, the colony's worker birth rate grows ~5-fold for each 10-fold increase in colony size. The specific growth rate is ~3%/day in small colonies and <1%/day (0.6–0.8%) in large ones.
- **Range:** Colony growth 0.6–3 %/day (July)
- **Unit:** % per day
- **Status:** P. badius (proxy only; absolute eggs/day: Couldn't find it)
- **Source(s):** Tschinkel 1999, *Ann Entomol Soc Am* 92:80–89, https://www.bio.fsu.edu/~tschink/publications/1999-4.pdf (full text).
- **Sim note:** Model egg-laying as k·N^0.3, which doubles per 10-fold N, and set it to 0 from October to April.

### Q9. Colony size after one year, and at maturity.
- **Answer:** Size after one year: Couldn't find it for P. badius. **BORROWED (P. barbatus):** ~3,000 workers at 2 years. Mature size: colonies first reproduce at about **700 workers**. AntWiki lists a mean colony size of **4,300**. Golley & Gentry counted **4,000–6,000** per excavated nest. Tschinkel's largest colonies held **7,000–8,000**, and colonies can reach **11,000**.
- **Range:** 700 (minimum mature) to 11,000
- **Unit:** workers
- **Status:** P. badius (mature). BORROWED (P. barbatus) for early years.
- **Source(s):** Smith & Tschinkel 2006. Kwapich & Tschinkel 2013. Tschinkel 1998, *Insectes Soc* 45:385–410 (full text). Golley & Gentry 1964, *Ecology* 45:217–225, doi:10.2307/1933834 (via abstract). AntWiki (via AntWiki). Gordon & Kulig 1996, *Ecology*, https://web.stanford.edu/~dmgordon/previous/GordonKulig1996.pdf.

### Q10. Years to reach maturity.
- **Answer:** No P. badius age at maturity. Maturity is defined by size: about 700 workers (Smith & Tschinkel 2006), or about 1/3 of maximum size (~2,000–2,500 workers) by Tschinkel's 1999 criterion. **BORROWED (P. barbatus):** about 5 years to reproduce and reach a stable size of ~10,000–12,000.
- **Range:** ~5 years (P. barbatus)
- **Unit:** years
- **Status:** BORROWED (P. barbatus)
- **Source(s):** Gordon 1995. Gordon & Kulig 1996. Tschinkel 1999. Smith & Tschinkel 2006.
- **Note:** The two P. badius maturity thresholds (700 vs ~2,000–2,500 workers) disagree. They come from different samples.

### Q11. Does egg laying stop for part of the year?
- **Answer:** Yes. Brood is produced only from about **May to September**. No pupae or new callows were found after October, and colonies do not overwinter with brood. Queens start laying in May and stop before October.
- **Range:** Laying roughly late March/April–September. Note that sexual larvae were already present in early April, so laying must start before May.
- **Status:** P. badius
- **Source(s):** Tschinkel 1999 AESA (full text). Kwapich & Tschinkel 2013 (full text). Smith & Tschinkel 2006 (full text).

### Q12. What happens when the queen dies?
- **Answer:** Workers in a colony without a queen start laying male eggs. Eggs appeared **28–35 days** after the queen was removed. Majors have about twice as many ovarioles as minors, so they have more reproductive potential. The colony cannot rear a new queen, because workers produce only males. For P. barbatus, a colony dies once its queen and then its last workers die, and no new queen is adopted.
- **Range:** 28–35 days to the first worker-laid eggs
- **Unit:** days
- **Status:** P. badius (worker male production). Colony death: BORROWED (P. barbatus).
- **Source(s):** Smith, Schoenick, Anderson, Gadau & Suarez 2007, *Insectes Soc* 54:260–267, doi:10.1007/s00040-007-0940-y (via abstract). Smith & Tschinkel 2006 (full text; a colony without a queen kept producing males for over 3 months). Gordon & Kulig 1996.

### Q13. When new queens and males are produced, and when the mating flight happens.
- **Answer:** Sexuals are produced only in **early spring, before any workers**, and only by colonies above the size threshold. Mating flights happen in **June**, around the solstice, usually after the first heavy summer rain. AntWiki and antkeeping.info list flights in May–July. EDIS (secondary) says swarms can run June–October.
- **Status:** P. badius
- **Source(s):** Tschinkel 1999 AESA. Smith & Tschinkel 2006. Kwapich & Tschinkel 2013. AntWiki flight table (via AntWiki). EDIS IN536.

## C. Food

### Q14. Which seeds they collect, and what else they eat.
- **Answer:** Their stores held **at least 58 seed species from 20 plant families**, and more than 15 species appeared regularly in stores and chaff. They also take insect protein: larvae are fed insect material, and dyed beetle larvae were used as bait in experiments. Colonies also gather charcoal, which they do not eat but heap around the nest.
- **Range:** 58 species
- **Status:** P. badius
- **Source(s):** Tschinkel & Domínguez 2017, PLoS ONE 12:e0171419, doi:10.1371/journal.pone.0171419 (full text). Tschinkel & Kwapich 2016 (full text). Smith & Tschinkel 2007, *Ecol Entomol* 32:105–112 (full text).

### Q15. What larvae eat compared with adults.
- **Answer:** Adults eat ant bread (chewed seed paste) and seed particles, and give **large chunks of seed** to larvae. Workers preferentially feed **germinating seeds** to larvae. Larvae also receive insect protein, and the share of seed vs insect differs by caste and season. Adults also take sugar water in the lab.
- **Status:** P. badius
- **Source(s):** Tschinkel & Kwapich 2016 (full text). The caste-dependent diet comes from Smith & Suarez 2010, *Funct Ecol* 24:122–130, which I saw only as a citation.

### Q16. Food per ant per day, or per colony per day.
- **Answer:** No direct intake rate. Golley & Gentry measured energy flow of **14–48 kcal/m²/year** at **27 colonies/ha**. Dividing these gives roughly 5,200–17,800 kcal per colony per year. That is my own arithmetic from the abstract and should be treated with caution.
- **Unit:** kcal m⁻² yr⁻¹
- **Status:** P. badius (energy only; food mass per ant: Couldn't find it)
- **Source(s):** Golley & Gentry 1964 (via abstract).

### Q17. Seeds collected per day, or per forager per trip.
- **Answer:** Foragers carry **one seed per trip**. Tschinkel says 300,000 stored seeds mean "a minimum of 300,000 forager trips". No daily seeds-per-colony count was found. Foragers in larger colonies each collect more seeds.
- **Unit:** seeds per trip
- **Status:** P. badius (per-trip). Daily rate: Couldn't find it.
- **Source(s):** Tschinkel 1999 AESA (full text).

### Q18. How many seeds a colony stores, and how long the store lasts.
- **Answer:** Large colonies store **up to 300,000 seeds**. An incipient colony had 20. Seed weight scales with colony biomass, so mg of seed per mg of ant stays constant. Stored seeds sit **40–100 cm deep**. Stores do not vary much with season. Large seeds, which the ants cannot open until they germinate, make up ≥70% of store weight. The store does **not** keep the colony going when foraging stops: in starved colonies the seeds weren't used, workers burned their fat instead, and larvae died within ~7 days. I found no figure for how long a store would last.
- **Range:** 20 to 300,000 seeds
- **Unit:** seeds per colony
- **Status:** P. badius
- **Source(s):** Tschinkel 1999 AESA. Tschinkel 1999, *Ecol Entomol* 24:222–237 (full text). Tschinkel & Kwapich 2016. Smith 2007, *Behav Ecol Sociobiol* 61:1479–1487, doi:10.1007/s00265-007-0380-8 (via abstract).

### Q19. Carrying capacity against body weight; a worker's weight and length.
- **Answer:**
  - **Length:** workers are **6.35–9.5 mm** (1/4–3/8 inch) long, minor to major. This is a secondary figure (EDIS, citing a field guide).
  - **Head width (best supported):** colony mean for minors **1.15 mm** in incipient colonies, rising to **1.90 mm** in colonies of 7,000–8,000. Majors **~2.45–2.75 mm**. In Cole's 1968 morphometrics, minor head length is 1.60–2.05 mm and head width 1.52–2.01 mm.
  - **Mass:** lean dry mass of dark (older) minors is **2.01–2.35 mg** (lowest in July, highest in May and January). Fat on top of that varies by more than 85%, and foragers have <10% fat. I found no mean total dry mass in the text; it appears only in figures. Fresh mass: Couldn't find it.
  - **Polymorphism:** this is the only polymorphic Pogonomyrmex in North America. Majors are about 5–10% of workers.
  - **Carrying capacity:** Couldn't find a load-to-body-mass ratio. Stored seeds weigh on average **0.72 mg** (colonies <100 workers) to **2.00 mg** (large colonies). Foragers carry these one at a time, so a load is roughly 0.3–1× the worker's lean dry mass. This is my inference.
- **Status:** P. badius (head width, dry mass, seed mass). Length is secondary. Carrying ratio: Couldn't find it.
- **Source(s):** Tschinkel 1998 (full text, https://www.bio.fsu.edu/~tschink/publications/1998-4.pdf). Tschinkel 1999 AESA (seed weights). Cole 1968 (via AntWiki). EDIS IN536.
- **Disagreement:** Minor size depends on the colony: minors are ~40% larger in mature colonies. Major size barely changes.
- **Sim note:** Use minor ≈ 6–7 mm long, ~2.2 mg lean dry mass, HW ~1.8 mm. Use major ≈ 9 mm, HW ~2.6 mm. Carry 1 seed per trip.

### Q20. How long a worker survives without food.
- **Answer:** Couldn't find a value for adults. Larvae die in as little as **7 days** if the colony is prevented from foraging. Kwapich & Tschinkel (2016) ran starvation experiments, but the abstract gives no survival time.
- **Status:** Couldn't find it (adults). P. badius for larvae.
- **Source(s):** Tschinkel & Kwapich 2016 (full text, citing refs 13 and 15). Kwapich & Tschinkel 2016 (via abstract).

### Q21. Who opens or processes the seeds.
- **Answer:** Workers open seeds by repeatedly grinding them with their mandibles. Mandible teeth wear down with age. Workers **cannot open seeds wider than about 1–1.4 mm**, so larger seeds are stored until they germinate. **Majors raise the rate** at which small and medium seeds are opened, but they cannot open larger seeds than minors can. In lab tests, 80% of small and 60% of medium seeds were opened within about 6 days, and almost no large seeds within 12 days.
- **Status:** P. badius
- **Source(s):** Tschinkel & Kwapich 2016 (full text). Tschinkel & Domínguez 2017 (full text).

### Q22. How food is passed between ants and to larvae.
- **Answer:** Confirmed: Meurville & LeBoeuf's 2021 table lists P. badius as having **no trophallaxis**, with **larvae regurgitating liquid to adults**. Adults pass food to larvae as **solid seed chunks** and germinated seeds. P. barbatus has rare mouth-to-mouth exchange between adults.
- **Status:** P. badius
- **Source(s):** Meurville & LeBoeuf 2021, *Myrmecol News* 31:1–30, doi:10.25849/myrmecol.news_031:001. I read the supplementary table PDF, which cites Wilson 1987 and Tschinkel & Kwapich 2016. Tschinkel & Kwapich 2016.
- **Sim note:** No crop sharing between adults. Food reaches larvae as solid items carried down through the nest.

## D. Roles, sizes and ages

### Q23. The jobs in the colony and the rough share of workers in each.
- **Answer:** In summer, about **40% are foragers** and stay in the top 15 cm of the nest. About **25% are transfer workers**: they move seeds down, carry soil up, and later become foragers. The rest work mainly as brood and queen carers deep in the nest; 90% of workers below 70 cm were unmarked, meaning neither foragers nor transfer workers. Majors make up about 5–10%.
- **Status:** P. badius
- **Source(s):** Tschinkel & Hanley 2017, PLoS ONE 12:e0188630, doi:10.1371/journal.pone.0188630 (full text). Tschinkel 1998.

### Q24. Share of workers that forage; share idle at any moment.
- **Answer:** The share foraging changes through the year. It is 0 in winter, climbs in spring, and peaks at **0.37 (37%)** in summer; the dissertation and Tschinkel & Hanley give about 40%. Immature colonies have a higher share. Golley & Gentry found only ~10% active above ground over 2 weeks, using P-32 tagging. Share idle: Couldn't find it.
- **Status:** P. badius
- **Source(s):** Kwapich & Tschinkel 2013. Golley & Gentry 1964 (via abstract).
- **Sim note:** Forager count ≈ 1.6 × the number of larvae from May to October (Kwapich & Tschinkel 2013).

### Q25. Major workers (large-headed): what share they are, how big, and what they actually do.
- **Answer:** Majors are **~5–7% of workers**, rising to ~10% in July. Their share does not change with colony size. Head width is **~2.45–2.75 mm**, versus ~1.15–1.90 mm for minors. Their huge-headed mandibles wear blunt. **Role:** they speed up seed opening, but only for small and medium seeds. They are no more aggressive than other workers (Wheeler 1910, via EDIS). They have twice the ovarioles of minors and are the main male-egg layers when the colony loses its queen.
- **Status:** P. badius
- **Source(s):** Tschinkel 1998. Tschinkel 1999 AESA. Smith et al. 2007. Tschinkel & Kwapich 2016. Cole 1968 (via AntWiki). EDIS IN536.

### Q26. Does a worker's job change with age, and when does it start foraging?
- **Answer:** Yes. Jobs follow a strict sequence with age: brood and queen care deep in the nest, then general nest work and digging, then transfer worker, then guard or forager. Workers do not switch back, even when foragers are removed. Age at first foraging is **~43 days (SD 1.78) for summer-born workers** and **200–360 days for autumn-born workers**. Workers become foragers once their fat falls below 10%.
- **Range:** 43–360 days
- **Unit:** days of adult age
- **Status:** P. badius
- **Source(s):** Kwapich & Tschinkel 2013. Kwapich & Tschinkel 2016. Tschinkel 1998. Tschinkel & Hanley 2017.

### Q27. Where young workers, older workers, brood and the queen stay in the nest.
- **Answer:** Workers are sorted by age from the bottom of the nest to the top. **Queen:** 23 of 26 were in the bottom third and 17 in the very bottom chamber. **Brood and callows (newly emerged workers):** in the deepest chambers; less than 2% of brood is near the surface. **Older, darker workers:** move upward with age. **Foragers:** stay in the top ~12–15 cm. **Seeds:** stored 40–100 cm deep. Nests are 40–50 cm deep when young and **2.5–3 m** when mature. Workers sort themselves by age even in an artificial setup, possibly using the CO₂ gradient as a depth cue.
- **Status:** P. badius
- **Source(s):** Tschinkel 1999 *Ecol Entomol* 24:222–237 (full text, https://www.bio.fsu.edu/~tschink/publications/1999-7.pdf). Tschinkel 2004 *J Insect Sci* 4:21 (full text). Tschinkel & Hanley 2017. Kwapich & Tschinkel 2013.

---
## Status count
- P. badius (including partial or proxy answers): 21. Q1, 2, 4, 6, 7, 8, 11, 12, 13, 14, 15, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27
- BORROWED: 3. Q3 (P. barbatus, plus one secondary P. badius anecdote), Q9 (mixed: P. badius at maturity, P. barbatus for year 1), Q10 (P. barbatus)
- Couldn't find it (main value): 3. Q5, Q16 (only an energy proxy), Q20 (adults)

## References
- AntWiki. *Pogonomyrmex badius*. https://www.antwiki.org/wiki/Pogonomyrmex_badius
- Cole AC 1968. *Pogonomyrmex harvester ants*. Univ. Tennessee Press (via AntWiki).
- Golley FB & Gentry JB 1964. Bioenergetics of the southern harvester ant, *P. badius*. Ecology 45:217–225. doi:10.2307/1933834 (abstract)
- Gordon DM 1995. Anim Behav. https://web.stanford.edu/~dmgordon/previous/Gordon1995.pdf (snippet)
- Gordon DM 2024. The life history of harvester ant colonies. Phil Trans R Soc B 379:20230332. https://pubmed.ncbi.nlm.nih.gov/39463251/
- Gordon DM & Kulig AW 1996. Founding, foraging and fighting. Ecology. https://web.stanford.edu/~dmgordon/previous/GordonKulig1996.pdf
- Harrison JS & Gentry JB 1981. Ecology 62:1467–1473. doi:10.2307/1941503 (abstract; trails and exclusive foraging ranges, no numbers used)
- Kwapich CL & Tschinkel WR 2013. Demography, demand, death, and the seasonal allocation of labor in *P. badius*. Behav Ecol Sociobiol 67:2011–2027. doi:10.1007/s00265-013-1611-9. https://www.bio.fsu.edu/~tschink/publications/Kwapich%20and%20Tschinkel%20Pogonomyrmex%202013.pdf
- Kwapich CL & Tschinkel WR 2016. Limited flexibility and unusual longevity shape forager allocation in *P. badius*. Behav Ecol Sociobiol 70:221–235. doi:10.1007/s00265-015-2039-1 (abstract)
- Kwapich CL. FSU dissertation abstract. https://repository.lib.fsu.edu/islandora/object/fsu%3A252854
- Meurville M-P & LeBoeuf AC 2021. Trophallaxis… Myrmecol News 31:1–30. doi:10.25849/myrmecol.news_031:001 (supplement table)
- Smith CR 2007. Energy use and allocation in *P. badius*: are stored seeds a buffer? Behav Ecol Sociobiol 61:1479–1487. doi:10.1007/s00265-007-0380-8 (abstract)
- Smith CR, Schoenick C, Anderson KE, Gadau J, Suarez AV 2007. Insectes Soc 54:260–267. doi:10.1007/s00040-007-0940-y (abstract)
- Smith CR & Tschinkel WR 2006. Sociometry and sociogenesis of reproduction in *P. badius*. J Insect Sci 6:32. doi:10.1673/2006_06_32.1. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2990325/
- Smith CR & Tschinkel WR 2007. Non-food collection. Ecol Entomol 32:105–112. https://www.bio.fsu.edu/~tschink/publications/2007-1.pdf
- Tschinkel WR 1998. Worker characteristics… Insectes Soc 45:385–410. doi:10.1007/s000400050097. https://www.bio.fsu.edu/~tschink/publications/1998-4.pdf
- Tschinkel WR 1999a. Colony-level attributes… Ann Entomol Soc Am 92:80–89. https://www.bio.fsu.edu/~tschink/publications/1999-4.pdf
- Tschinkel WR 1999b. Distribution of workers, brood and seeds… Ecol Entomol 24:222–237. doi:10.1046/j.1365-2311.1999.00184.x. https://www.bio.fsu.edu/~tschink/publications/1999-7.pdf
- Tschinkel WR 2004. Nest architecture of *P. badius*. J Insect Sci 4:21. https://www.bio.fsu.edu/~tschink/publications/2004-2.pdf
- Tschinkel WR & Domínguez DJ 2017. Illustrated guide to seeds in *P. badius* nests. PLoS ONE 12:e0171419. doi:10.1371/journal.pone.0171419
- Tschinkel WR & Hanley N 2017. Vertical organization of the division of labor… PLoS ONE 12:e0188630. doi:10.1371/journal.pone.0188630
- Tschinkel WR & Kwapich CL 2016. *P. badius* relies on germination to consume large seeds. PLoS ONE 11:e0166907. doi:10.1371/journal.pone.0166907
- UF/IFAS EDIS EENY-298/IN536. Florida Harvester Ant. https://ask.ifas.ufl.edu/publication/IN536 (secondary)


---

# Pogonomyrmex badius (Florida harvester ant): biology facts for the ant-colony sim, Part 2 (Sections E–H)

Compiled 2026-10-10. Unless marked otherwise, all values are field data from north Florida (Apalachicola National Forest sandhill near Tallahassee). Status labels: **P. badius** = measured in this species. **BORROWED (species)** = taken from another Pogonomyrmex species. **Couldn't find it** = not located. "Full text" means I read the whole paper. "Via abstract" means I saw only the abstract.

---
## E. Foraging

### Q28. Distance travelled from the nest
- **Answer:** P. badius forages from short trunk trails that lead into a surrounding range that one colony uses almost exclusively (Harrison & Gentry 1981, via abstract; the abstract gives no distances). Researchers define a forager as an ant at least 150 cm beyond the edge of the nest mound (Kwapich & Tschinkel 2013, 2016). Field seed-choice tests placed baits at 1, 2, 5 and 10 m from the nest, and foragers collected them at all of those distances (Ferster & Traniello 1995, via abstract). Penning a colony in a 60 × 60 cm box was estimated to cut its foraging distance by about 80% (Kwapich & Tschinkel 2016, citing Harrison & Gentry). Nearest neighbours are about 15–17 m apart (Q56), which effectively caps the radius at about half that distance. For a measured trip distance, see the borrowed P. barbatus value: mean 5.36 ± 2.34 m, range 1.38–13.0 m (Beverly et al. 2009).
- **Range:** about 1.5 to about 10 m (P. badius, inferred from the studies above); 1.4–13 m (P. barbatus).
- **Unit:** m
- **Status:** P. badius (qualitative/partial) + BORROWED (P. barbatus) for the measured distribution
- **Source(s):** Harrison & Gentry 1981 Ecology 62:1467 (abstract); Ferster & Traniello 1995 Environ. Entomol. 24:673 (abstract); Kwapich & Tschinkel 2016 BES (full text); Beverly et al. 2009 Behav. Ecol. 20:633 (full text excerpt)
- **Sim note:** Give each colony a foraging radius of about 8 m with most trips in the 2–6 m band. Bias trail directions away from near neighbours.

### Q29. Walking speed
- **Answer:** I found no P. badius value. Return-trip (laden) travel velocity in other Pogonomyrmex species: P. rugosus 3.10 ± 0.34 m/min, P. maricopa 2.25 m/min, P. desertorum 2.96 m/min (range 1.29–3.95). In P. barbatus, trip time falls as surface temperature rises toward the critical thermal maximum (about 50 °C), so ants run faster when it is hot.
- **Range:** about 1.3–4.0 m/min laden (about 2–7 cm/s)
- **Unit:** m/min
- **Status:** BORROWED (P. rugosus / P. maricopa / P. desertorum)
- **Source(s):** Flanagan et al. 2012 "Quantifying the effect of colony size and food distribution on harvester ant foraging", PLoS ONE, PMC3393712 (table seen); P. barbatus temperature effect: Ecol. Entomol. 2022, doi:10.1111/een.13118 (abstract)
- **Sim note:** Use about 3 cm/s laden and somewhat faster unladen. Scale speed up with temperature.

### Q30. Length of one trip, and trips per forager per day (EXTRA CARE)
- **Answer:**
  - **Trip duration:** No measured P. badius value was found. **Best value (borrowed):** P. barbatus mean 13.1 ± 10.3 min, median 9.6 min, range 1.5–47.4 min (n = 110 field trips). Searching took about 56% of the trip, and trip length tracked search time, not distance. In other Pogonomyrmex species, round trips averaged about 7–20 min (P. desertorum mean 7.25 min, range 1.8–12.7; Flanagan et al. 2012).
  - **Trips per forager per day:** No measured value was found for P. badius. Kwapich & Tschinkel (2016) use "10 successful trips per day" only as an *illustrative assumption*, not a measurement. Treat about 10/day as a placeholder. Supporting constraint (P. badius, measured): foraging runs from the morning until about 1.5 h before sunset and pauses in extreme midday heat (Q34). That gives roughly 6–8 usable hours, and at about 10–15 min per trip that would allow up to about 25–40 trips/day. This ceiling is my own arithmetic, not a published figure.
- **Range:** 1.5–47 min per trip (P. barbatus); trips/day about 10 (assumption only)
- **Unit:** minutes; trips/forager/day
- **Status:** BORROWED (P. barbatus) for duration. Trips per day: Couldn't find a measured value (only an illustrative assumption in a P. badius paper).
- **Source(s):** Beverly, McLendon, Nacu, Holmes & Gordon 2009 "How site fidelity leads to individual differences in the foraging activity of harvester ants", Behav. Ecol. 20:633–638 (PDF https://web.stanford.edu/~dmgordon/previous/Beverly_etal2009.pdf, excerpt read); Kwapich & Tschinkel 2016 BES doi:10.1007/s00265-015-2039-1 (full text); Flanagan et al. 2012 PLoS ONE (PMC3393712)
- **Sim note:** Draw trip time from a right-skewed distribution (median about 10 min, mean about 13 min). Most of the time should be search, not travel. Cap trips per day at about 10.

### Q31. Alone or along shared trails; how others are recruited
- **Answer:** Both. Foragers leave on short trunk trails, then fan out and search individually (Harrison & Gentry 1981). For large items such as insect prey or clumped food, P. badius **recruits nestmates with a poison-gland trail**. The scout drags its extruded sting on the way home, and within seconds a group of **10–15 nestmates** runs out along the trail. About 10 ants had gathered at a cockroach after about 10 min (laboratory study). Dufour's-gland secretion serves as an orientation/home-range cue rather than a recruitment signal. Close-range **alarm pheromone (4-methyl-3-heptanone, mandibular gland)** attracts and excites workers within about 10 cm at struggling prey. AntWiki classes the species as a "mass recruiter".
- **Range:** 10–15 recruits per recruitment event
- **Unit:** ants
- **Status:** P. badius
- **Source(s):** Hölldobler & Wilson 1970 "Recruitment trails in the harvester ant Pogonomyrmex badius", Psyche 77:385–399, doi:10.1155/1970/38470 (full text, https://groups.csail.mit.edu/mac/projects/psyche/77/77-385.html); Harrison & Gentry 1981 (abstract); AntWiki
- **Sim note:** Default to solitary search from trunk trails. Use a pheromone trail only for large or clumped finds, and give it a short lifetime (Q32).

### Q32. How long a trail scent lasts
- **Answer:** The poison-gland (recruitment) trail was still more attractive than a Dufour's-gland trail after 10–15 min. After 25–30 min, ants significantly preferred the Dufour's trail, so the recruitment pheromone fades within roughly 15–30 min (laboratory arena, 50 cm artificial trails). The Dufour's-gland orientation cue lasts longer, but no duration was reported. Trunk trails themselves are physical, cleared paths that persist across seasons. Colonies also clear visible trails during nest moves.
- **Range:** about 10–30 min (recruitment pheromone)
- **Unit:** minutes
- **Status:** P. badius (laboratory)
- **Source(s):** Hölldobler & Wilson 1970 (full text); Tschinkel 2014 PLoS ONE (cleared trails)
- **Sim note:** Give recruitment pheromone a half-life of about 10–15 min. Make trunk-trail paths permanent map features.

### Q33. What decides whether a forager leaves the nest
- **Answer:** BORROWED from P. barbatus. An outgoing forager leaves faster when food-bearing foragers return more often, sensed through brief antennal contacts in a 5–10 cm entrance tunnel. Returns arrive as a Poisson process. Model: α_n = max(α_{n-1} − q·D_{n-1} + c·A_n − d, α_min); departures D_n ~ Poisson(α_n). Fitted parameters: q = 0.05, d = 0, baseline α_min about 0.01 ants/s, c fitted within 0.01–0.25 per colony. Observed foraging rates were 0.15–1.2 ants/s (field, New Mexico). Cuticular hydrocarbons carry the cue (Greene & Gordon 2003, 2007; cited, not read). P. badius-specific result: colonies did **not** move workers from other tasks into foraging when 50% of foragers were removed (Kwapich & Tschinkel 2013). P. badius also stops foraging in extreme heat, in heavy rain and late in the day (Q34).
- **Range:** baseline 0.01 ants/s; c 0.01–0.25
- **Unit:** ants/s
- **Status:** BORROWED (P. barbatus)
- **Source(s):** Prabhakar, Dektar & Gordon 2012 PLoS Comp Biol 8:e1002670, doi:10.1371/journal.pcbi.1002670 (full text); Kwapich & Tschinkel 2013 BES doi:10.1007/s00265-013-1611-9 (full text)
- **Sim note:** Implement the α equation directly. It is cheap and published.

### Q34. Hours of activity, and the surface temperatures at which they stop
- **Answer:** Foraging starts on warm mornings and stops about **1.5 h before sunset**. It pauses only in exceptionally hot, cloudless conditions or heavy rain (Kwapich & Tschinkel 2013). In one study the morning activity period ran from about 08:00 to about 15:00 (Gordon 1984). Nest-move traffic is diurnal: peaks in morning and afternoon, a dip at midday, and none after sundown. Moves were likely when the trail-surface **minimum was above about 25 °C and the maximum was below about 45 °C** (Tschinkel 2014; this is move traffic, used as a proxy for surface activity). Borrowed upper limit: P. barbatus CTmax is about 50 °C, with knock-down survival falling from 100% at 45 °C to 0% at 50 °C.
- **Range:** active at surface about 25–45 °C; stop at 45 °C or above (proxy); lethal about 50 °C (P. barbatus)
- **Unit:** °C (soil surface); clock hours
- **Status:** P. badius (hours, move temperatures) + BORROWED (P. barbatus) for CTmax
- **Source(s):** Kwapich & Tschinkel 2013; Tschinkel 2014 PLoS ONE doi:10.1371/journal.pone.0112981 (full text, Fig. 12); Gordon 1984 Ecol. Entomol. 9:403 (full text); doi:10.1111/een.13118 (abstract)

---
## F. The nest (from the casts)

### Q35. Total depth, mature nest and young colony (EXTRA CARE)
- **Answer:**
  - **Mature nest:** commonly **2.5–3.0 m** deep. The deepest cast was **3.06 m** (Tschinkel 2004).
  - **Young (incipient) colony:** the abstract says "usually **40 to 50 cm**", but the Results section says "Incipient nests were **29 to 37 cm** deep". This is an internal disagreement within the same paper. Use 30–50 cm as the range and about 40 cm as the best value.
  - **Depth vs. colony size:** depth scales with dark-worker number. log MaxDepth = 0.95 + 0.37 log(dark workers); a 10× larger colony is about 2.4× deeper.
  - **Cross-check:** 42 field nests of mixed sizes ranged **40–270 cm**, mean **135.8 cm** (SD 54.2) (Kwapich & Tschinkel 2013).
  - **Lab/field planted colony:** a planted colony dug to 2 m and 8 L within weeks (Tschinkel et al. 2015, via AntWiki abstract).
- **Range:** 29–50 cm (incipient); 40–270 cm (typical population); 250–306 cm (largest)
- **Unit:** cm
- **Status:** P. badius
- **Source(s):** Tschinkel 2004 J. Insect Sci. 4:21, doi:10.1093/jis/4.1.21, PMC528881 (full text); Kwapich & Tschinkel 2013 (full text); Tschinkel, Rink & Kwapich 2015 PLoS ONE doi:10.1371/journal.pone.0139922 (abstract via AntWiki)
- **Sim note:** Best values: about 40 cm for a founding colony, about 1.4 m for an average colony and about 2.5–3 m for a mature colony of about 5,000 workers. Use depth ∝ workers^0.37.

### Q36. Number of chambers and total chamber floor area
- **Answer:** A large cast had **135 chambers** (with 12 m of shafts). Excavated nests had up to about **150 chambers**. Total chamber area scales as log Area = 0.55 + 0.87 log(dark workers), so a 10× larger colony has about 7.5× the area. Top-decile area by size class 0–4 was 38, 190, 516, 1700 and 2670 cm². About half of the total area lies in the top quarter of the depth. I did not find a single total-area figure for a mature nest in the text I read. A rough inference only: if the top decile holds about 2700 cm², the whole nest is probably on the order of 1 m² or less. Treat that as a guess, not a datum.
- **Range:** 1 to about 150 chambers
- **Unit:** chambers; cm²
- **Status:** P. badius
- **Source(s):** Tschinkel 2004 (full text); Tschinkel 1999 Ann. Entomol. Soc. Am. 92:80 (full text PDF https://www.bio.fsu.edu/~tschink/publications/1999-4.pdf)

### Q37. Chamber shape and size, near the surface and deep down
- **Answer:** All chambers are about **1 cm high**, with flat floors and slightly domed ceilings.
  - **Superficial chambers (top 10–15 cm):** modified shafts that become looping, interconnected, lobed galleries. Mean area is **26 cm²** in the smallest colonies and about **330 cm²** in the largest.
  - **Deeper chambers:** start as circular niches on the outside of the helical shaft and become multi-lobed as they are enlarged. In the upper third, the perimeter is 2–7× that of a circle of equal area. Average chamber size is about **5–6× larger near the surface than near the bottom**. Each chamber in the first shaft series added about 98 cm² on average; later series added less (73, 57 and 43 cm²).
- **Range:** about 1 cm high; tens to hundreds of cm² of floor area
- **Unit:** cm, cm²
- **Status:** P. badius
- **Source(s):** Tschinkel 2004 (full text)

### Q38. How chamber size and spacing change with depth
- **Answer:** Vertical spacing grows from **2–4 cm** near the surface to **20–30 cm** deeper down. Maximum spacing is at 70–80% of maximum depth, after which it tightens slightly. Chamber area drops with depth: each 10% depth step holds **25–40% less area**. In log-log terms (slope −0.59), a 10× increase in depth means about 75% less area per decile. This "size-free shape" is the same at all colony sizes.
- **Range:** spacing 2–30 cm
- **Unit:** cm
- **Status:** P. badius
- **Source(s):** Tschinkel 2004 (full text)

### Q39. The shafts: how many, how wide, vertical or spiraling
- **Answer:** **Helical** shafts, spiralling left more often than right. The helix is **4–6 cm** in diameter. Shaft diameter averages a little under **1 cm**. Upper shafts are flattened "racetrack" ribbons up to about 2 cm wide. The descent angle is 20–30° from horizontal at the surface and 45–60° (up to about 70°) below about 50 cm. Length per turn is 8–10 cm near the top and about 20 cm deeper. There are **1–4 descending shaft series** (rarely 5), and branches always start less than 40 cm deep. Mean colony size by number of series: 1 series about 1,700 workers, 2 about 3,200, 3 about 4,600, 4 about 5,000.
- **Range:** 1–4 shafts; 0.8–2 cm wide
- **Unit:** count; cm
- **Status:** P. badius
- **Source(s):** Tschinkel 2004 (full text)

### Q40. Number of entrances
- **Answer:** Usually **1**; sometimes 2–3.
- **Range:** 1–3
- **Unit:** entrances
- **Status:** P. badius
- **Source(s):** Tschinkel 2004 (full text)

### Q41. What is kept at each depth
- **Answer:**
  - **Foragers (oldest workers):** at the top. 96% of marked foragers were within the top 20 cm, and in 5 chamber-sorted nests none was deeper than 12 cm.
  - **Seeds:** in chambers **40–100 cm** deep (Tschinkel 2004, citing 1999), or **20–80 cm** (Tschinkel et al. 2015). Foragers drop seeds in the topmost chambers, and a separate group carries them down.
  - **Brood and callows:** in the **bottom third**. Worker density rises sharply with depth, and workers move upward as they age.
  - **CO₂:** about 5× higher at the bottom than at the surface. CO₂ may be the depth cue.
- **Unit:** cm
- **Status:** P. badius
- **Source(s):** Tschinkel 2004; Kwapich & Tschinkel 2013; Tschinkel et al. 2015 (abstract via AntWiki)

### Q42. How nest size grows with colony size
- **Answer:** Area ∝ (dark workers)^0.87, so a 10× larger colony has about 7.5× the area and less floor area per ant. Depth ∝ (dark workers)^0.37, so a 10× larger colony is about 2.4× deeper. Nests grow by deepening, enlarging chambers (the main contributor) and adding shaft series, all at the same time. Shape and spacing are conserved. Sand removed ranges from about **40 g** (incipient nest) to about **40 kg** (largest). Surface disc area also predicts colony size: log workers = −0.44 + 1.20 log(disc area) (Tschinkel 2014).
- **Status:** P. badius
- **Source(s):** Tschinkel 2004; Tschinkel 2014

### Q43. How fast they dig, and how long a whole nest takes
- **Answer:** Old workers dig about **0.45 cm² of chamber and 0.13 cm of shaft per worker per day**. Young workers dig 0.15 cm² and 0.06 cm (field pens of 125–250 workers). An average worker removes about **300–400× its body weight in sand per day** while digging. Any colony can dig a complete nest in **3–6 days**. Example: about 5,000 workers moved about 20 kg of sand in 4–5 days. In a planted colony, most excavation was done in about 2 weeks (2 m deep, 8 L), and the volume doubled again after a winter lull. Diggers are a consistent subset: 82% of old workers dig versus 19% of young.
- **Range:** 3–6 days (whole nest), about 2 weeks (planted colony)
- **Unit:** cm²/worker/day; days
- **Status:** P. badius (field)
- **Source(s):** Tschinkel 2004; Tschinkel et al. 2015 (abstract via AntWiki)

### Q44. Nest moves: how often, how far, which season, how long
- **Answer:** On average about **1 move per year**. Individual colonies ranged from 1 move in 2 years to 4 moves a year. Moves happen **May–November** and peak in **July**, when more than 1% of colonies move per day. The mean distance is about **4 m** (4.1 m, n = 811), and few moves exceed 10 m. Direction is random, so repeated moves form a random walk. A move takes **4–6 days** (up to 8 days). Moves happen only in daylight. About 22% of moving workers carry something: 80% of loads are seeds, 13% brood and 7% charcoal. Colonies that moved more than once in 2 years lost size. Moves follow a foraging trail (Harrison & Gentry 1981).
- **Range:** 0.5–4 moves/yr; mostly under 10 m; 4–8 days
- **Status:** P. badius (field)
- **Source(s):** Tschinkel 2014 PLoS ONE (full text); Harrison & Gentry 1981 (abstract)

### Q45. The surface disc: its size, and the charcoal they cover it with
- **Answer:** The excavated-sand disc is covered with charcoal bits, mostly the burned tips of pine needles. A typical disc is about **0.6 m** in diameter with **about 200 g** of charcoal, roughly 1 cm deep (the values used to mimic an average nest in experiments). Objects can number in the **millions**. Disc area scales with colony size (Q42). Ants rebuilt removed middens within **7 days** (Gordon 1984). Function is debated:
  - Gordon 1984: charcoal acts as a boundary that deters other ant species.
  - Smith & Tschinkel 2007: found no deterrence and no effect on hydrology. Charcoal slightly warms the top soil (differences under 1 °C to about 2 °C, only in the top few cm to 16 cm). Sexual investment did not differ significantly.
  - Abandoned "ghost" discs stay visible for months to years.
- **Range:** about 0.6 m diameter; about 200 g charcoal
- **Unit:** m; g
- **Status:** P. badius
- **Source(s):** Smith & Tschinkel 2007 Ecol. Entomol. 32:105 (full text PDF https://www.bio.fsu.edu/~tschink/publications/2007-2.pdf); Gordon 1984 Ecol. Entomol. 9:403 (full text); Tschinkel 2014

### Q46. Where the dead and the rubbish go
- **Answer:** Dead ants are usually carried **up to 6 m** beyond the nest yard and dropped; they are rarely seen on the midden (Gordon 1984, personal observation). Seed husks (e.g., Panicum) form a separate husk midden on or near the mound, alongside the charcoal midden. Excavated sand is dumped around the entrance to form the disc.
- **Range:** up to 6 m
- **Unit:** m
- **Status:** P. badius
- **Source(s):** Gordon 1984 (full text)

---
## G. Environment (Florida sandhill)

### Q47. Soil type and why it matters for digging
- **Answer:** Deep, homogeneous, **excessively drained sand** in longleaf/turkey-oak sandhill. There are "no stones, barriers or layers of varying resistance", so nest shape reflects the ants' own digging rules. Wet sand holds shafts open, and a planted colony's casts showed sand mixing between layers (Tschinkel et al. 2015).
- **Status:** P. badius
- **Source(s):** Tschinkel 2004; Tschinkel 2017 Insectes Soc. 64:285, doi:10.1007/s00040-017-0544-0 (full text)
- **Sim note:** Uniform diggable medium. No obstacles are needed.

### Q48. Temperature range for activity, and the temperature brood is kept at
- **Answer:** Surface activity: see Q34 (about 25–45 °C proxy; about 50 °C lethal, borrowed). **Brood temperature: Couldn't find it.** No measured brood-chamber temperature was found for P. badius. Related facts: brood sits in the deep, thermally buffered bottom third (Q41). Tschinkel (2004) speculates that the shallow chambers, which have the largest daily temperature swings, may matter for brood in cool months. Laboratory foragers were held at 26 °C (Kwapich & Tschinkel 2016; a housing condition, not a preference).
- **Status:** P. badius (activity) / Couldn't find it (brood temperature). Searched Tschinkel 2004, 1999, Kwapich 2013/2016 and Smith & Tschinkel 2007.

### Q49. What they do in winter
- **Answer:** No surface foraging from about **December to February**. Foraging falls to zero in December and resumes in **March or April**. Colonies overwinter **without brood**. Brood production is limited to May–September. Workers born in autumn (late August to mid-October) develop slowly, overwinter, and form the forager force from March to July. Colonies draw on fat reserves (and stored seeds) to overwinter and to produce sexuals in early spring. Worker density in the nest peaks in autumn and winter.
- **Status:** P. badius
- **Source(s):** Kwapich & Tschinkel 2013; Tschinkel 1999 Ann. ESA 92:80 (full text)

### Q50. Effect of rain and drought
- **Answer:** Heavy rain pauses foraging (Kwapich & Tschinkel 2013). Charcoal did not change how simulated heavy rain infiltrated the soil (Smith & Tschinkel 2007). **Drought effect: Couldn't find it.** No P. badius drought data were located. The excessively drained sand dries quickly.
- **Status:** P. badius (rain) / Couldn't find it (drought)

### Q51. A month-by-month calendar of activity and brood
- **Answer:** Assembled from several P. badius sources; no single published table was found.
  - **Dec–Feb:** dormant. No foraging and no brood.
  - **Mar–Apr:** foraging resumes. Sexuals (alates) are reared in early spring before any workers, only in colonies with more than 2,500 workers. Colony size falls as overwintered workers die without replacement.
  - **May–Jun:** worker brood begins (May). Mating flights May–July, with records in June. First callows in June. Nest moves start (May).
  - **Jul:** peak foraging, with up to 35–41% of workers foraging. Peak larvae. Peak nest moves.
  - **Aug–Sep:** worker brood continues through September. Slow-developing autumn workers are produced from late August to mid-October. Forager replacement falls in September and October.
  - **Oct–Nov:** foraging declines. Death rate halves by November. Moves end in November.
- **Status:** P. badius (compiled)
- **Source(s):** Kwapich & Tschinkel 2013, 2016; Tschinkel 1999; Tschinkel 2014; AntWiki flight table (May–Jul) and Cole 1968 (via AntWiki)

---
## H. Death and danger

### Q52. Main predators and enemies, including neighboring colonies
- **Answer:**
  - Mound-visiting **assassin bugs (Apiomerus)**.
  - **Lizards** (cited as a source of forager mortality).
  - **Neighbouring P. badius colonies:** fatal fights are frequent during peak foraging in spring and early summer. Foragers are seen carrying a decapitated rival head clamped to the petiole.
  - **Other ant species** invading the mound, e.g. Conomyrma (Dorymyrmex) flavopecta, which carried off dead or injured P. badius.
  - **Kapala floridana:** a parasitoid eucharitid wasp.
  - **Myrmicinosporidium durum:** a fungal pathogen.
  - **Hymenorus dorsalis:** a kleptoparasitic beetle larva in the nests.
  - Heat and desiccation.
- **Status:** P. badius
- **Source(s):** Kwapich & Tschinkel 2013, 2016 (full text); Gordon 1984 (full text); AntWiki (associates); Kwapich et al. 2024 Insectes Soc. 72:303, doi:10.1007/s00040-024-01014-w (title via AntWiki)

### Q53. Death rate of foragers per day
- **Answer:** **3.7% of foragers per day** (range **3.0–4.9%**, n = 29 colonies, May–October). The whole forager force turns over about every **27 days**. Separately, Kwapich & Tschinkel (2013) report 3.35% per day (SD 1.32). Foragers survive about 38 days (March–July, autumn-born) or about 27 days (after July). Forager numbers fell when mortality exceeded about 4% per day. By November the death rate halves.
- **Range:** 3.0–4.9
- **Unit:** % of foragers per day
- **Status:** P. badius (field)
- **Source(s):** Kwapich & Tschinkel 2016 BES (full text); Kwapich & Tschinkel 2013 (full text)

### Q54. How the colony reacts to an attack
- **Response to struggling prey:** alarm pheromone (4-methyl-3-heptanone) attracts and excites workers within about 10 cm (Hölldobler & Wilson 1970).
- **Response to mound invaders:** when other ant species invade the mound, patrolling and defensive behaviour increase (Gordon 1984).
- **Response to steady forager loss (field experiment):** removing **50 foragers/day** for 23 weeks caused:
  - Above-ground activity dropped drastically within a week.
  - Then 3 weeks or more of complete surface inactivity.
  - Craters shrank or vanished.
  - Entrances were moved under grass clumps and covered with leaves.
  - Intercolony conflicts became common.
  - Total ant production rose, and colonies recovered by midsummer the following year.

  Removing 10 foragers/day had no visible effect (Gentry 1974, via abstract).
- **50% forager removal:** colonies did not reassign other workers to foraging, at the cost of larval survival (Kwapich & Tschinkel 2013).
- **Status:** P. badius
- **Source(s):** Gentry 1974 Ecology 55:1328–1338, doi:10.2307/1935460 (abstract); Gordon 1984; Hölldobler & Wilson 1970; Kwapich & Tschinkel 2013

### Q55. Usual causes of colony death, and first-year survival of new colonies
- **Answer:** Annual colony mortality falls with colony size: about **25%/yr for the smallest colonies** and about **6%/yr for mid-sized** colonies. Implied lifespans are about 4 and about 17 years. Large colonies probably live 30 years or more (over 90% were still alive after 6 years). Colonies with more or larger neighbours had moderately higher mortality, and the effect grew with size asymmetry. Colonies averaged about 2,500 workers (range under 500 to 10,000). Specific causes of death were not identified. Relocating more than once in 2 years costs colony size (Tschinkel 2014). **First-year survival of founding queens/incipient colonies: Couldn't find it** for P. badius. I searched Tschinkel 2017 and general web search; the general claim that up to 99% of Pogonomyrmex foundresses fail was seen only in a search summary and was not verified.
- **Range:** 6–25
- **Unit:** % colonies dying per year
- **Status:** P. badius (established colonies) / Couldn't find it (first-year founding survival)
- **Source(s):** Tschinkel 2017 Insectes Soc. 64:285 (full text PDF https://www.bio.fsu.edu/Tschinkel/10%20Lifespan,%20age%20specific%20mortality%20in%20P.%20badius%20Insectes%20Soc%202017.pdf)

### Q56. Distance between neighboring nests, and whether neighbors fight
- **Answer:** Mean distance to the 1st, 2nd and 3rd neighbours is **14.6, 18.4 and 22 m** (Tschinkel 2014). The observed nearest-neighbour mean is **16.8 m**, about 16 m (Tschinkel 2017). Colonies are clumped at the population scale. Foraging ranges are **not actively defended** but are used almost exclusively by one colony, and trails point away from neighbours (Harrison & Gentry 1981). Even so, **fatal fights between neighbours are frequent** in spring and early summer (Kwapich & Tschinkel 2013). Fights become common when colonies are stressed (Gentry 1974).
- **Range:** 14.6–22
- **Unit:** m
- **Status:** P. badius
- **Source(s):** Tschinkel 2014; Tschinkel 2017; Harrison & Gentry 1981 (abstract); Kwapich & Tschinkel 2013

---
## References (all URLs/DOIs visited or confirmed in search results)
1. Tschinkel WR 2004. The nest architecture of the Florida harvester ant, Pogonomyrmex badius. J. Insect Sci. 4:21. doi:10.1093/jis/4.1.21. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC528881/ (full text)
2. Tschinkel WR 2014. Nest relocation and excavation in the Florida harvester ant, Pogonomyrmex badius. PLoS ONE 9:e112981. https://doi.org/10.1371/journal.pone.0112981 (full text)
3. Tschinkel WR, Rink WJ, Kwapich CL 2015. Sequential subterranean transport of excavated sand and foraged seeds in nests of the harvester ant, P. badius. PLoS ONE. doi:10.1371/journal.pone.0139922 (abstract via AntWiki)
4. Tschinkel WR 2017. Lifespan, age, size-specific mortality and dispersion of colonies of the Florida harvester ant. Insectes Soc. 64:285–296. doi:10.1007/s00040-017-0544-0 (full text PDF via bio.fsu.edu)
5. Tschinkel WR 1999. Sociometry and sociogenesis of colony-level attributes of the Florida harvester ant. Ann. Entomol. Soc. Am. 92:80. https://www.bio.fsu.edu/~tschink/publications/1999-4.pdf (full text)
6. Kwapich CL, Tschinkel WR 2013. Demography, demand, death, and the seasonal allocation of labor in the Florida harvester ant. Behav. Ecol. Sociobiol. doi:10.1007/s00265-013-1611-9. https://www.christinakwapich.com/_files/ugd/b09313_acd52a0bc4ed4b5086576f3ebfe3c1d6.pdf (full text)
7. Kwapich CL, Tschinkel WR 2016. Limited flexibility and unusual longevity shape forager allocation in the Florida harvester ant. Behav. Ecol. Sociobiol. doi:10.1007/s00265-015-2039-1. https://www.christinakwapich.com/_files/ugd/b09313_11f9ee47b35b413780c413054977b584.pdf (full text)
8. Smith CR, Tschinkel WR 2007. The adaptive nature of non-food collection for the Florida harvester ant. Ecol. Entomol. 32:105–112. https://www.bio.fsu.edu/~tschink/publications/2007-2.pdf (full text)
9. Gordon DM 1984. The harvester ant (Pogonomyrmex badius) midden: refuse or boundary? Ecol. Entomol. 9:403–412. https://web.stanford.edu/~dmgordon/previous/Gordon1984Harvester.pdf (full text)
10. Hölldobler B, Wilson EO 1970. Recruitment trails in the harvester ant Pogonomyrmex badius. Psyche 77:385–399. doi:10.1155/1970/38470. https://groups.csail.mit.edu/mac/projects/psyche/77/77-385.html (full text)
11. Harrison JS, Gentry JB 1981. Foraging pattern, colony distribution, and foraging range of the Florida harvester ant. Ecology 62:1467–1473. https://doi.org/10.2307/1941503 (abstract only)
12. Gentry JB 1974. Response to predation by colonies of the Florida harvester ant. Ecology 55:1328–1338. https://doi.org/10.2307/1935460 (abstract only)
13. Ferster B, Traniello JFA 1995. Polymorphism and foraging behavior in P. badius. Environ. Entomol. 24:673–678. https://doi.org/10.1093/ee/24.3.673 (abstract only)
14. Prabhakar B, Dektar KN, Gordon DM 2012. The regulation of ant colony foraging activity without spatial information. PLoS Comput. Biol. 8:e1002670. https://doi.org/10.1371/journal.pcbi.1002670 (full text), P. barbatus
15. Beverly BD, McLendon H, Nacu S, Holmes S, Gordon DM 2009. How site fidelity leads to individual differences in the foraging activity of harvester ants. Behav. Ecol. 20:633–638. https://web.stanford.edu/~dmgordon/previous/Beverly_etal2009.pdf (results excerpt), P. barbatus
16. Flanagan TP, Letendre K, Burnside WR, Fricke GM, Moses ME 2012. Quantifying the effect of colony size and food distribution on harvester ant foraging. PLoS ONE. https://pmc.ncbi.nlm.nih.gov/articles/PMC3393712/ (table excerpt), P. rugosus/maricopa/desertorum
17. Thermal tolerance regulates foraging behaviour of ants (P. barbatus), Ecol. Entomol. 2022. https://doi.org/10.1111/een.13118 (abstract only)
18. AntWiki: Pogonomyrmex badius. https://www.antwiki.org/wiki/Pogonomyrmex_badius (visited)

Not consulted directly: Golley & Gentry 1964 (energetics), Tschinkel 2021 *Ant Architecture*, Gordon 1999 *Ants at Work*, Gordon & Kulig 1996 (cited only via Prabhakar et al. 2012).
