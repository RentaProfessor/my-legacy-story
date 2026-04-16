

## Plan: Redesign Landing Page with 2x2 Grid Buttons (Updated)

### Layout
Remove cassette logo. Replace vertical button list with a 2x2 grid of square cards. Clean, consistent spacing throughout.

### Button grid (2x2)

| Position | Label | Icon | Rationale |
|----------|-------|------|-----------|
| Top-left | Follow a Loved One | `BookOpen` | Most common family action |
| Top-right | Record a Book | `Mic` | Primary creator action |
| Bottom-left | Record a Journal | `BookText` (diary/journal icon) | Journal/diary feel — NOT `Newspaper` |
| Bottom-right | Set Up a Device | Custom cassette recorder illustration | Old-school shoebox cassette tape recorder — generated via AI image, not a generic Lucide icon |

### Key changes from previous plan
- **Journal icon**: Switch from `Newspaper` to `BookText` (Lucide's diary/journal icon) for a proper journal feel
- **Device Setup icon**: Replace the `Radio` Lucide icon with a small AI-generated illustration of a vintage shoebox-style cassette tape recorder — fits the LegacyTape brand perfectly

### Spacing structure
```text
┌──────────────────────────┐
│  pt-16 (safe-top)        │
│                          │
│       LegacyTape         │
│   Turn spoken stories... │
│                          │
│  mt-8                    │
│  ┌──────────┐┌──────────┐│
│  │ BookOpen ││   Mic    ││
│  │  Follow  ││  Record  ││
│  │ Loved One││  a Book  ││
│  └──────────┘└──────────┘│
│  ┌──────────┐┌──────────┐│
│  │ BookText ││ cassette ││
│  │  Record  ││ recorder ││
│  │ a Journal││  Setup   ││
│  └──────────┘└──────────┘│
│  pb-10                   │
└──────────────────────────┘
```

### Files to edit
1. **src/pages/Index.tsx** — Remove logo import, restructure to 2x2 grid, swap icons as described, fix all spacing
2. **Generate cassette recorder image** — AI-generate a small vintage shoebox cassette recorder icon/illustration for the Device Setup card
3. **src/assets/** — Save the generated recorder image here

### Technical details
- Grid: `grid grid-cols-2 gap-3`
- Cards: `aspect-square rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 flex flex-col items-center justify-center p-5 text-center`
- Icons: `BookOpen`, `Mic`, `BookText` from Lucide at `size-7 text-primary`; cassette recorder as `<img>` at ~40px
- No colored icon wrapper boxes — clean icons only

