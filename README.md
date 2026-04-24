# SimplTimer

A clean, minimalistic world clock, timer, and stopwatch web app with a frosted glass UI and draggable snap-grid widgets.

**Authors:** Emmanuel Buhari & Aaditya Dhungana  
**Year:** 2026

---

## Features

### World Clock

- Real-time clock display using the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API
- Toggle between **12H** and **24H** formats
- Search and select from a full timezone list
- Add up to **3 extra clock widgets**, each with its own independent timezone

### Timer

- Set hours, minutes, and seconds via increment/decrement controls or direct input
- Save up to 5 custom timer presets
- Audio alert on completion

### Stopwatch

- Start, stop, reset
- Record lap times with a lap history modal

---

## UI & Design

- **Frosted glass morphism** on all widgets using `backdrop-filter`
- **Globe wallpaper** background blended with a theme-aware overlay
- **Dark / Light mode** toggle using a 5-colour blue palette (`#b9d6f2`, `#061a40`, `#0353a4`, `#006daa`, `#003559`)
- **Focus mode** — blurs all UI except the active time display for distraction-free viewing
- **Draggable snap grid** — drag the main widget or any extra clock to snap to a grid of positions:
  - **5-col × 3-row** (15 points) on screens ≥ 768px
  - **3 × 3** (9 points) on smaller screens
- **Responsive** to screen resize — widgets reattach to the nearest valid snap zone

---

## Keyboard Shortcuts

| Key     | Action                                    |
| ------- | ----------------------------------------- |
| `1`     | World Clock                               |
| `2`     | Timer                                     |
| `3`     | Stopwatch                                 |
| `Space` | Start / Stop                              |
| `R`     | Reset                                     |
| `L`     | Record Lap (Stopwatch)                    |
| `V`     | View Laps                                 |
| `Tab`   | Cycle timer field focus (H → M → S)       |
| `↑ / ↓` | Increment / Decrement focused timer field |
| `T`     | Toggle theme                              |
| `H`     | Toggle hour format                        |
| `Esc`   | Close modal / dropdown                    |

---

## Tech

- Vanilla HTML, CSS, JavaScript — no frameworks or build tools
- [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for timezone-aware time rendering
- [Font Awesome](https://fontawesome.com/) for icons
- [Digital-7](https://www.dafont.com/digital-7.font) monospace font for clock digits
- Sound effect from [Pixabay](https://pixabay.com/)
