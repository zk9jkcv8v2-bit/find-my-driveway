
Goal: rebuild the bottom nav so the center Host button sits inside a truly smooth white bump, matching your reference, and keep the button in the updated teal theme.

What I found
- `src/components/BottomNav.tsx` currently uses:
  - a separate floating SVG sitting above the bar
  - a standard full-width `border-t` on the nav container
  - a Host button lifted with `-mt-8`
- That structure is why it still looks “stuck on top” rather than integrated into the bar. The bump and the bar are two separate visual layers, and the straight top border cuts across the shape.
- The Host button is already using `bg-primary`, so the main issue is layout/shape integration, not just color.

Plan
1. Rebuild the nav as one integrated shape
- Replace the current “floating SVG + bordered bar” approach with a single nav shell that owns the bump visually.
- Move the border treatment into the bump shape itself instead of relying on a straight `border-t` across the whole bar.

2. Create a wider, smoother center bump
- Use a larger SVG or masked top shape that spans enough width so the curve eases in/out gradually, like your screenshot.
- Make the bump rise from the bar rather than sit on top of it.
- Ensure the bump fill matches `bg-card` exactly so it reads as one piece.

3. Reposition the Host button to sit inside the bump
- Lower the button slightly so the teal circle visually “nests” into the bump rather than hovering too high.
- Keep the Host label aligned with the other tab labels.
- Fine-tune button diameter, notch width, and vertical offset for the 390px mobile viewport you’re using.

4. Remove the conflicting straight border line
- The current full-width top border should be removed or interrupted behind the bump.
- Recreate the border only on the left/right flat sections plus the bump outline, so the top edge stays continuous and smooth.

5. Keep the new color theme consistent
- Retain `bg-primary` for the Host button so it uses the current teal/lighter blue branding from `src/index.css`.
- If needed, slightly tune shadow/foreground contrast so the center action feels polished without looking too dark.

Files to update
- `src/components/BottomNav.tsx`
  - Main structural/layout fix
  - Replace current bump implementation
  - Adjust center button placement and border treatment
- Possibly `src/index.css`
  - Only if a tiny helper utility/class is needed for safe bottom spacing or smoother shadows

Technical approach
```text
Current:
[floating svg]
[full-width rectangular nav with border-top]
     [button pulled upward]

Planned:
[single nav shape with built-in curved bump]
          [button seated into bump]
[left border]  [curved outlined bump]  [right border]
```

Implementation notes
- Best fix: use one larger centered SVG shape positioned as part of the nav background, not as a detached ornament.
- The nav container should likely become borderless on top, with the SVG/path drawing the visible top contour.
- The center tab wrapper should reserve horizontal space so the left/right items don’t crowd the bump.
- I’ll preserve the current 5-tab setup and only change the visual architecture of the bottom bar.

Expected result
- The white bar curves upward smoothly behind the Host button
- No visible straight line cutting through the bump
- The Host button uses the teal theme and feels embedded in the nav
- The result matches the reference much more closely on mobile

Validation after implementation
- Check on the current mobile viewport (390x844)
- Verify the bump stays smooth on Home, Explore, Activity, and Profile tabs
- Confirm the Host button remains centered and the labels don’t shift awkwardly

<lov-actions>
<lov-suggestion message="Test the bottom navigation end-to-end on mobile and verify the Host button sits smoothly inside the bump on every tab">Verify on mobile</lov-suggestion>
<lov-suggestion message="Implement the smooth integrated bottom nav bump and reposition the Host button so it matches the uploaded reference more closely">Fix bottom nav bump</lov-suggestion>
<lov-suggestion message="Refine the Host button sizing, shadow, and label spacing so the center action feels more premium">Polish Host button</lov-suggestion>
<lov-suggestion message="Adjust the teal theme to a slightly lighter or softer tone across buttons, icons, and highlights">Tune teal palette</lov-suggestion>
</lov-actions>
