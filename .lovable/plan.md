

# Make the Earnings Tab More Satisfying

## What changes

### 1. Animated counting numbers
All dollar amounts and stats will count up from 0 using an animated counter effect. The big `$237` / `$1,842` figures will roll up on mount, giving that dopamine hit of watching your money grow.

### 2. Gradient revenue card
Replace the flat white card with a subtle gradient (soft blue to light purple or blue to green), white text, making the main earnings number feel premium and celebratory.

### 3. Better bar chart
- Bars get a gradient fill (blue to accent green) instead of flat blue
- The tallest bar gets a subtle glow
- Hovering/tapping a bar shows a tooltip with the exact amount
- Rounded tops with slightly thicker bars

### 4. Sparkle/confetti on withdraw success
When the withdrawal succeeds, show a small confetti burst animation (CSS-based, no library needed) around the checkmark, making it feel rewarding.

### 5. Progress ring for monthly goal
Add a circular progress ring below the stats showing "78% of monthly goal" — gives hosts a target to aim for and feels gamified.

### 6. Micro-interactions
- Stat cards scale slightly on tap
- The +18% badge pulses gently on mount
- Booking cards have a subtle hover lift

### Files changed
- `src/components/EarningsDashboard.tsx` — all changes above

