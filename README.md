# 💀 Horror Portfolio

> *A React portfolio that rewards curiosity with dread — and ends with a job offer.*

A three-phase horror experience disguised as a developer portfolio. The site starts as an eerie terminal UI, gradually corrupts itself as the visitor browses, flashes subliminal images, and ultimately fires a full-screen jumpscare — before pivoting into a slick "hire me" CTA. Every visual, audio, and behavioural effect escalates in real time based on the visitor's interaction count.

---

## Table of Contents

1. [Demo Flow](#demo-flow)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Running](#installation--running)
5. [Project Structure](#project-structure)
6. [Architecture Overview](#architecture-overview)
7. [The Three Phases — In Detail](#the-three-phases--in-detail)
8. [HorrorContext — The Brain](#horrorcontext--the-brain)
9. [Component Reference](#component-reference)
10. [Required Assets](#required-assets)
11. [Customisation Checklist](#customisation-checklist)
12. [Horror Escalation Map](#horror-escalation-map)
13. [Tuning the Horror](#tuning-the-horror)
14. [CSS Variable Reference](#css-variable-reference)
15. [Deployment](#deployment)
16. [Troubleshooting](#troubleshooting)

---

## Demo Flow

Here is exactly what a visitor experiences, in order:

**Phase 1 — The Landing (0 interactions)**
The visitor arrives at a full-screen looping video background, heavily desaturated and brightened to an eerie grey. A chromatic-aberration title glitches on screen: `ANOMALY_DETECTED`. Four terminal-style navigation buttons sit below it. The ambient audio drone begins on first click. Nothing overtly scary happens yet — it just feels *wrong*.

**Phase 2 — The Portfolio (interactions 3–11)**
On the third click, the site transitions to the main portfolio. A dark sidebar carries the navigation, a live anomaly meter, and a random log number. The main panel shows About, Projects, Skills, and Contact sections. Each interaction quietly increments the horror level. The UI progressively darkens, desaturates, and corrupts: nav labels twist into threatening messages, skill bars start failing, the Contact button pulses red, the cursor changes to a crosshair, a subliminal image flashes for under 200ms, "IT FOUND YOU" bleeds across the screen. By interaction 11 the site looks broken.

**Phase 3 — The Endgame (interaction 12+)**
A full-screen jumpscare video fires with red flash borders. The ambient audio cuts out and a scream plays. After ~2.6 seconds the video gives way to a "broken system" terminal that typewriters out a sequence of horror log lines — then pivots to reveal the twist: *"This is just a portfolio. You made it to the end."* Your name, role, and contact links appear. The visitor can restart the sequence.

---

## Tech Stack

- **React 18** — component architecture, hooks, context API
- **Plain CSS** — no CSS-in-JS, no preprocessor; one file per component plus a shared `Section.css`
- **Google Fonts** — Share Tech Mono, VT323, Creepster (loaded via `<link>` in `index.html`)
- **Web Audio API** — via HTML `<audio>` elements managed through React refs
- **No other runtime dependencies** — just `react`, `react-dom`, and `react-scripts`

---

## Prerequisites

- Node.js 16 or higher
- npm 8 or higher (comes with Node)

Check your versions:

```bash
node -v
npm -v
```

---

## Installation & Running

```bash
# 1. Clone or copy the project folder
cd horror-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
```

This outputs a static site to `/build` that can be served from any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## Project Structure

```
horror-portfolio/
├── public/
│   ├── index.html                  # HTML shell, font preloads, <title>
│   └── assets/                     # ← PUT YOUR MEDIA FILES HERE
│       ├── room-tone.mp3
│       ├── wet-crawl.mp3
│       ├── scream.mp3
│       ├── empty-well.mp4
│       ├── jumpscare.mp4
│       ├── scary1.jpg
│       ├── scary2.jpg
│       └── scary3.jpg
│
├── src/
│   ├── index.js                    # React entry point
│   ├── App.js                      # Root component — phase router
│   ├── App.css                     # Global CSS variables, fonts, cursor
│   │
│   ├── context/
│   │   └── HorrorContext.js        # Global state + all escalation logic
│   │
│   └── components/
│       ├── AudioEngine.js          # Invisible audio element mounter
│       ├── SubliminalLayer.js      # Flash image + scary text overlay
│       ├── SubliminalLayer.css
│       ├── CRTOverlay.js           # Scanlines / noise / vignette (reusable)
│       ├── CRTOverlay.css
│       │
│       ├── PhaseOne.js             # Landing screen
│       ├── PhaseOne.css
│       ├── PhaseTwo.js             # Main portfolio layout
│       ├── PhaseTwo.css
│       ├── PhaseThree.js           # Jumpscare + end screen
│       ├── PhaseThree.css
│       │
│       └── sections/
│           ├── Section.css         # Shared styles for all four sections
│           ├── AboutSection.js
│           ├── ProjectsSection.js
│           ├── SkillsSection.js
│           └── ContactSection.js
│
├── package.json
└── README.md
```

---

## Architecture Overview

The entire horror system runs through a single React Context. No prop drilling, no external state library.

```
App
└── HorrorProvider (context)
    ├── AudioEngine        (invisible — mounts <audio> elements)
    ├── SubliminalLayer    (always rendered — flashes images & text above everything)
    └── [phase === 1] PhaseOne
        [phase === 2] PhaseTwo
            ├── AboutSection
            ├── ProjectsSection
            ├── SkillsSection
            └── ContactSection
        [phase === 3] PhaseThree
```

Every component that needs to trigger or read horror state calls the `useHorror()` hook. The main action is `escalate()` — any component calls it on user interaction and the context handles all consequences automatically.

**Data flow for a single click:**

```
User clicks a nav button
        ↓
handleNavClick() in PhaseTwo
        ↓
escalate() in HorrorContext
        ↓
interactionCount.current += 1
        ↓
setHorrorLevel(Math.min(10, Math.floor(count / 2)))
        ↓
[conditional events fire based on count]
        ↓
[phase changes if threshold crossed]
        ↓
React re-renders affected components
```

---

## The Three Phases — In Detail

### Phase 1 — PhaseOne.js

**What it does:**
Renders the landing screen. A looping background video (`empty-well.mp4`) fills the viewport with a heavy greyscale + contrast filter applied. A radial dark vignette pulses slowly. The `ANOMALY_DETECTED` title is rendered with CSS `::before` / `::after` pseudo-elements for red/cyan chromatic aberration, and a `titleFlicker` animation makes it strobe.

**Horror integration:**
The `glitchActive` state from context applies the `.severe-glitch` class to the whole container — this triggers an invert + hue-rotate CSS animation that makes the whole screen flash to negative for ~300ms. As `horrorLevel` reaches 3, the title changes from `ANOMALY_DETECTED` to `IT_SEES_YOU` and the Contact button gets a red pulsing border.

**Transition to Phase 2:**
Happens automatically inside `HorrorContext` when `interactionCount` reaches 3. The `phase` state flips from `1` to `2`, causing `App.js` to unmount `PhaseOne` and mount `PhaseTwo`.

---

### Phase 2 — PhaseTwo.js + Sections

**What it does:**
The main portfolio experience. A fixed sidebar (260px) on the left holds your name, a system status indicator, the four nav buttons, a live 10-cell anomaly meter, and a fake log number. The right side is a scrollable content panel with a topbar showing the current path and a live clock.

**Horror integration — sidebar:**
- The system status dot starts green (`SYSTEM ONLINE`) and turns red at `horrorLevel >= 4` (`CONTAINMENT FAILING`), blinking faster
- Nav labels corrupt at `horrorLevel >= 6`: "SYS_DATA" → "WHO_ARE_YOU", "ARCHIVES" → "YOUR_WORK_IS_MINE", etc.
- The Contact button gets a red `.danger` class at `horrorLevel >= 3`, flickering with a danger animation
- The anomaly meter cells fill left to right; cells 4–6 turn orange, cells 7–9 turn blood-red and pulse

**Horror integration — main content:**
- A CSS `horror-lvl-N` class is applied to the container at each level, progressively applying `contrast()`, `saturate()`, and `brightness()` filters to the entire viewport
- At `horrorLevel >= 5`, the topbar shows `// IT IS WATCHING` next to the path
- Every 8 seconds, if `horrorLevel >= 4`, there is a 20% chance of a subliminal image flash firing automatically (on top of the click-triggered ones)

**The four sections:**

`AboutSection` — A fake terminal window (`bio.txt`) with your name, role, and bio. Four stat cards (Designation, Location, Experience, Status) each trigger `escalate()` when clicked. At `horrorLevel >= 6` the bio text corrupts to `"DATA CORRUPTED. IT KNOWS YOUR NAME."` and the Status card reads `COMPROMISED`.

`ProjectsSection` — A 2×2 grid of project cards. Each card shows a status badge (DEPLOYED / IN_PROGRESS / ARCHIVED), a project number, title, description, tech tags, and a "VIEW_PROJECT" link. On hover a red scan line animates vertically down the card. At `horrorLevel >= 5` the first card's border turns blood-red and its title glitches. At `horrorLevel >= 7` all titles are replaced with corrupted strings and some descriptions are replaced with `▓▒░ DATA EXPUNGED ░▒▓`.

`SkillsSection` — Skill bars in three categories (Frontend, Backend, Tools). Each bar animates to its percentage on mount. Starting at `horrorLevel >= 4` the displayed percentage begins *draining* — the bars shrink as the horror level climbs, eventually showing "FAILING" in red. At `horrorLevel >= 7` skill names are replaced with `▓▓▓▓▓▓▓▓`. A warning banner appears at level 5: `CAPABILITY DEGRADATION IN PROGRESS`.

`ContactSection` — A contact form with name, email, and message fields. At `horrorLevel >= 3` input placeholders shift to threatening strings ("IDENTIFY_YOURSELF"). At `horrorLevel >= 5` placeholders become `I_ALREADY_KNOW` / `NO_ESCAPE@VOID.NULL`. The submit button pulses red at level 4. A "lore log" sidebar panel appears at level 4, typing out log entries. Clicking Submit calls `executeJumpscare()` directly, triggering Phase 3 immediately regardless of interaction count.

---

### Phase 3 — PhaseThree.js

**What it does:**
A two-stage endgame component that runs entirely on its own internal state (no context needed after trigger).

**Stage 1 — `video` (0–2600ms):**
A full-screen video element plays `jumpscare.mp4` with `contrast(200%) brightness(1.5) saturate(0%)` for maximum visual impact. A CSS animation pulses a red `box-shadow inset` around the entire screen. After 2600ms, state switches to `'broken'`.

**Stage 2 — `broken` (2600ms onward):**
A dark screen with a glitch header whose text cycles through 8 horror messages every 600ms using a `setInterval`. Below it, a terminal panel typewriters out 19 lines at 220ms per line. The first ~10 lines are fake system failure logs. Then the tone shifts — "BUT WAIT. THIS IS JUST A PORTFOLIO." The remaining lines are your pitch. After all lines finish, a 600ms delay reveals the final CTA block with your name, role, email, GitHub, and LinkedIn. A `↺ RESTART SEQUENCE` button calls `window.location.reload()`.

---

## HorrorContext — The Brain

**File:** `src/context/HorrorContext.js`

All horror state lives here. Wrap your app in `<HorrorProvider>` and consume with `useHorror()` in any child component.

### State

| State | Type | Default | Description |
|---|---|---|---|
| `horrorLevel` | `number` | `0` | 0–10 scale. Drives UI corruption intensity across all components. Calculated as `Math.min(10, Math.floor(interactionCount / 2))`. |
| `phase` | `number` | `1` | Which phase is active: `1`, `2`, or `3`. Controls which top-level component `App.js` renders. |
| `glitchActive` | `boolean` | `false` | When true, applies `.severe-glitch` CSS class to the active phase container for a brief screen-invert flash. |
| `flashImage` | `string \| null` | `null` | Path to the currently flashing subliminal image, or `null`. `SubliminalLayer` renders an image only when this is set. |
| `scaryTextVisible` | `boolean` | `false` | When true, `SubliminalLayer` renders a full-screen horror text overlay. |
| `corruptedCursor` | `boolean` | `false` | When true, adds `.cursor-corrupt` to `<div class="App">`, replacing the cursor with a red crosshair SVG via CSS. |
| `isJumpscare` | `boolean` | `false` | Set true when `executeJumpscare()` fires. Prevents double-triggering. |

### Refs

| Ref | Points to |
|---|---|
| `bgAudioRef` | The looping ambient `<audio>` element (managed by `AudioEngine`) |
| `sfxRef` | The one-shot SFX `<audio>` element (src is set dynamically) |
| `scareAudioRef` | The jumpscare scream `<audio>` element |
| `interactionCount` | A `useRef` counter (not state) so increments don't trigger re-renders |

### Functions

**`escalate()`**
Call this from any component on any user interaction. It increments `interactionCount`, recalculates `horrorLevel`, checks phase thresholds, and fires the appropriate event for that specific count. Also runs a random-chance check for image flashes and micro-glitches above level 4.

**`triggerGlitch(duration = 300)`**
Sets `glitchActive` to `true` for `duration` milliseconds. The `.severe-glitch` CSS class inverts and skews the whole container.

**`flashScaryImage()`**
Picks a random image from the `scaryImages` array, sets `flashImage`, and clears it after 80–200ms (randomised). `SubliminalLayer` handles the actual render.

**`playSFX(src)`**
Pauses the SFX audio element, resets its time, sets the new `src`, and plays it. Safe to call rapidly — it always interrupts the previous sound.

**`executeJumpscare()`**
Pauses the ambient audio, plays the scream, sets `isJumpscare` to `true`, and transitions `phase` to `3`. Idempotent — does nothing if already triggered.

**`startAmbientAudio()`**
Plays `bgAudioRef` if it is currently paused. Called once on the first document click event (browsers block autoplay without a user gesture).

---

## Component Reference

### `App.js`
The root. Wraps everything in `<HorrorProvider>`. Renders `AudioEngine` and `SubliminalLayer` unconditionally (they need to be present in all phases). Reads `phase` from context and conditionally renders `PhaseOne`, `PhaseTwo`, or `PhaseThree`. Also attaches the one-time click listener that starts ambient audio.

### `AudioEngine.js`
Invisible component. Its only job is to render three `<audio>` elements and attach them to the refs in `HorrorContext`. Keeping audio separate from UI components means no audio element ever gets unmounted during phase transitions.

### `SubliminalLayer.js`
Always rendered, always at the top of the DOM (`z-index: 99999`). Reads `flashImage` and `scaryTextVisible` from context. When `flashImage` is set, it renders a full-viewport image with `mix-blend-mode: hard-light` and `filter: contrast(200%) saturate(0%) brightness(180%)` — this maximises visual shock while keeping it coherent with the site's greyscale palette. The scary text is randomly selected from a hardcoded array of 6 messages and animates in/out with `bleedIn` / `bleedOut` keyframes.

### `CRTOverlay.js`
A purely decorative layer with four sub-divs: scanlines (repeating gradient), noise (SVG turbulence data URI), vignette (inset box-shadow), and flicker (occasional white flash). Accepts an `intensity` prop (default `1`) which scales opacity via a CSS custom property `--crt-intensity`. Phase Two passes `0.8 + horrorLevel * 0.08` so the CRT effect becomes more pronounced as horror escalates.

### `PhaseOne.js`
Landing screen. See [Phase 1 detail](#phase-1--phaseonejs) above.

### `PhaseTwo.js`
Portfolio shell. Renders the sidebar and the active section. See [Phase 2 detail](#phase-2--phasetwojs--sections) above.

### `PhaseThree.js`
Endgame screen. Self-contained, manages its own `stage` state internally. See [Phase 3 detail](#phase-3--phasethreejs) above.

### `sections/AboutSection.js`
Bio section with a terminal window UI, stat cards, and external links.

### `sections/ProjectsSection.js`
Project card grid. Defines the `PROJECTS` array at the top of the file — edit this array to add or modify projects.

### `sections/SkillsSection.js`
Skill bars with drain animation. Defines `SKILL_CATEGORIES` at the top — edit to change skill names and percentages. The `SkillBar` sub-component handles the drain calculation and animation.

### `sections/ContactSection.js`
Contact form. The Submit button is the most direct path to Phase 3 — it calls `executeJumpscare()` after a 1.2 second delay to let the "CONNECTING..." state show first.

---

## Required Assets

Place all media in `/public/assets/`. The filenames are hardcoded — either use these exact names or update the references in code.

| Filename | Type | Used in | Notes |
|---|---|---|---|
| `room-tone.mp3` | Audio | `AudioEngine` | Looping ambient drone. A low-frequency hum or distant wind works well. Should be seamlessly loopable — match the start and end of the waveform in an audio editor. 30–120 seconds long, ~128kbps is fine. |
| `wet-crawl.mp3` | Audio | `HorrorContext` (counts 3 and 7) | Short one-shot SFX, 1–3 seconds. Wet, organic, uncomfortable. Used twice during escalation. |
| `scream.mp3` | Audio | `HorrorContext` (jumpscare trigger) | The jumpscare scream. Plays simultaneously with the video. Loud, abrupt, no fade-in. |
| `empty-well.mp4` | Video | `PhaseOne` | Background loop. Dark, murky, slow-moving. Looks best when heavily desaturated (the CSS applies `grayscale(100%)` so any colour palette works). Keep it under 10MB. |
| `jumpscare.mp4` | Video | `PhaseThree` | 2–3 seconds. High contrast, fast movement. The CSS applies `contrast(200%) brightness(1.5) saturate(0%)` so shoot for something with strong dark/light separation. A face rushing toward camera is the classic. |
| `scary1.jpg` | Image | `SubliminalLayer` | Subliminal flash image. High contrast, disturbing, recognisable in under 200ms. Greyscale recommended. |
| `scary2.jpg` | Image | `SubliminalLayer` | Same guidance as `scary1.jpg`. |
| `scary3.jpg` | Image | `SubliminalLayer` | Same guidance as `scary1.jpg`. |

> **On subliminal images:** The flash duration is 80–200ms. At that speed, conscious recognition is unreliable — but the brain still processes it subliminally and registers unease. High-contrast close-up faces (especially eyes or mouths) work best because face detection is a hard-wired, pre-conscious process. Greyscale fits the existing palette and avoids breaking immersion with a sudden colour pop.

> **On the ambient audio:** Browsers require a user gesture before playing audio. The app handles this with a one-time `click` event listener in `App.js` that calls `startAmbientAudio()`. The ambient drone begins on the visitor's very first click anywhere on the page — which is the first nav button click on the landing screen.

> **Where to find assets:** Royalty-free horror ambience at freesound.org. Royalty-free video footage at Pexels or Pixabay. For jumpscare footage, search "jumpscare video free use" on YouTube or Vimeo. For subliminal images, high-contrast greyscale portraits from Unsplash work well — or create your own in any image editor by cranking contrast to maximum.

---

## Customisation Checklist

Search the entire `src/` folder (and `public/index.html`) for these placeholders and replace with your real information.

### Personal details (5 files)

| Placeholder | Replace with | Found in |
|---|---|---|
| `[YOUR_NAME]` | Your full name | `PhaseTwo.js`, `PhaseThree.js`, `public/index.html` |
| `[YOUR_ROLE]` | e.g. `Full Stack Developer` | `AboutSection.js`, `PhaseThree.js` |
| `[YOUR_CITY]` | e.g. `Mumbai, India` | `AboutSection.js`, `ContactSection.js` |
| `[YOUR_EMAIL]` | Your email address | `ContactSection.js`, `PhaseThree.js` |
| `[YOUR_HANDLE]` | GitHub + LinkedIn username | `PhaseThree.js` (used in both URLs) |

> If your GitHub and LinkedIn handles differ, update them separately in `PhaseThree.js` — the GitHub href uses `https://github.com/[YOUR_HANDLE]` and LinkedIn uses `https://linkedin.com/in/[YOUR_HANDLE]`.

### Bio (`AboutSection.js`)

Replace `[INSERT PERSONAL BIO / DESCRIPTION HERE. ...]` with 2–3 sentences about yourself. The terminal window keeps it on-brand if you write in a slightly clipped, factual tone.

### Projects (`ProjectsSection.js`)

The `PROJECTS` array at the top of the file has 4 entries. For each one, fill in:

```js
{
  title: 'Your Project Name',
  description: 'What you built and why it matters. 1–2 sentences.',
  tags: ['React', 'Node.js', 'PostgreSQL'],
  link: 'https://your-project-url.com',
  status: 'DEPLOYED',  // or 'IN_PROGRESS' or 'ARCHIVED'
}
```

Add or remove objects in the array to change the number of cards. The grid is set to 2 columns; with more than 4 projects it will scroll naturally.

### Skills (`SkillsSection.js`)

The `SKILL_CATEGORIES` array has 3 categories. For each skill entry:

```js
{ name: 'React', level: 90 },  // level is 0–100
```

The `level` is the percentage the bar fills to on mount. You can rename categories by changing the `label` field. The `icon` field is a Unicode character displayed next to the category name.

Also update the three `[INSERT CERTIFICATION / ACHIEVEMENT HERE]` strings in the extras list at the bottom of the section.

### Page title

In `public/index.html`, change:

```html
<title>[YOUR_NAME] // ANOMALY_DETECTED</title>
```

---

## Horror Escalation Map

Every call to `escalate()` increments the internal `interactionCount` ref. The following events are hardcoded to specific counts. All thresholds are in `HorrorContext.js`.

| Count | `horrorLevel` | Event |
|---|---|---|
| 1 | 0 | Nothing visible. Count starts. |
| 2 | 1 | `horrorLevel` becomes 1. Contact button border fades to red. |
| 3 | 1 | **Phase 2 unlocks.** Transitions from landing to portfolio. 200ms screen glitch fires. `wet-crawl.mp3` plays. |
| 4 | 2 | `horror-lvl-2` CSS class applied: slight contrast increase. |
| 5 | 2 | **Subliminal image flash** (80–200ms). |
| 6 | 3 | Contact nav label gets `▓▒░` prefix. |
| 7 | 3 | 500ms screen glitch. `wet-crawl.mp3` plays again. `document.body.style.filter` set to `contrast(130%) saturate(60%)`. |
| 8 | 4 | Level 4 threshold: 15% random chance of image flash on every subsequent call. 10% random chance of micro-glitch. |
| 9 | 4 | **Second subliminal flash.** Cursor replaced with red crosshair. |
| 10 | 5 | `horror-lvl-5` filter kicks in. Topbar shows `// IT IS WATCHING`. |
| 11 | 5 | 800ms screen glitch (the longest). Scary text message bleeds in for 2 seconds. |
| 12 | 6 | **Phase 3 triggered.** Ambient audio cuts. Scream plays. Jumpscare video fills screen. |

**What counts as an interaction:** Every `onClick` on nav buttons, project cards, stat cards, skill rows, extra items, about links, and the contact form's field focus events all call `escalate()`. Hovering a project card also triggers it. A visitor who methodically explores every section will naturally hit the threshold within a normal browsing session.

---

## Tuning the Horror

### Lengthen the experience

In `HorrorContext.js`, change the Phase 3 threshold:

```js
// Default — triggers on interaction 12
if (count >= 12 && phase === 2) setPhase(3);

// Slower burn — gives visitors more time to explore
if (count >= 20 && phase === 2) setPhase(3);
```

Adjust the `horrorLevel` formula at the same time to keep the visual escalation proportional:

```js
// Default
const newLevel = Math.min(10, Math.floor(count / 2));

// For a count-20 trigger, slower ramp
const newLevel = Math.min(10, Math.floor(count / 3));
```

### Add more subliminal images

In `HorrorContext.js`, add paths to the `scaryImages` array:

```js
const scaryImages = [
  '/assets/scary1.jpg',
  '/assets/scary2.jpg',
  '/assets/scary3.jpg',
  '/assets/scary4.jpg',  // add as many as you like
];
```

### Change the flash duration

In `HorrorContext.js`, find `flashScaryImage`:

```js
// Default: subliminal range (80–200ms)
setTimeout(() => setFlashImage(null), 80 + Math.random() * 120);

// Make it visible — visitor clearly sees the image
setTimeout(() => setFlashImage(null), 400 + Math.random() * 200);
```

### Add a new SFX at a specific count

In the `escalate()` function in `HorrorContext.js`:

```js
if (count === 6) {
  playSFX('/assets/your-new-sound.mp3');
}
```

### Trigger the jumpscare from Contact only

Remove the count-based trigger in `HorrorContext.js`:

```js
// Delete or comment this block:
if (count >= 12) {
  executeJumpscare();
}
```

`ContactSection.js` already calls `executeJumpscare()` on submit independently, so the contact-only path still works.

### Change the typewriter speed in Phase 3

In `PhaseThree.js`, find the `setInterval` in the second `useEffect`:

```js
// Default: 220ms per line
const interval = setInterval(() => { ... }, 220);

// Slower, more dramatic
const interval = setInterval(() => { ... }, 400);
```

### Change the Phase 3 glitch messages

In `PhaseThree.js`, edit the `GLITCH_MESSAGES` array at the top of the file.

---

## CSS Variable Reference

Defined in `App.css` on `:root`. Change these to retheme the whole site without hunting through individual component files.

| Variable | Default | Used for |
|---|---|---|
| `--blood` | `#8b0000` | Dark red — borders, meter cells, contact warning |
| `--blood-bright` | `#cc0000` | Bright red — active states, glitch text, highlights |
| `--terminal-green` | `#00ff41` | Status dot, skill bar fill (normal), terminal cursor |
| `--terminal-dim` | `#005c18` | Dim green — eyebrow text, footer text |
| `--void` | `#050505` | Base background across all phases |
| `--font-mono` | `'Share Tech Mono'` | Body text, labels, all UI copy |
| `--font-horror` | `'VT323'` | Section titles, phase titles, Phase 3 header |
| `--font-display` | `'Creepster'` | Available for display use (loaded but not applied by default) |

---

## Deployment

### Vercel (recommended)

```bash
npm run build
npx vercel --prod
# or connect your Git repo at vercel.com for automatic deploys
```

### Netlify

```bash
npm run build
# Drag the /build folder to app.netlify.com/drop
# Or connect your Git repo: build command = npm run build, publish dir = build
```

### GitHub Pages

Add `"homepage": "https://[YOUR_GITHUB_USERNAME].github.io/[REPO_NAME]"` to `package.json`, then:

```bash
npm install --save-dev gh-pages
```

Add to `package.json` scripts:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

Then run:

```bash
npm run deploy
```

---

## Troubleshooting

**The ambient audio doesn't play.**
Browsers block autoplay until a user gesture. The audio starts on the visitor's first click anywhere on the page — this is intentional and unavoidable. Confirm `room-tone.mp3` exists at `/public/assets/room-tone.mp3`.

**The jumpscare video shows a broken icon.**
The browser can't find `/assets/jumpscare.mp4`. Confirm the file is in `/public/assets/` — not `/src/assets/`. Files in `/public` are served at the root URL path. Files in `/src` need an `import` statement and go through Webpack — do not put media there.

**The site jumps straight to Phase 3 without escalating.**
Something is calling `escalate()` many times on mount. Check for `useEffect` hooks with missing or incorrect dependency arrays that might be looping.

**CSS fonts aren't loading.**
The Google Fonts `<link>` is in `public/index.html`. If you're in an environment that blocks Google's CDN, download the font files (Share Tech Mono, VT323, Creepster) and serve them locally from `/public/assets/fonts/`, then update the `@import` in `App.css`.

**The subliminal images aren't noticeable.**
Duration is the key variable — see [Tuning the Horror](#tuning-the-horror). The images also need strong contrast. A washed-out low-contrast image at 150ms is nearly invisible; a stark white-on-black close-up face registers even at 80ms.

**`useHorror must be used inside HorrorProvider` error.**
A component is calling `useHorror()` outside of the `<HorrorProvider>` tree. Confirm `HorrorProvider` wraps everything in `App.js`, not just a subset of components.

**Build succeeds but styles look wrong in production.**
Check that every CSS file is explicitly imported in its corresponding JS file. `react-scripts` only bundles CSS that is imported somewhere in the component tree.

**The `↺ RESTART SEQUENCE` button doesn't reset the horror level.**
It calls `window.location.reload()` which performs a full page reload — this is intentional. All React state (including `interactionCount`) is reset to zero on reload.
