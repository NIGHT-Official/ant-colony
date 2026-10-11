# Sand pellets and nightly entrance closing: Pogonomyrmex badius
*Research notes, 2026-10-10. Tags: **P. badius** = measured in this species; **BORROWED (species)** = from another species; **Couldn't find it** = no source located; **via abstract** = only the abstract or a search snippet was read, not the full text. All numbers are copied from the sources. None were invented.*

## Summary
- **Pellets:** sand is bitten loose and pressed into pellets with the mandibles. What holds a pellet together is **water**: "Soil damp enough for grain adhesion is carried in pellets" (Tschinkel et al. 2015, P. badius). **Dry** sand that won't cohere is carried in the **psammophore**, a basket of hairs under the head, which holds more than twice as much dry sand per load as the mandibles alone (Porter & Jorgensen 1990, P. occidentalis, as cited by Tschinkel et al. 2015). I found **no source** saying that saliva or other secretions bind the pellets.
- **Moisture effects (BORROWED):** fire ants could dig in every moist substrate tested but **not in completely dry or fully saturated** media. Tunnels were deepest at **intermediate** moisture, and pellet size stayed roughly constant (Monaenkova et al. 2015). Leaf-cutter ants dig and make pellets faster in moist clay but avoid near-liquid clay (Pielström & Roces 2014).
- **Entrance closing:** P. badius closes its nest entrances at sunset. Activity runs from about 8:30–9 a.m. until about 6–7 p.m. (Tschinkel 2014). In P. barbatus, nest-maintenance workers **fill the entrance with soil** at the end of the day's activity and **carry the soil out** to reopen it the next morning. Patrollers emerge first, soon after sunrise (Gordon 1983/1984, 2023). I found **no measurements** of plug depth or of how long closing takes.

## Q1: How pellets form and what holds them together
| Fact | Value | Tag / source |
|---|---|---|
| Pellet size | 50–400 grains, mean 162 (already in Nest-Excavation.md) | P. badius, Tschinkel et al. 2015 |
| What binds a pellet | "Soil damp enough for grain adhesion is carried in pellets", meaning water (capillary) cohesion | P. badius study, statement from the literature (Tschinkel et al. 2015) |
| Dry sand | Carried in the psammophore, at more than 2× the dry sand per load compared with mandibles alone | BORROWED (P. occidentalis), Porter & Jorgensen 1990 via Tschinkel et al. 2015 |
| How the psammophore is loaded | Particles are tucked into the hair pocket using the forelegs and abdomen tip, then the closed mandibles act as a lid | BORROWED (Pogonomyrmex), Wheeler & Wheeler 1963 as cited in Porter & Jorgensen 1990 (excerpt) |
| Saliva or secretion as glue | No source found | Couldn't find it |
| Digging sequence | Each particle is grabbed, raked, then carried. Ants seem to test particles and remove the loosely held ones | BORROWED (harvester ants, species not stated), Espinoza & Santamarina 2010 and Sudd 1970, as summarized in an ISSMGE report |
| Dry vs. saturated substrate | No nest building in completely dry or fully saturated media. Above about 5% moisture, nest volume was largely insensitive to moisture | BORROWED (Solenopsis invicta), Monaenkova et al. 2015 (abstract + phys.org) |
| Tunnel stability | Deepest tunnels at intermediate moisture. Depth correlates with cohesive strength (yield force) | BORROWED (S. invicta), Monaenkova et al. 2015, via abstract |
| Pellet size vs. moisture | Similar across all conditions, even where larger stable pellets were possible. Two different pellet-forming behaviors depending on substrate | BORROWED (S. invicta), Monaenkova et al. 2015, via abstract |
| Digging rate vs. moisture | Rate and preference rise with water content, then drop sharply in extremely moist clay. Pellets formed faster in moist clay. Ants stopped about 12 mm below standing water | BORROWED (Atta vollenweideri), Pielström & Roces 2014, via abstract |
| Pellet rate | 26 pellets per hour per excavator | BORROWED (A. vollenweideri), Pielström & Roces 2013, via abstract |
| Strategy across soil types | Ants sense conditions at the tunnel face and adapt how they remove and transport material across clay, silt, sand and gravel, from dry to saturated | BORROWED (harvester ants), Espinoza & Santamarina 2010, via abstract. No numbers obtained |
| Excavation rate | About 7.5 mg per worker per hour at first, falling to about 1.5 by day 4 (lab, divided by all workers) | P. badius, Tschinkel et al. 2015 |
| Is Florida sandhill sand damp below the surface? | No measured moisture profile found. Tschinkel 2004 says moisture varies too much to act as a template. In a charcoal experiment, simulated heavy rain raised moisture by about 6% within 10 min in the top 5 cm | Couldn't find a profile. Partial: P. badius site, Tschinkel 2004; charcoal paper (src/char.txt) |

**Sim notes (Q1)**
- Pellet cohesion C(θ) as a function of volumetric moisture θ: set C = 0 at θ = 0, peak at an intermediate θ, and drop toward saturation. This shape is borrowed; the peak value and location are DESIGN choices.
- If C is below a threshold, switch the worker to **psammophore mode**: a loose-grain load at about 2× the mandible load. Do not make digging impossible, because P. badius does excavate sandhill sand.
- Keep pellet size roughly constant (162 grains) whatever the moisture, as fire ants do (borrowed).
- Tie tunnel collapse probability to C(θ): dry surface sand collapses and wetter sand is stable. A depth-moisture profile is DESIGN (moister with depth, plus spikes after rain), because no P. badius data exists.

## Q2: Closing and reopening the nest entrance
| Fact | Value | Tag / source |
|---|---|---|
| Closing time | Trailing and digging stop before sunset, "at which time the ants closed the nest entrances", and surface activity resumes the next morning | P. badius, Tschinkel 2014 |
| Activity window | Starts no earlier than about 8:30–9 a.m., ends no later than about 6–7 p.m. Often a lull from noon to 3 p.m. | P. badius, Tschinkel 2014 |
| Temperature gate | Trails most likely when the minimum trail surface temperature is above about 25 °C and the maximum is below about 45 °C | P. badius, Tschinkel 2014 |
| Rain | Heavy rain stops trail activity; light rain often does not | P. badius, Tschinkel 2014 |
| Plug material | "Close nest entrance at the end of the activity period by filling it with soil." Pebbles are carried onto the mound, not described as plug material. For P. badius specifically, sand presumably, but not documented | BORROWED (P. barbatus and others), Gordon 1983/1984 |
| Who closes / reopens | Classed as nest-maintenance tasks. Reopening = "Ants open nest entrance at the beginning of the activity period by carrying out soil." Debris left by flooding is cleared by nest-maintenance workers | BORROWED (P. barbatus), Gordon 1984; Gordon 2023 (NSF PAR) |
| Morning order | Patrollers emerge first, soon after sunrise. Their safe return triggers the foragers | BORROWED (P. barbatus), Gordon 1986 and Greene & Gordon 2003 via Gordon 2023 |
| Where workers stay overnight | Exterior workers stay near the entrance chamber overnight or descend below it. Entrance chambers were empty in inactive colonies | BORROWED (P. barbatus), Gordon 2023 |
| Plug depth, closing duration, number of workers | No source found | Couldn't find it |
| Winter | Little surface activity and no foraging from about November to early March. Foraging ceases in November (Tschinkel 2014). Whether the entrance stays plugged all winter is not documented | P. badius (inactivity); plug: Couldn't find it |
| Strictly diurnal, seals entrance at night | Claimed by a hobbyist care page | Unverified (trapjawlabs.com) |
| Charcoal | Charcoal covers the nest disc. No source says it is used as plug material | P. badius, Tschinkel 2014 |

**Sim notes (Q2)**
- Treat closing as a **scheduled task**. Trigger at dusk OR when the trail temperature falls outside 25–45 °C late in the day OR in heavy rain. Assign it to nest-maintenance workers near the entrance.
- Build the plug from local sand pellets. **DESIGN** values: plug depth of 1–3 pellet layers at the tunnel mouth and a closing time of minutes. Neither has any data.
- Morning: maintenance workers carry the plug out, then patrollers emerge, then foragers once patrollers return, from about 8:30 a.m. or when temperature ≥ 25 °C. Skip opening on winter or cold days (Nov–early Mar).

## Caveats
- The pellet cohesion mechanism for P. badius comes from a single sentence in Tschinkel et al. 2015. Whether saliva plays a role is untested, not disproven.
- The moisture–digging curves come from fire ants and leaf-cutters in lab substrates, not Florida sandhill sand.
- Closing details (material, who does it, reopening) come from P. barbatus in New Mexico. No plug depth or duration data were found for any Pogonomyrmex.
- I did not reach Cole 1968, Taber 1998, MacKay, Hölldobler & Wilson 1990, Sudd 1969/1970, Cassill et al. 2002, Gravish et al. 2012/2013, Bollazzi & Roces, or EDIS IN536 in full text.

## References
- Tschinkel WR (2014) Nest relocation and excavation in the Florida harvester ant, *P. badius*. PLOS ONE 9:e112981. https://pmc.ncbi.nlm.nih.gov/articles/PMC4237378/ (local: src/PMC4237378.txt)
- Tschinkel WR, Rink WJ, Kwapich CL (2015) Sequential subterranean transport of excavated sand and foraged seeds in nests of *P. badius*. PLOS ONE. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0139922
- Tschinkel WR (2004) Nest architecture of the Florida harvester ant. J Insect Sci 4:21. https://academic.oup.com/jinsectscience/article/4/1/21/886534 (local: src/2004-2.txt)
- Porter SD, Jorgensen CD (1990) Psammophores: do harvester ants use these pouches to transport seeds? J Kansas Entomol Soc 63:138–149. (No direct link found. Excerpt read at https://www.kiphub.com/paper/61e50eccec9214ead2f628e4)
- Monaenkova D et al. (2015) Behavioral and mechanical determinants of collective subsurface nest excavation. J Exp Biol 218:1295–1305. https://gravishlab.ucsd.edu/PDF/JEB_MonaenkovaGravishEtAl_2015.pdf ; https://phys.org/news/2015-05-extreme-excavation-ant-style.html
- Espinoza DN, Santamarina JC (2010) Ant tunneling: a granular media perspective. Granular Matter 12:607–616. (Abstract seen via https://www.kiphub.com/paper/61e50d0e00e4394be9f62bcf)
- Pielström S, Roces F (2014) Soil moisture and excavation behaviour in *Atta vollenweideri*. PLOS ONE. https://pmc.ncbi.nlm.nih.gov/articles/PMC3991694/
- Pielström S, Roces F (2013) Sequential soil transport and its influence on the spatial organisation of collective digging in leaf-cutting ants. PLOS ONE. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0057040
- Gordon DM (1983) The relation of recruitment rate to activity rhythms in *P. barbatus*. http://web.stanford.edu/~dmgordon/old2/Gordon1983Relation.pdf
- Gordon DM (1984) Species-specific patterns in the social activities of harvester ant colonies. https://web.stanford.edu/~dmgordon/previous/Gordon1984Patterns.pdf
- Gordon DM et al. (recent) Nest entrance architecture and the regulation of foraging activity in desert harvester ants. https://par.nsf.gov/biblio/10675488
- AntWiki, *P. badius*. https://www.antwiki.org/wiki/Pogonomyrmex_badius (not read in detail)
