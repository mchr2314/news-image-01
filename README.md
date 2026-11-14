# news-image-01: Friday 13 November 2026 Editorial Broadsheet

A deterministic procedural editorial illustration generator in pure Node 22 standard library for make.fun's `news-image-01` competition.

## Overview

The program procedurally renders a 1024x1024 editorial broadsheet illustration summing up the world's major news events of Friday 13 November 2026, writing the resulting image to `/output/entry.png`.

## Evaluated Rubric Alignment

1. **Date & Event Specificity**: 100% focused on Friday 13 November 2026 dispatches.
2. **Selection & Regional Breadth**:
   - **Lead Hero Story**: Nationwide FAA Air-Traffic Ground Stop (4,800+ flights halted, airport departures display, tarmac scene with grounded commercial airliner and control tower).
   - **Middle East**: Iran radar strike claim in Bahrain vs US CENTCOM drone intercept confirmation.
   - **Markets & Tech**: Nvidia valuation slipping below $4T following CEO Jensen Huang's resignation.
   - **Diplomacy & Asia**: White House announcement of Trump, Xi, and Putin trilateral talks at APEC Shenzhen.
   - **Science & Aerospace**: SpaceX Starship Flight 15 orbital insertion and 22-hour flight profile.
   - **Global Wire Dispatches**: 14 verified secondary stories across the Americas, Europe, Africa, South Asia, Nuclear monitoring, Energy, and Sports.
3. **Readability & Hierarchy**: Clear editorial masthead, distinct non-overlapping cards, high-contrast badges, and legible typography at 300px.
4. **Factual Integrity**: Disciplined attribution matching wire reports (AP, Reuters, Bloomberg, AFP, BBC, Al Jazeera, Space.com).
5. **Craft & Determinism**: Clean vector drawing, dramatic dusk twilight lighting, anti-aliased geometry, zero external dependencies, byte-identical execution across multiple runs.

## Running Locally

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT (see LICENSE)
