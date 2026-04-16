

## Current state

The header ("LegacyTape" + subtext) is at the top with `pt-16`. The buttons are in a `flex-1 flex items-center justify-center` wrapper, which centers them in the remaining space between the header and the bottom tab bar. This is already exactly what you're asking for.

**However**, looking more carefully — the `flex-1` container fills all space below the header to the bottom. The buttons should be centered between the **bottom of the header text** and the **top of the bottom tab bar**. The current code already does this with `flex-1 flex items-center justify-center`.

## What I'll do

No changes needed to the header — it stays exactly where it is (`pt-16`). The buttons wrapper with `flex-1 flex items-center justify-center` already centers the buttons in the remaining vertical space between the top text and the bottom tab bar (`pb-20` reserves space for the tab bar).

If the buttons don't appear centered visually, it may be because `pb-20` doesn't match the actual tab bar height. I'll verify by checking the HomeTabBar height and adjust the bottom padding if needed so the buttons are truly centered between the text and the bar.

## Plan

1. **Keep header exactly as-is** — `pt-16`, no changes to position or content
2. **Verify HomeTabBar height** and ensure `pb-20` on the container matches it precisely
3. **Confirm the buttons wrapper** uses `flex-1 flex items-center justify-center` (already does) — this centers buttons in the space between header and bottom bar

This should result in zero visible change to the header and perfectly centered buttons. If the current preview already looks like this, let me know what's off and I can adjust.

