

## Plan: Revamp Record Page as Recording Dashboard

### What changes
The `/record` route (RecordFlow.tsx) currently shows onboarding steps (whose story, name, family code, device). Since the creator has already completed onboarding, replace this entirely with a **Recording Screen** that serves as the hub for recording.

### New RecordFlow.tsx content

**Header**: Back button + "Record" title

**Book Selection Section**:
- If no books exist: "Create Your First Book" card with a button
- If books exist (mock 1-2 books): List of book cards showing title, chapter count, tap to select
- "+ Create New Book" button at the bottom of the list

**Selected Book Actions** (shown after selecting a book):
- "Record New Chapter" button (primary)
- "Re-record a Chapter" button (outline) — shows list of existing chapters to pick from
- Chapter list with status indicators

**Guided Interview Toggle**:
- A switch/toggle row: "Guided Interview" with on/off state
- When toggled on, show a card: "AI Interviewer — Coming Soon" with a subtle badge/lock icon, disabled state

**Bottom Tab Bar**: Include the existing BottomTabBar component

### Layout
```text
┌──────────────────────┐
│ ← Back     Record    │
├──────────────────────┤
│                      │
│  Your Books          │
│  ┌─ My Life Story ─┐ │
│  │ 3 chapters       │ │  ← tap to select
│  └──────────────────┘ │
│  ┌─ + Create New ───┐ │
│  └──────────────────┘ │
│                      │
│  ┌─ Record New Ch. ─┐ │
│  ┌─ Re-record Ch.  ─┐ │
│                      │
│  ── Guided Interview ─│
│  [toggle]  AI Coming  │
│    Soon 🔒            │
│                      │
├──────────────────────┤
│ Home Lib  Rec Profile│
└──────────────────────┘
```

### Technical details
- Rewrite `src/pages/RecordFlow.tsx` completely — remove all onboarding steps
- Mock data: 1 book "My Life Story" with 3 chapters
- Use existing components: `Button`, `Switch`, `SkyBackground`, `BottomTabBar`
- Selected book stored in local state
- "AI Interviewer" button uses `opacity-50 pointer-events-none` with a "Coming Soon" badge
- Back button navigates to `/creator-home`

