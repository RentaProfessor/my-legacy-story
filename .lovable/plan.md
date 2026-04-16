

## Plan: Revamp Creator Home with Stats, Progress, and Bottom Tab Bar

### Overview
Replace the current button list with a proper dashboard showing book progress, stats, and a bottom tab bar. The "Record" action moves to the bottom tab bar (not a card). Cards show book count, current book progress, etc.

### New files

**`src/components/BottomTabBar.tsx`**
- Fixed bottom bar: Home, Library, Record, Profile
- Icons: `Home`, `BookOpen`, `Mic`, `User`
- Active tab highlighted based on current route
- Glass style: `bg-card/80 backdrop-blur-md border-t`
- `safe-bottom` padding

**`src/components/ModeSwitch.tsx`**
- Pill toggle: "Creator" / "Listener"
- Navigates between `/creator-home` and `/dashboard`

**`src/pages/CreatorLibrary.tsx`** — placeholder with BottomTabBar
**`src/pages/CreatorProfile.tsx`** — placeholder with BottomTabBar

### Changes to `src/pages/CreatorHome.tsx`

Replace the 4-button list with a dashboard layout:

1. **Mode switch** in header area
2. **Stats section** — cards showing:
   - Total books: e.g. "2 Books" 
   - Total chapters recorded: e.g. "7 Chapters"
3. **Current book progress** — a card with:
   - Book title (e.g. "My Life Story")
   - Progress bar (e.g. 3/10 chapters)
   - "Continue Recording" button
4. **Quick actions** — "Set Up Device" card remains
5. **BottomTabBar** at the bottom

Layout:
```text
┌──────────────────────┐
│ [Creator ▪ Listener] │
│  Welcome, Brett      │
├──────────────────────┤
│                      │
│  [2 Books] [7 Chaps] │  ← stat cards
│                      │
│  ┌─ Current Book ──┐ │
│  │ My Life Story    │ │
│  │ ████░░░░ 3/10   │ │  ← progress bar
│  │ Continue Recording│ │
│  └──────────────────┘ │
│                      │
│  ┌─ Set Up Device ──┐ │
│  └──────────────────┘ │
│                      │
├──────────────────────┤
│ Home Lib  Rec Profile│  ← bottom tab bar
└──────────────────────┘
```

### Routes added to `App.tsx`
- `/creator-library` → CreatorLibrary
- `/creator-profile` → CreatorProfile

### Technical details
- Stats use mock data for now (hardcoded)
- Progress bar uses existing `Progress` component from `src/components/ui/progress.tsx`
- Record tab in bottom bar navigates to `/record`
- `pb-24` on main content to clear bottom bar
- Bottom bar Record button is visually prominent (larger/colored icon)

