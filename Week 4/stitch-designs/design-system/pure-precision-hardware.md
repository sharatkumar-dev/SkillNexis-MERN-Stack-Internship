# Pure Precision Hardware — Design System Specification
**Project**: NexisStore MERN Platform  
**Design System ID**: `assets/d3b3544b838f42889badd3310937d828`  
**Theme**: Dark Mode | Space Grotesk / Inter / JetBrains Mono | Corner Radius: 4px  

---

## 1. Brand & Creative Direction

This design system embodies the ethos of bespoke aerospace-grade hardware engineering, extreme mechanical tolerances, and industrial lab utility. It is engineered for hardware architects, avionics engineers, and deep-tech operators who demand uncompromising clarity, high information density, and instant legibility under rigorous operational conditions.

The visual direction merges **Utilitarian Brutalism** with **Aerospace Precision Instrumentation**. It relies on matte graphite textures, razor-sharp geometric alignment, subtle metallic hair lines, and high-visibility signal illumination. The interface feels less like a consumer web platform and more like a high-end CNC diagnostic console or an avionics telemetry command terminal: unapologetically disciplined, functional, and authoritative.

---

## 2. Color Palette & Token Architecture

| Token | Hex / Value | Role & Semantic Usage |
| :--- | :--- | :--- |
| `background` | `#121318` | Base canvas void (deep carbon) |
| `surface` | `#121318` | Ground void foundation |
| `surface_container_lowest` | `#0D0E13` | Recessed diagnostic slots |
| `surface_container_low` | `#1A1B21` | Substrate structural panels |
| `surface_container` | `#1E1F25` | Standard chassis card background |
| `surface_container_high` | `#292A2F` | Elevated trays, flyouts, and modals |
| `surface_container_highest`| `#34343A` | Focused interactive panels |
| `primary` | `#FFC174` | Active telemetry highlight |
| `primary_container` | `#F59E0B` | Signal Amber — Primary decisive CTA |
| `on_primary` | `#472A00` | High-contrast label on amber |
| `secondary` | `#FFB690` | Precision secondary signal |
| `tertiary` | `#56E5A9` | Hardware Emerald — Operational nominal |
| `tertiary_container` | `#30C88F` | Operational status container |
| `error` | `#FFB4AB` | Hyper-Red — Critical fault / abort |
| `outline` | `#A08E7A` | Machined seam divider |
| `outline_variant` | `#534434` | Hairline gridline |
| `on_surface` | `#E3E1E9` | Crisp White/Light mechanical text |
| `on_surface_variant` | `#D8C3AD` | Cool mechanical secondary slate |

---

## 3. Typography Architecture

- **Structural Headings**: `Space Grotesk` (Tight negative tracking, industrial terminal angles, geometric severity)
  - `display-lg`: 48px / 52px (700)
  - `headline-xl`: 32px / 38px (600)
  - `headline-lg`: 24px / 30px (600)
  - `headline-md`: 20px / 26px (500)
- **Operational Copy & UI**: `Inter` (Neutral, utilitarian, legible)
  - `body-lg`: 16px / 24px (400)
  - `body-md`: 14px / 20px (400)
  - `body-sm`: 12px / 16px (400)
- **Monospaced Data & Telemetry**: `JetBrains Mono` (SKU identifiers, tolerance specs, coordinates, telemetry)
  - `mono-metric-lg`: 28px / 32px (600)
  - `mono-metric-md`: 18px / 24px (500)
  - `label-code`: 11px / 14px (500)
  - `label-caps`: 10px / 12px (600, uppercase)

---

## 4. Geometric Rules & Corner Radius
- **Micro UI & Controls**: `4px` (`rounded-sm`). Enforced across buttons, cards, panels, and badges.
- **Strict Prohibition**: Bulbous contours, organic pills, and floating bubbles are strictly forbidden to preserve aerospace cockpit rigor.

---

## 5. Machined Elevation & Edge Lighting
- **Ground Void (L0)**: `#090A0F` base canvas.
- **Primary Modular Chassis (L1)**: `#12151E` bounded by `1px solid rgba(255, 255, 255, 0.08)`.
- **Elevated Trays & Flyouts (L2)**: `#181C26` bounded by `rgba(255, 255, 255, 0.14)`.
- **Active Trace Illumination**: `0 0 0 1px #F59E0B, 0 0 12px -2px rgba(245, 158, 11, 0.35)`.
