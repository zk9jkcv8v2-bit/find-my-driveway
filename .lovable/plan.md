

# Plan: Bring Parkr to Life with Interactive Map + Polish

## Overview
Replace the SVG simulated map with a real interactive map using **Leaflet + React-Leaflet** (free, no API key needed, uses OpenStreetMap tiles). Then polish remaining screens to feel complete and functional.

## Why Leaflet
- Free and open-source (no API key or billing setup)
- OpenStreetMap tiles look clean and Google Maps-like
- Supports GPS geolocation, custom markers, zoom, pan out of the box
- Lightweight and fast on mobile

---

## Changes

### 1. Install dependencies
Add `leaflet`, `react-leaflet`, and `@types/leaflet`.

### 2. Replace MapView with real Leaflet map
- Full-screen interactive `MapContainer` centered on San Francisco
- Light-themed OpenStreetMap tiles (CartoDB Voyager — clean, modern, light)
- Custom price-tag markers using Leaflet `DivIcon` (styled to match existing `$5`, `$8` pill design)
- User location dot via browser Geolocation API (with fallback to SF center)
- Tap a marker to select a spot (connects to existing `onSpotSelect` flow)
- Smooth fly-to animation when a spot is selected

### 3. Add Leaflet CSS
Import Leaflet's required CSS in `index.css` or via the Leaflet package import.

### 4. Update ListSpotWizard location step
Replace the SVG mini-map in Step 2 (Location) with a small Leaflet map that shows a draggable pin for the host to set their spot's location.

### 5. Polish the search bar
Make the floating search bar functional — typing filters the spot list by address. Add a "Use current location" button.

### 6. Make "Get Directions" work
After booking confirmation, the "Get Directions" button opens Google Maps/Apple Maps with the spot's coordinates using a `window.open` URL scheme.

### 7. Filter bar functionality
Connect the existing FilterBar buttons (Nearest, Cheapest, EV, Garage) to actually sort/filter `MOCK_SPOTS` in the bottom sheet.

### 8. Add lat/lng to spot data
Extend the `SpotMarker` type with `lat` and `lng` fields so markers appear at real San Francisco coordinates.

---

## Technical Details

**Leaflet tile URL (CartoDB Voyager — light, clean):**
```
https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
```

**Custom marker approach:** Use Leaflet's `DivIcon` with `ReactDOMServer.renderToString` to render the existing price pill as a map marker — keeps design consistent.

**Geolocation:** Use `navigator.geolocation.getCurrentPosition` with a fallback center of `[37.7749, -122.4194]` (SF). Show the blue pulsing dot at the user's real position.

**File changes:**
- `package.json` — add leaflet, react-leaflet, @types/leaflet
- `src/components/MapView.tsx` — full rewrite to use Leaflet
- `src/index.css` — import Leaflet CSS
- `src/pages/Index.tsx` — add search filtering + filter sorting logic
- `src/components/ListSpotWizard.tsx` — replace SVG mini-map with Leaflet
- `src/components/BookingSheet.tsx` — make "Get Directions" open real maps app

