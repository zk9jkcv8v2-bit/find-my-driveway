

## Plan: Add fake activity content + smarter chat auto-replies

### 1. Populate Activity tab with fake content
**File: `src/components/ActivityView.tsx`**

Replace the empty state with a scrollable list of mock activity items:
- **Upcoming booking**: "Downtown Garage — Tomorrow, 2:00 PM – 5:00 PM" with a "Confirmed" badge
- **Past booking**: "Residential Driveway — Mar 15, 10:00 AM – 1:00 PM" with a "Completed" badge  
- **Message notification**: "Sarah M. replied to your message" with timestamp
- **Booking reminder**: "Your booking at Office Parking starts in 1 hour"

Each item will have an icon, title, subtitle, timestamp, and optional status badge. Grouped under "Upcoming" and "Recent" section headers.

### 2. Context-aware chat auto-replies
**File: `src/components/ChatSheet.tsx`**

Replace the random reply picker with a simple keyword-matching system so the host responds naturally to demo scenarios:

| User says (contains) | Host replies |
|---|---|
| "late" or "running" or "minutes" | "Okay thanks for letting me know! No worries, take your time 😊" |
| "cancel" | "No problem, I'll free up the spot. Hope to see you next time!" |
| "thanks" or "thank you" | "You're welcome! See you soon 😊" |
| "hello" or "hi" or "hey" | "Hey there! How can I help?" |
| Default fallback | Random from existing `HOST_REPLIES` array |

This way when you type "Hi I'm running 15 minutes late" in the demo, the host will reply with something contextually appropriate.

### Files changed
- `src/components/ActivityView.tsx` — full rewrite with mock activity list
- `src/components/ChatSheet.tsx` — update reply logic to keyword-match

