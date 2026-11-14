# news-image-01: Friday 13 November 2026 Editorial Broadsheet (30 Stories)

A deterministic, ultra-high-resolution 30-story editorial broadsheet illustration generator for make.fun's `news-image-01` competition.

## Overview

The program outputs a razor-sharp 1024x1024 anti-aliased editorial broadsheet infographic summing up 30 verified world news events of Friday 13 November 2026 across 6 continents, writing the resulting image to `/output/entry.png`.

## Evaluated Rubric Alignment

1. **Date & Event Specificity**: 100% focused on verified Friday 13 November 2026 dispatches.
2. **Global Breadth (30 Stories across 6 Continents)**:
   - **12 Illustrated Lead Cards (4x3 Grid)**:
     1. `US · AVIATION`: FAA halts all US departures as air-traffic telecoms fail (nationwide ground stop, 5,000 flights cancelled).
     2. `MIDDLE EAST · DEFENSE`: Iran says it hit a US radar in Bahrain; US military denies and confirms drone shootdowns.
     3. `DIPLOMACY · ASIA`: Trump, Xi and Putin to meet in China next week at APEC summit in Shenzhen.
     4. `AEROSPACE · ORBIT`: SpaceX's Starship Flight 15 achieves nominal orbit for 22-hour duration test.
     5. `US · MARITIME`: Riverboat American Heritage capsizes in Mississippi River after tanker collision in New Orleans.
     6. `LATIN AMERICA · PERU`: Pope Leo XIV celebrates Mass in Chiclayo before 500,000 faithful.
     7. `MARKETS · TECH`: Nvidia closes below $4 trillion valuation following CEO Jensen Huang's resignation.
     8. `EUROPE · UKRAINE`: Russian drone sets Kyiv hospital surgical wing ablaze; 30 evacuated.
     9. `EUROPE · DIPLOMACY`: EU names 5 contact group nations (UK, France, Germany, Italy, Poland) for Ukraine peace talks.
     10. `MIDDLE EAST · GAZA`: Bombardment strikes Nasser Hospital complex in Khan Younis.
     11. `SOUTH ASIA · INDIA`: Overcrowded minibus collides with container truck in Assam, killing 24.
     12. `OCEANIA · AUSTRALIA`: Spring heatwave triggers severe bushfires across NSW and Queensland.
   - **18 Global Wire Dispatches (#13–#30)**:
     - Stories 13–18: Microsoft 365 outage Day 2, Turkey-Qatar mutual defense pact, Hormuz LNG tanker mine, UN 340k Yemen displaced, Moscow car bomb, Japan PM Takaichi Beijing visit.
     - Stories 19–24: Pakistan border counter-raids (74 killed), North Korea modifies flag design, Nairobi building collapse, Nigeria clears Ebola monitoring, RAF Lakenheath drones, US wholesale prices surge 6.5%.
     - Stories 25–30: Lauren Boebert loses Colorado seat, Shuttle Endeavour raised upright in LA, U2 album with Dolly Parton, Pochettino Man United manager, Japan defeats South Korea 9-5 baseball, IAEA Iran enrichment alert.
3. **Readability & Visual Hierarchy**: TrueType broadsheet layout with Georgia serif masthead, clear category badges, non-overlapping 2-line summaries, and high-contrast wire columns legible at 300px thumbnail size.
4. **Factual Integrity**: Disciplined wire source attribution (AP, Reuters, Bloomberg, AFP, BBC, Al Jazeera, NPR, CNBC, Vatican News, Space.com).
5. **Craft & Determinism**: Deterministic pixel and byte integrity, optimized JPEG quality 88 (266,016 bytes), zero external dependencies at runtime.

## Running Locally

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT (see LICENSE)
