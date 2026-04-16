

## Plan: Fix Topic Blocks, Custom Topic Input, Progress Bar, and Bottom Bar

### 1. Uniform topic blocks
Make all 6 topic buttons the same fixed height (`h-16`) so they're visually uniform regardless of label length. Use `flex-col items-center justify-center text-center` layout with icon on top and label below.

### 2. Custom topic flow
When "Custom" is selected, show an input area below the grid: a text input for the topic name and a textarea for custom questions, with a simple card-style container.

### 3. Progress bar based on 12 chapters
Change the progress calculation from `recorded/total` to `recorded/12` (12 = complete book). So 3 chapters = 25%, 6 = 50%, etc.

### 4. Bottom bar — remove Record accent style
Remove the `accent: true` property from the Record tab and the special floating circle rendering. Record icon will use the same style as Home, Library, Profile — just an icon that highlights when active.

### Files changed

**`src/components/BottomTabBar.tsx`**
- Remove `accent` property from Record tab
- Remove the accent conditional rendering block — all tabs render the same way

**`src/pages/RecordFlow.tsx`**
- Topic buttons: add fixed `h-16`, change layout to `flex-col items-center justify-center text-center`
- Add state: `customTopicName`, `customQuestions`
- When `selectedTopic === "custom"`, render a card below the grid with an Input (topic name) and Textarea (questions)
- Progress bar: change denominator from `book.chapters.length` to `12`

