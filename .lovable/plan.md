

## Plan: Selectable Options with Continue Button on "Whose" Step

### Changes to `src/pages/RecordFlow.tsx`

1. **Add `whose` selection state**: New state `const [whose, setWhose] = useState<"mine" | "other" | null>(null)`
2. **Move options up**: Remove the `flex-1 min-h-8` spacer that pushes the cards to the bottom. Place the option cards right below the title with `mt-6`.
3. **Make cards selectable (not navigating)**: On click, set `whose` state instead of calling `setStep("name")`. Add a visual selected state — highlighted border (`border-primary`) when selected, default border otherwise.
4. **Add Continue button at bottom**: Add `flex-1` spacer after the cards, then a Continue button pinned to the bottom (`pb-10`), disabled until `whose` is selected. On click, advance to `setStep("name")`.

### Layout for "whose" step
```text
← Back                Step 1 of 4
                                  
Record a Book                     
Whose story would you like...     
                                  
┌─────────────────────────┐       
│ 👤 Mine                 │  ← selectable
│ Record your own story   │       
└─────────────────────────┘       
┌─────────────────────────┐       
│ 👥 Someone Else's       │  ← selectable
│ Help capture a loved... │       
└─────────────────────────┘       
                                  
    ── flex spacer ──             
                                  
   [ Continue (disabled) ]        
```

### Technical details
- Selected card: `border-primary bg-primary/5` ; unselected: `border-border/60 bg-card/80`
- Continue button same style as other steps: `w-full h-13 text-base rounded-xl font-semibold`
- `disabled={!whose}`

