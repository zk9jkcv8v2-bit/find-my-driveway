

## Restructure Navigation: Add Home Feed + Explore Map

Based on the reference images, the app needs a new **Home** tab with a vertical listing feed (like image-7) and the current map view renamed to **Explore**. The bottom nav also gets a prominent center **"+"** button for hosting.

### New Tab Structure

```text
Current:  Explore(map) | Host(+) | Earnings | Profile
New:      Home(feed)   | Explore(map) | (+) Host | Activity | Profile
```

### Changes

**1. Create `src/components/HomeFeed.tsx`** — New home screen inspired by image-7:
- Search bar at top ("Search Parkr...")
- Horizontal scrollable filter chips (Events, Concerts, Downtown, Nearest, EV, etc.)
- Vertical scrollable list of spot cards — each showing the spot image (full-width), distance badge overlay, address, rating, price/hr, and a yellow/branded "Park now" CTA button
- Uses `MOCK_SPOTS` from MapView, reuses filtering logic

**2. Update `src/components/BottomNav.tsx`**:
- 5 tabs: Home, Explore, (+) Host, Activity, Profile
- Icons: `Home`, `Compass`/`Map`, `PlusCircle` (center, larger, elevated style like image-6), `Bell`/`Mail`, `User`
- Center "+" button gets a distinct circular elevated style (larger icon, subtle shadow or filled background)

**3. Update `src/pages/Index.tsx`**:
- Add `"home"` as default tab instead of `"discover"`
- Rename `"discover"` → `"explore"` (map view)
- Add `"activity"` tab (placeholder screen for now — "No activity yet")
- Render `<HomeFeed />` when `activeTab === "home"`
- Move search bar logic to HomeFeed; Explore (map) keeps its own search

**4. Create `src/components/ActivityView.tsx`** — Simple placeholder:
- Empty state with an icon and "No activity yet" message

### Visual Details for HomeFeed
- Each card: rounded image with a green distance badge (e.g. "250 feet") top-left, address + star rating + price below, full-width "Park now" button in primary/accent color
- Cards stack vertically with comfortable spacing
- Tapping "Park now" opens the existing BookingSheet
- Tapping the card image could navigate to Explore tab with that spot selected

