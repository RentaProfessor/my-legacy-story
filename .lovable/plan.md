

## Plan: Fix CreatorHome Layout

### Problems
1. **Header text too high** — `pt-14` pushes text into the safe area but doesn't vertically center it within the white bar
2. **Buttons pinned to bottom** — `flex-1` spacer pushes all buttons to the very bottom instead of centering them in the remaining space

### Changes to `src/pages/CreatorHome.tsx`

1. **Header**: Change padding to vertically center the text within the bar. Use `pt-16 pb-5` → replace with proper centering: keep `safe-top` but add more balanced padding so text sits in the visual center of the white bar (e.g. `pt-16 pb-6` or use flexbox centering).

2. **Buttons section**: Replace the `flex-1` empty spacer + bottom-pinned buttons with a `flex-1 flex items-center` wrapper so the button group centers vertically in the remaining space below the header. Remove `pb-10` bottom-pinning.

### Result layout
```text
┌──────────────────────┐
│   (safe area inset)  │
│                      │
│  Welcome, Brett      │  ← centered in white bar
│  Your creator dash   │
├──────────────────────┤
│                      │
│   ┌──────────────┐   │
│   │ Start Record │   │  ← vertically centered
│   ├──────────────┤   │    in remaining space
│   │ View Book    │   │
│   ├──────────────┤   │
│   │ Set Up Device│   │
│   ├──────────────┤   │
│   │ Settings     │   │
│   └──────────────┘   │
│                      │
└──────────────────────┘
```

### Technical details
- Header: `pt-16 pb-6` for better vertical centering within the bar
- Replace `<div className="flex-1" />` + bottom div with `<div className="flex-1 flex items-center"><div className="max-w-lg mx-auto w-full px-6 space-y-3">...</div></div>`

