

## Plan: Fix Back Button & Professional Top-Down Layout on All Pages

### Problems
1. **Back button on FollowStory** — `navigate(-1)` should work, but the content is wrapped in `flex-col justify-center` with a `-mt-14` hack that likely causes z-index/overlap issues with the back button area. Need to restructure.
2. **Centering everything vertically is wrong** — Real apps use top-down flow: status bar area → back button → title → content → actions at bottom. Not vertically centered blobs.

### Fix approach
Apply a consistent **top-down layout pattern** across all sub-pages (FollowStory, DeviceSetup, RecordFlow). Like standard iOS apps:

```text
┌────────────────────────┐
│ safe-top padding       │
│ ← Back          (nav)  │
│                        │
│ Page Title             │
│ Subtitle text          │
│                        │
│ [inputs / content]     │
│                        │
│ ── flex spacer ──      │
│                        │
│ [Primary Button]       │
│ [Secondary Button]     │
│ safe-bottom padding    │
└────────────────────────┘
```

### Files to edit

**1. src/pages/FollowStory.tsx**
- Remove `justify-center` and `-mt-14` hack from content wrapper
- Use top-down flow: back button at top (`pt-14`), then title + inputs naturally flowing down with proper margins (`pt-6` for title, `mt-6` for inputs)
- Add `flex-1` spacer before the Continue button, or keep button right below inputs
- Ensure back button is fully tappable (no overlapping elements)

**2. src/pages/DeviceSetup.tsx**
- Already has decent top-down layout, just verify spacing consistency with other pages

**3. src/pages/RecordFlow.tsx**
- Already has top-down layout, consistent — no changes needed

**4. src/pages/Index.tsx**
- Keep `justify-center` here since it's the home/landing page — that's appropriate for a splash-style screen

### Technical details
- FollowStory back button: remove the flex-center wrapper, use standard top-down flow matching DeviceSetup/RecordFlow pattern
- All sub-pages follow: `pt-14` for back row, `pt-6 pb-2` for title section, `flex-1` spacer, bottom actions with `pb-10`
- Inputs sit directly below title with `mt-6`, not floating in center

