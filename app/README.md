# 💀 HORROR PORTFOLIO — Setup Guide

A multi-phase horror portfolio that escalates from creepy to terrifying as the
visitor browses. Built with React, no external dependencies beyond `react-scripts`.

---

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## File Structure

```
src/
├── App.js                         # Root — wires HorrorProvider + phase routing
├── App.css                        # Global CSS vars, fonts, cursor corruption
│
├── context/
│   └── HorrorContext.js           # Global horror state + escalation logic
│
└── components/
    ├── AudioEngine.js             # Mounts all audio elements (invisible)
    ├── SubliminalLayer.js         # Flash images + scary text overlays
    ├── CRTOverlay.js              # Reusable scanlines / vignette / noise
    │
    ├── PhaseOne.js / .css         # Landing screen (video loop)
    ├── PhaseTwo.js / .css         # Main portfolio (sidebar + sections)
    ├── PhaseThree.js / .css       # Jumpscare + broken terminal end screen
    │
    └── sections/
        ├── AboutSection.js        # Bio + terminal window + stat cards
        ├── ProjectsSection.js     # Project cards grid
        ├── SkillsSection.js       # Skill bars that drain as horror escalates
        ├── ContactSection.js      # Contact form (triggers the jumpscare)
        └── Section.css            # Shared styles for all four sections
```

---

## Required Assets

Place these in `/public/assets/`:

| File               | What it is                                         |
|--------------------|----------------------------------------------------|
| `room-tone.mp3`    | Looping ambient drone / unsettling background hum  |
| `wet-crawl.mp3`    | Short SFX — plays on escalation events             |
| `scream.mp3`       | Jumpscare scream — plays at Phase 3                |
| `empty-well.mp4`   | Background video that loops on landing screen      |
| `jumpscare.mp4`    | ~2–3 second jumpscare clip (black + white works)   |
| `scary1.jpg`       | Subliminal flash image #1                          |
| `scary2.jpg`       | Subliminal flash image #2                          |
| `scary3.jpg`       | Subliminal flash image #3                          |

> **Tip for jumpscare images:** High-contrast face close-ups (greyscale) work
> best because they flash for under 200ms. Your brain processes them before
> your eyes can consciously register them.

---

## Customisation Checklist

Search the codebase for these placeholders and replace them:

- `[YOUR_NAME]` — your full name
- `[YOUR_ROLE]` — e.g. "Full Stack Developer"
- `[YOUR_CITY]` — e.g. "Mumbai, India"
- `[YOUR_EMAIL]` — your email address
- `[YOUR_HANDLE]` — your GitHub and LinkedIn username
- `[INSERT PROJECT TITLE HERE]` — project names in `ProjectsSection.js`
- `[INSERT PROJECT DESCRIPTION HERE]` — project descriptions
- `[TECH]` — technology tags per project
- `[SKILL NAME]` — skill names in `SkillsSection.js`
- `[INSERT CERTIFICATION / ACHIEVEMENT HERE]` — in SkillsSection extras
- `[INSERT PERSONAL BIO / DESCRIPTION HERE]` — in `AboutSection.js`

---

## Horror Escalation Map

| Interaction # | Event                                              |
|---------------|----------------------------------------------------|
| 1–2           | Phase 1 — Landing. `horrorLevel` ticks up quietly  |
| 3             | Phase 2 unlocks. Glitch + wet crawl SFX fires      |
| 5             | Random subliminal image flash                      |
| 7             | Longer glitch, UI filter darkens                   |
| 9             | Flash image again, cursor becomes a red crosshair  |
| 11            | Scary text bleeds in for 2 seconds                 |
| 12+           | **Phase 3 triggered.** Jumpscare + end screen      |

Every nav click, project hover, skill click, form focus, and link click counts
as one interaction. You can tune the thresholds in `HorrorContext.js`.

---

## Tuning Tips

- **Make it longer:** Change `count >= 12` to `count >= 20` in `HorrorContext.js`
  for a more drawn-out experience.
- **More flash images:** Add more paths to the `scaryImages` array in `HorrorContext.js`.
- **Different SFX per event:** Call `playSFX('/assets/your-sound.mp3')` from any
  section's `onClick` handler.
- **Disable jumpscare on Contact only:** Remove `executeJumpscare()` from
  `ContactSection.js` and keep it only on the count threshold.
