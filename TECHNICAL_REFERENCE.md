# Technical Reference — Legacy Tape App

> Written for AI editors and developers to understand how this project was built and how to extend it.

---

## Stack

- **React 18** + **TypeScript 5** (Vite 5 build)
- **Tailwind CSS v3** with semantic HSL design tokens via `index.css` + `tailwind.config.ts`
- **shadcn/ui** component library (Radix primitives + Tailwind)
- **React Router v6** for client-side routing
- **TanStack React Query** for async state (currently unused but wired up)
- **Framer Motion** — not installed; animations use CSS (`animate-ping`, transitions)
- **No backend** — fully client-side SPA

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── BottomTabBar.tsx  # Tab bar for Creator flow (Home, Dashboard, Record, Profile)
│   ├── FollowerTabBar.tsx# Tab bar for Follower flow (Home, Library, Book View, Profile)
│   ├── HomeTabBar.tsx    # Tab bar for landing/home (Home, Buy Device, Profile)
│   ├── ModeSwitch.tsx    # Toggle between Creator and Follower modes
│   ├── NavLink.tsx       # Reusable nav link component
│   └── SkyBackground.tsx # Gradient sky background used across pages
├── pages/
│   ├── Index.tsx         # Landing page — 4-square grid (Record, Follow, Buy Device, Profile)
│   ├── RecordFlow.tsx    # Creator recording flow — select/create book, record chapter
│   ├── RecordingSession.tsx # Live recording screen with mic, volume meter, transcript
│   ├── CreatorHome.tsx   # Creator dashboard/home
│   ├── CreatorLibrary.tsx# Creator's book library
│   ├── CreatorProfile.tsx# Creator profile page
│   ├── FollowStory.tsx   # Follower entry — enter code + last name to follow a story
│   ├── FollowerProfile.tsx# Follower profile page
│   ├── Dashboard.tsx     # Follower dashboard — listen to followed stories
│   ├── DeviceSetup.tsx   # Physical device setup flow
│   └── NotFound.tsx      # 404 page
├── hooks/
│   ├── use-mobile.tsx    # Responsive breakpoint hook
│   └── use-toast.ts      # Toast notification hook
├── lib/
│   └── utils.ts          # cn() utility (clsx + tailwind-merge)
├── index.css             # Tailwind directives + CSS custom properties (design tokens)
├── App.tsx               # Root component — QueryClient, Router, all routes
└── main.tsx              # Entry point — renders App into #root
```

---

## Architecture Decisions

### 1. Two User Flows: Creator vs Follower

The app serves two distinct user types:

- **Creator** — records audio "books" (collections of chapters). Routes: `/record`, `/recording-session`, `/creator-home`, `/creator-library`, `/creator-profile`.
- **Follower** — enters a code to follow and listen to a loved one's stories. Routes: `/follow`, `/dashboard`, `/follower-profile`.

Each flow has its own bottom tab bar component. The landing page (`Index.tsx`) is a 4-square grid that branches into either flow.

### 2. Recording Session (`RecordingSession.tsx`)

This is the most technically complex page. It uses three browser APIs simultaneously:

#### Audio Capture — MediaRecorder API
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream);
recorder.start();
```
- Requests mic permission on mount
- Supports pause/resume via `recorder.pause()` / `recorder.resume()`
- Stops all tracks on unmount to release the microphone

#### Volume Meter — Web Audio API
```typescript
const ctx = new AudioContext();
const source = ctx.createMediaStreamSource(stream);
const analyser = ctx.createAnalyser();
analyser.fftSize = 256;
source.connect(analyser);
```
- Reads frequency data in a `requestAnimationFrame` loop
- Averages byte frequency data and normalizes to 0–1 range
- Drives two **vertical** volume bars flanking the mic icon
- Bars use `height` percentage style, growing from bottom to top
- Container: `flex flex-col justify-end` ensures bottom-up fill

#### Live Transcription — Web Speech API
```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";
```
- No external API keys needed — runs entirely in-browser
- Works in Chrome, Edge, Safari (graceful fallback message if unsupported)
- Concatenates all results into a single transcript string
- Auto-scrolls transcript container via `scrollIntoView`

#### Cleanup
All three systems (MediaRecorder, AudioContext animation loop, SpeechRecognition, setInterval timer) are properly cleaned up in the `useEffect` return function and `stopRecording`.

### 3. Tab Bar System

Three separate tab bar components handle navigation for different sections:

| Component | Used In | Tabs |
|-----------|---------|------|
| `HomeTabBar` | Landing page | Home, Buy Device (external link), Profile |
| `BottomTabBar` | Creator flow | Home, Dashboard, Record, Profile |
| `FollowerTabBar` | Follower flow | Home, Library, Book View, Profile |

`FollowerTabBar` accepts an `onBookView` callback prop so the parent page can handle the Book View action (e.g., toggling a book view overlay) without navigating away.

### 4. Design System

All colors use HSL CSS custom properties defined in `index.css`:
```css
:root {
  --background: 0 0% 100%;
  --primary: 221.2 83.2% 53.3%;
  /* etc. */
}
```

Components reference these via Tailwind classes like `bg-primary`, `text-muted-foreground`, `border-border`. **Never use raw color values in components.**

The `SkyBackground` component provides a consistent gradient backdrop across pages.

### 5. Routing

All routes are defined in `App.tsx`. The app uses `react-router-dom` v6 with `BrowserRouter`. Navigation uses `useNavigate()` hooks and `navigate()` calls — no `<Link>` components in tab bars (they use `<button>` for better touch targets).

---

## Key Patterns for AI Editors

### Adding a new page
1. Create `src/pages/YourPage.tsx`
2. Import and add route in `src/App.tsx`
3. Include appropriate tab bar component if needed

### Adding a new tab bar
1. Create `src/components/YourTabBar.tsx` following the pattern in `BottomTabBar.tsx`
2. Use `useLocation` for active state, `useNavigate` for navigation
3. Include in the relevant page(s)

### Extending the recording session
- Audio blobs from `MediaRecorder` are not yet persisted — wire `recorder.ondataavailable` to save chunks
- Transcript is in-memory only — add persistence via backend or local storage
- Volume meter sensitivity can be tuned by changing `analyser.fftSize` (higher = smoother) and the normalization divisor (currently `128`)

### Styling rules
- Use semantic Tailwind tokens (`bg-card`, `text-foreground`, etc.)
- All colors must be HSL values in CSS custom properties
- Mobile-first — the app targets 390×844 viewport (iPhone-sized)
- Use `safe-top` / `safe-bottom` classes for notch/home-indicator safe areas

---

## External Links

- **Buy Device**: Links to `https://mylegacytape.com` (opens in new tab)
- No other external dependencies or API integrations currently

---

## File Size Notes

`RecordingSession.tsx` is ~227 lines. If extending significantly, consider extracting:
- `useAudioRecorder` hook (MediaRecorder + AudioContext logic)
- `useSpeechTranscript` hook (SpeechRecognition logic)  
- `VolumeMeter` component (the vertical bar UI)
