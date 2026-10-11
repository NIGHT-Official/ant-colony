# Colony Founding: Florida Harvester Ant (*Pogonomyrmex badius*)

*Dated 2026-10-11. Written for Brandon's ant-farm sim.*
Labels: **P. badius** = measured in this species. **BORROWED (species)** = taken from a related Pogonomyrmex species. **Couldn't find it** = no source found. **via abstract** = only the abstract or a search snippet was read, not the full text. **DATA** = taken from a source. **DESIGN** = my choice for the sim.

Earlier files this builds on: `part1_A-D.md` (Q7, Q13), `Nest-Excavation.md`, `Pellets-and-Entrance-Closing.md`.

---

## Short Q&A: Brandon's six questions

**1. How deep and wide are the founding tunnel and chamber, and how long does the queen take to dig them?**
**Couldn't find it** for P. badius: nobody has excavated a fresh founding cell of this species. **BORROWED (P. rugosus, fully claustral, lab sand columns):** total depth averaged **17.1 cm** (range 6.25–19 cm, n = 42). Depth was 9.3 cm after day 1, 14.3 cm after day 2 and 16.3 cm after day 3. 83% of nests reached the 19 cm bottom of the container, so the true natural depth is probably deeper. Most queens reached full depth in **about 3 days**. The nests were deep with little branching, and claustral queens closed their entrances most often (Enzmann & Nonacs 2010). Chamber width: **Couldn't find it** (DESIGN: roughly 1.5–2 queen lengths).

**2. First brood: how many eggs, how many first workers (nanitics), and how long until the first one emerges?**
- Eggs: **Couldn't find it** for P. badius.
- **BORROWED (genus-level talk abstract, Johnson 2004 ESA, via abstract):** the first brood is **about 5 minims** across Pogonomyrmex species.
- First worker emerges: **BORROWED (P. californicus, lab):** about **34–36 days** (Frontiers 2022 study) and a mean of **40 days** (Social-dynamics study; time to first worker did not change with the number of queens).
- **P. badius estimate:** about **38+ days** from egg to adult (25 d larva + 14 d pupa as field estimates, Enzmann et al. 2014 citing Smith & Tschinkel 2006).
- Best figure for the sim: **about 40–50 days after sealing**, counting the time to dig and the first egg.

**3. Nanitics: how much smaller are they, how long do they live, and how soon do they open the nest and forage?**
- Size: **Couldn't find it** for P. badius. Across Pogonomyrmex, minim size varies far less than queen size (Johnson 2004 abstract, BORROWED). P. badius workers are polymorphic, so nanitics should be at the small end of the minor range (DESIGN).
- Lifespan: **Couldn't find it**. **BORROWED (P. barbatus):** workers live about 1 year (Gordon & Kulig 1996, citing Gordon & Hölldobler 1988). Nanitic lifespan was not measured.
- When they open the nest: **Couldn't find it**. DESIGN: within a few days of emerging.

**4. Queen reserves: how long can she last sealed in, and what if the first workers come too late?**
- **P. badius:** gyne fat is **37%** of dry weight (Smith & Tschinkel 2006). Gynes are about 73% heavier (wet) than *P. salinus* gynes and about 77% heavier (dry) than *P. californicus* gynes. Claustral founding costs about **70% more energy** than semi-claustral founding (Enzmann, Gibbs & Nonacs 2014).
- **BORROWED (genus, via abstract):** rearing about 5 minims uses about **13% of body mass for large queens** and **39% for small queens** (Johnson 2004 ESA). So a large claustral queen like P. badius has a big margin.
- **BORROWED (P. californicus):** queens fed during founding lost about 50% less mass than unfed queens (Johnson 2004 Anim Behav).
- Maximum time sealed: **Couldn't find it**. If workers come too late: **Couldn't find it** (no study). DESIGN: the queen's reserve drains each day. When it runs out, she eats eggs or larvae first and then dies.

**5. Survival: what share of queens fail, and at which stage?**
- **BORROWED (P. barbatus):** about **99%** mortality from mated queen to 1-year-old colony. Many queens are eaten by lizards and birds after the flight. After the first year, mortality is "extremely low" (Gordon & Kulig 1996).
- **BORROWED (P. occidentalis):** of 611 queens seen digging, **29%** were alive on 21 Aug, **7%** at the October census, and **0%** the next May. Larger queens survived better (Wiernasz & Cole 2003; numbers from a full-text search snippet, not re-read).
- Rates up to 99% have also been reported for other harvester ants (Pfennig 1995; Johnson 2001, as cited in Enzmann & Nonacs 2010).

**6. First-year growth: how does the founding chamber become the 30–50 cm incipient nest?**
Short answer: **not observed in any study.** The best inference is that the colony **relocates** to a freshly dug nest rather than slowly enlarging the founding cell. That move probably happens once there are tens of workers, likely in the first full season (spring–summer of year 2), and possibly in late year 1. Evidence and the sim recommendation are in the section below.

---

## Summary
- P. badius founds colonies with **one queen** (haplometrosis). Mature colonies always have a single queen (Smith & Tschinkel 2006, authors' observations). Founding is **fully claustral**: Enzmann et al. 2014 class P. badius as claustral (source: C. R. Smith, pers. comm.). Supporting evidence is the large, fat gyne (37% fat). One secondary web source claims temporary pleometrosis (several queens founding together); I found no primary source for it.
- Mating: queens mate many times. Rheindt et al. 2004 report the **highest numerical mating frequency recorded in ants** (via abstract; I could not access the exact numbers). Unlike the lek-mating western species, P. badius mating aggregations "**at least occur at nests**" (Harmon 1993; Smith & Tschinkel 2006).
- Flights happen in **June**, near the solstice, after the first heavy summer rain. The rain-triggered window is about **49 days** (Enzmann et al. 2014, citing Smith & Tschinkel 2006).
- Most founding numbers (cell depth, brood size, survival) are BORROWED from P. rugosus, P. barbatus, P. occidentalis and P. californicus.

## Answers by topic (the original six FIND items)

### 1. Mating flight
| Item | Value | Status / Source |
|---|---|---|
| Season | June, near the solstice, after heavy rain. Flights listed for May–July. | P. badius: Smith & Tschinkel 2006; Tschinkel 1999 |
| Rain window | about 49 days | P. badius: Enzmann et al. 2014 citing Smith & Tschinkel 2006 |
| Time of day | Conflicting reports. Encyclopedia of Life (Wikipedia-derived): "calm, sunny and humid mornings following a day of heavy rains". A hobbyist blog gives mid-afternoon for the genus. One AntFlights record is at 22:28. | Secondary only. No primary figure found. |
| Mating location | Aggregations at nests. EOL says males fly to other nests and mate on the parent nest disk, and that queens mate over several days (secondary). | P. badius: Harmon 1993 (via Smith & Tschinkel 2006); EOL |
| Leks in other species | Species-specific mating sites, often marked by male mandibular-gland secretions; males scramble for queens | BORROWED (P. barbatus, P. rugosus): Hölldobler 1976 (via abstract/summary) |
| Mates per queen | "Highest numerical mating frequencies thus far recorded in ants." Exact count: **Couldn't find it.** | P. badius: Rheindt et al. 2004 (via abstract) |
| Distance queens fly | **Couldn't find it.** For P. barbatus it is not known how far queens disperse after mating. | Gordon & Kulig 1996 |

### 2. Dealation and choosing a site
- Mated queens fly away, drop their wings and dig a nest. They seem to disperse at random, so neighbouring colonies are not related (BORROWED, P. barbatus, Gordon & Kulig 1996). EOL says P. badius queens may also walk away from the parent nest (secondary).
- Timing of wing loss: **Couldn't find it.** DESIGN: within 1 hour of landing.
- Site choice: 1-year-old P. barbatus colonies are most likely to be near **small (2–3 yr) neighbours** and less likely near large ones. The authors attribute this to competition for seeds, not to fighting (Gordon & Kulig 1996). Whether established colonies kill foundresses: fights are brief and rarely fatal; direct killing of foundresses was **not shown**.

### 3. Founding chamber
See Q&A item 1 (P. rugosus data). Within each species, depth did not depend on the queen's mass. Semi-claustral *P. californicus* dug shallow, branched nests (mean 5.1 cm), often with 2 entrances, and left them open so the queen could forage (Enzmann & Nonacs 2010). **Claustral vs semi-claustral:** large southern species are claustral and small northern species forage (Johnson 2004 ESA, via abstract). P. badius is the large claustral type (73–77% heavier gynes, 37% fat, classed claustral). Verdict: **claustral (moderate confidence)**.

### 4. First brood and overwintering
See Q&A items 2–4. Overwintering: the P. badius queen stops laying before October, and brood is absent from November to March (Tschinkel 1999; Smith & Tschinkel 2006). A June foundress whose first workers emerge about 6–7 weeks later (late July–August) has some foraging season left. The colony then overwinters with a small number of workers and **no brood** (inference). The one incipient colony excavated held **20 seeds** (Tschinkel 2004), so first-year foraging does happen.

### 5. Survival and pleometrosis
See Q&A item 5. Pleometrosis (several queens founding together) does occur in some *P. californicus* populations, where queens stay together as primary polygyny (Johnson 2004). In P. badius, founding is solo only (Smith & Tschinkel 2006).

### 6. Early growth
| Item | Value | Source |
|---|---|---|
| Smallest P. badius colony class | <100 workers | P. badius: Tschinkel 1999/2004 |
| Sexual production threshold | about 700+ workers (EOL, secondary). Smith & Tschinkel 2006 report a size threshold; check that paper for the exact figure. | P. badius (partial) |
| P. barbatus growth | about 3,000 workers at 2 yr; 4,000–8,000 at 3–4 yr; first reproduction at about 5 yr; stable size about 10,000–12,000 | BORROWED (P. barbatus): Gordon & Kulig 1996 |
| Workers at end of year 1 | **Couldn't find it** | — |

---

## How the founding cell becomes the incipient nest (Brandon's item 6)

**What we know**
1. "**No colony occupies an enlargement of its founding nest.**" Each nest is the "intentional" result of a short burst of digging (3–6 days), not of long-term growth (Tschinkel 2004, **P. badius**).
2. Colonies move about **once a year on average**, about 4 m each time. Small colonies grow between moves (Tschinkel 2014, **P. badius**).
3. Incipient nests (smallest colonies) are **29–37 cm** deep (Results) or "usually 40–50 cm" (Abstract). They have 1 shaft and a few chambers, and about 40 g of sand has been removed. They are a scaled-down version of the mature nest plan (Tschinkel 2004).
4. A claustral Pogonomyrmex queen digs about 17+ cm in about 3 days (BORROWED, P. rugosus).
5. Nobody has watched the founding-cell → incipient-nest transition (**Couldn't find it**).

**Best inference.** Tschinkel's statement covers all excavated colonies, including incipient ones. The 29–50 cm incipient nests he dug were therefore **new nests the colony moved into**, not enlarged founding cells. The founding cell is probably shallower: the P. rugosus analogue is about 17–20+ cm. A move in late summer or autumn of year 1 is possible, since the excavated colony with 20 seeds is consistent with active foragers. Given annual moves, the most likely first move is during **the colony's first full active season (year 2, spring–summer)**. Some bit-by-bit enlargement of the founding cell before that move is likely: a few workers can extend it slightly. There is no data for this, so treat it as DESIGN.

**Sim recommendation.** The founding cell (1 short tunnel plus 1 chamber, about 15–25 cm) is enlarged slowly by nanitics (DESIGN: at most about 1 small chamber added). Trigger the first **relocation** when the colony has about 30–100 workers and the season is warm. Prefer late spring of year 2; allow a chance in late year 1. The colony digs a new 30–50 cm nest with 1 shaft and a few chambers in 3–6 days, then moves along a trail carrying seeds, brood and the queen (move mechanics in Nest-Excavation.md). This matches every P. badius observation and contradicts none.

---

## Timeline (June founding, P. badius unless noted)
| Day | Event | Basis |
|---|---|---|
| 0 | Heavy rain; flight (morning or afternoon, unsure); mating at nest aggregations, many mates | DATA (P. badius) + uncertain time |
| 0 | Wings dropped, search for a site (minutes to hours) | DESIGN |
| 0–3 | Dig a single shaft about 17+ cm deep, then seal the entrance | BORROWED (P. rugosus) |
| about 3–7 | First eggs | DESIGN |
| about 40–50 | First nanitics (about 5) emerge | BORROWED (P. californicus timing; genus brood size) + P. badius 38-day estimate |
| about 45–55 | Nest opened; foraging begins (seeds stored; 20 seeds seen in one incipient nest) | DESIGN + DATA |
| Oct | Laying stops; overwinter with no brood | DATA (P. badius colony cycle) |
| Year 2 spring–summer (possibly late year 1) | First relocation to a new 30–50 cm nest | Inference (Tschinkel 2004, 2014) |
| Year 2–5 | Growth to the sexual-production threshold | BORROWED (P. barbatus: about 5 yr) |

## Key numbers
| Parameter | Value | Unit | Status | Source |
|---|---|---|---|---|
| Gyne fat | 37 | % dry wt | P. badius | Smith & Tschinkel 2006 |
| Founding cell depth | 17.1 (6.25–19, container-limited) | cm | BORROWED P. rugosus | Enzmann & Nonacs 2010 |
| Digging time | about 3 | days | BORROWED P. rugosus | same |
| First brood size | about 5 | minims | BORROWED genus (via abstract) | Johnson 2004 ESA |
| Body mass used for first brood | 13 (large queens) / 39 (small queens) | % | BORROWED genus (via abstract) | same |
| Egg→adult | about 38+ (larva 25, pupa 14) | days | P. badius estimate | Enzmann et al. 2014; Smith & Tschinkel 2006 |
| Founding → first worker | 34–40 | days | BORROWED P. californicus | Johnson lab studies; Frontiers 2022 |
| Mortality, queen → 1-yr colony | about 99 | % | BORROWED P. barbatus | Gordon & Kulig 1996 |
| Diggers alive at Aug / Oct / next May | 29 / 7 / 0 | % | BORROWED P. occidentalis | Wiernasz & Cole 2003 |
| Incipient nest | 29–50 deep, about 40 g sand | cm | P. badius | Tschinkel 2004 |
| Relocation frequency | about 1/yr, about 4 m | — | P. badius | Tschinkel 2014 |
| Colony size, yr 2 | about 3,000 | workers | BORROWED P. barbatus | Gordon & Kulig 1996 |
| First sexuals | about 5 yr (P. barbatus); about 700+ workers (P. badius, secondary) | — | mixed | Gordon & Kulig 1996; EOL |

## Sim notes: founding state machine
`FLIGHT → DEALATE → SEARCH → DIG → SEAL → EGGS → LARVAE → PUPAE → NANITICS_EMERGE → OPEN_NEST → FORAGE → (RELOCATE)`

| State | Duration | Failure chance | Label |
|---|---|---|---|
| FLIGHT (and landing) | 0.5–2 h | predation 40–60% | DESIGN, tuned so total ≈ 99% (DATA, P. barbatus) |
| DEALATE | about 10–60 min | — | DESIGN |
| SEARCH | 0.5–6 h; avoid spots near large colonies (lower success near them) | predation/desiccation 20–40% | DESIGN; neighbour effect DATA (P. barbatus) |
| DIG | about 3 days to 15–25 cm; 1 shaft + 1 chamber | 10–20% | depth/time BORROWED (P. rugosus); failure DESIGN |
| SEAL | instant; queen stays inside, does not forage | — | P. badius claustral (moderate confidence) |
| EGGS | lays about 8–15 eggs over the first 1–2 weeks (DESIGN) | — | brood count Couldn't find it |
| LARVAE | about 25 d | brood loss 20–40% | duration P. badius estimate |
| PUPAE | about 14 d | — | P. badius estimate |
| NANITICS_EMERGE | about 5 workers, small minors | — | BORROWED (genus) |
| OPEN_NEST/FORAGE | opens 1–5 d after first emergence | colony loss over winter 50–80% | DESIGN; tuned to P. occidentalis 0% / P. barbatus about 1% surviving |
| RELOCATE | at 30–100 workers in a warm season; dig 30–50 cm nest in 3–6 d | — | Inference + DATA (P. badius nest/move data) |

Queen reserve (DESIGN): start at 100%. Drain about 0.5%/day while sealed, plus about 2.5% per worker raised. If the reserve drops below 10%, she eats brood. At 0%, she dies.

## Caveats
- **Claustral status** rests on a personal communication cited in a primary paper, plus gyne size and fat. No direct study has followed P. badius founding.
- **Time of flight is unclear**: sources disagree (morning vs afternoon). Van Pelt 1953 and Harmon 1993 should settle it but I did not read them.
- Rheindt et al. 2004's exact mate counts were not accessible. The Wiernasz & Cole and Johnson numbers were partly read via abstracts or snippets.
- The founding-cell depth comes from lab columns that capped depth at 19 cm.
- The incipient-nest depth is inconsistent within Tschinkel 2004 (29–37 vs 40–50 cm).

## References
- Enzmann BL, Nonacs P (2010) Digging beneath the surface: incipient nest characteristics across three species of harvester ant that differ in colony founding strategy. *Insectes Sociaux* 57. doi:10.1007/s00040-009-0056-7 (snippets of full text)
- Enzmann BL, Gibbs AG, Nonacs P (2014) The cost of being queen. *J Insect Physiol* 70:134–142. https://gibbs.faculty.unlv.edu/Ant%20Gyne%20MR%20JIP%202014.pdf (full text; saved as src/gibbs2014.txt)
- Gordon DM, Kulig AW (1996) Founding, foraging, and fighting. *Ecology* 77:2393–2409. https://web.stanford.edu/~dmgordon/previous/GordonKulig1996.pdf (full text excerpts)
- Harmon G (1993) Mating in *Pogonomyrmex badius*. *Florida Entomologist* 76:524–526 (cited via Smith & Tschinkel 2006; not read)
- Hölldobler B (1976) The behavioral ecology of mating in harvester ants. *Behav Ecol Sociobiol* 1:405–423. doi:10.1007/BF00299401 (via summary)
- Johnson RA (1998) Foundress survival and brood production in *P. rugosus* and *P. barbatus*. *Insectes Sociaux* 45:255–266. doi:10.1007/s000400050086 (not read)
- Johnson RA (2002) Semi-claustral colony founding in *P. californicus*. *Oecologia* 132:60–67. https://pubmed.ncbi.nlm.nih.gov/28547285/ (via abstract)
- Johnson RA (2004) Colony founding by pleometrosis in *P. californicus*. *Anim Behav* 68:1189–1200. https://www.sciencedirect.com/science/article/abs/pii/S000334720400260X (via abstract)
- Johnson RA (2004) Body size and environment determine nest founding method in seed-harvester ants. ESA meeting abstract. https://esa.confex.com/esa/2004/techprogram/paper_15823.htm
- Efficient allocation of labor… *P. californicus* (2022) *Front Ecol Evol*. doi:10.3389/fevo.2022.768752 (via snippet)
- Rheindt FE, Gadau J, Strehl CP, Hölldobler B (2004) Extremely high mating frequency in the Florida harvester ant. *Behav Ecol Sociobiol* 56:472–481. doi:10.1007/s00265-004-0808-3 (via abstract)
- Smith CR, Tschinkel WR (2006) Sociometry and sociogenesis of reproduction in *P. badius*. *J Insect Sci* 6:32. https://www.bio.fsu.edu/~tschink/publications/2006-soci.pdf (full text)
- Tschinkel WR (1999) *Ann Entomol Soc Am* 92:80–89. https://www.bio.fsu.edu/~tschink/publications/1999-4.pdf
- Tschinkel WR (2004) Nest architecture of *P. badius*. *J Insect Sci* 4:21 (full text)
- Tschinkel WR (2014) Nest relocation and excavation in *P. badius*. *PLoS ONE* doi:10.1371/journal.pone.0112981 (full text)
- Wiernasz DC, Cole BJ (2003) Queen size mediates queen survival and colony fitness in harvester ants. *Evolution* 57. http://nsmn1.uh.edu/bcole/pogo/WiernaszCole03.pdf (via search snippet)
- Encyclopedia of Life, Florida harvester ant. https://api.eol.org/pages/599429/articles (secondary)
