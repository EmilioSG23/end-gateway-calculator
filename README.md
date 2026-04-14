# End Gateway Calculator

A browser-based tool for Minecraft Java Edition players to calculate **End Gateway** destination coordinates and plan the optimal trajectory to activate them.

---

## What are End Gateways?

End Gateways are portals that appear in the outer islands of The End after defeating the Ender Dragon. There are **20 predetermined gateway positions** arranged in a ring around the central island (radius ≈ 96 blocks). Each gateway teleports the player to a corresponding platform in the outer End islands at a distance between **768 and 1280 blocks** from the center.

**Dataless gateways** have no stored destination yet. When the player enters one, the game calculates the destination on the fly based on the angle from the center — which is what this calculator replicates.

---

## Features

- **Real-time trajectory calculation** — input your origin coordinates and a target distance to instantly compute the destination block.
- **Interactive End Map canvas** — pan, zoom, and visualize all 20 gateway positions on a chunk-aligned grid.
- **Block path list** — full list of every integer block position along the computed trajectory line.
- **Multiple export formats** — download the block path as **XLSX** (with placed/unplaced column validation), **CSV**, **JSON**, or **TXT**.
- **Minecraft command generation** — copy vanilla `/setblock` commands or WorldEdit `//pos1` / `//pos2` commands to the clipboard.
- **How to Use guide** — built-in step-by-step modal for both the app workflow and the in-game Minecraft steps.

---

## Tech Stack

| Technology   | Version | Purpose                                          |
| ------------ | ------- | ------------------------------------------------ |
| React        | 19.2.5  | UI framework (with React Compiler)               |
| TypeScript   | ~6.0.2  | Type safety, strict mode                         |
| Vite         | 8.0.8   | Build tool and dev server                        |
| Tailwind CSS | 4.2.2   | Utility-first styling (custom End color palette) |
| ExcelJS      | 4.3.0   | XLSX generation with data-validation dropdowns   |
| Vitest       | 4.1.4   | Unit test runner                                 |

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** (or npm / yarn)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open `http://localhost:5173` in your browser.

---

## Available Scripts

| Script     | Command        | Description                            |
| ---------- | -------------- | -------------------------------------- |
| Dev server | `pnpm dev`     | Starts Vite HMR dev server             |
| Build      | `pnpm build`   | Type-checks then builds for production |
| Preview    | `pnpm preview` | Serves the production build locally    |
| Test       | `pnpm test`    | Runs Vitest unit test suite            |
| Lint       | `pnpm lint`    | Runs ESLint                            |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── calculator/      # Calculator-specific widgets (CoordInput, BlockList, DistanceSlider, StatCard)
│   ├── end-map/         # End Map canvas sub-components (canvas, tooltip, controls)
│   ├── inputs/          # Generic input primitives (NumericInput, SliderInput)
│   └── ui/              # Shared UI utilities (DownloadSelect)
├── context/             # React context (ModalContext / ModalProvider)
├── hooks/               # Custom hooks (useGatewayCalculator, useMapInteraction, useModal)
├── icons/               # SVG icon components (Copy, Download, Gateway, GitHub)
├── logic/               # Pure calculation functions (calculate.ts)
├── pages/               # Top-level page components (Calculator, Commands, HowToUse)
├── services/            # Side-effect services (download.ts — XLSX/CSV/JSON/TXT export)
├── types/               # TypeScript type definitions (Coords, MapTypes)
├── utils/               # Pure utility functions (downloadHelper, mapDrawHelpers, mapHitDot)
├── consts.ts            # App-wide constants
└── App.tsx              # Root component with tab routing

tests/
└── calculate.test.ts    # Unit tests for core calculation logic
```

---

## Key Constants

| Constant          | Value      | Description                                   |
| ----------------- | ---------- | --------------------------------------------- |
| `MIN_DISTANCE`    | `768`      | Minimum gateway distance in blocks            |
| `MEDIUM_DISTANCE` | `1024`     | Default distance (slider initial value)       |
| `MAX_DISTANCE`    | `1280`     | Maximum gateway distance in blocks            |
| `CHUNK_SIZE`      | `16`       | Minecraft chunk size (used for canvas grid)   |
| `END_GATEWAYS`    | 20 entries | Predefined coordinates of all 20 end gateways |

---

## Export Formats

| Format   | Description                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| **XLSX** | Excel workbook with X, Z, and "Placed" columns. The Placed column has a TRUE/FALSE dropdown data-validation on each row. |
| **CSV**  | Plain comma-separated values: `x,z,placed` per block.                                                                    |
| **JSON** | JSON array of `{ x, z, placed }` objects.                                                                                |
| **TXT**  | Human-readable text list, one `(x, z)` pair per line.                                                                    |
