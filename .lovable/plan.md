

## Plan: Vertical Volume Meter in Recording Session

Update the volume meter in `RecordingSession.tsx` from a horizontal bar to a vertical bar.

### Changes

**`src/pages/RecordingSession.tsx`** — Modify the volume meter UI:
- Change from a horizontal width-based bar to a vertical height-based bar
- The bar grows upward from the bottom based on volume level
- Place it next to or behind the pulsing mic icon for a natural "sound level" feel

### Updated layout

```text
┌─────────────────────┐
│  ← Back     Recording│
│                       │
│      ┃ (volume bar)   │
│      ┃                │
│      ◉ (pulsing mic)  │
│      02:34            │
│                       │
│  "I remember when..." │
│                       │
│   ⏸  ⏹               │
└─────────────────────┘
```

The vertical bar will use `height` style (driven by volume level) instead of `width`, rendered as a tall narrow container with the fill growing from bottom to top.

