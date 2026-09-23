# CatchMyBus Comparison Studio

A side-by-side comparison studio for **CatchMyBus** comparing the legacy build (**Old**) against the updated version (**New**).

- **Left (Legacy / v1)**: [https://catchmybus88.vercel.app/](https://catchmybus88.vercel.app/)
- **Right (Updated / v2)**: [https://catchmybusnew.vercel.app/](https://catchmybusnew.vercel.app/)

---

## Features

- **Multiple Comparative View Modes**:
  - **Dual Devices Mode**: Side-by-side mobile device mockups (iPhone 16 Pro, Google Pixel 9 Pro, iPhone SE, Galaxy S24, iPad Mini) with hardware bezels, orientation toggles (Portrait / Landscape), and scalable viewports.
  - **Split Screen Mode**: Full-bleed split screen with interactive draggable divider (20%–80% range, double-click to reset to 50/50).
  - **Curtain Diff Slider Mode**: Visual regression slider overlay allowing pixel-by-pixel comparisons on identical coordinates.
  - **Single App Inspection**: Quick focus modes for Old-only or New-only analysis.
- **Synchronized Controls**:
  - Simultaneous dual-refresh to compare initial render latency and live bus data feeds.
  - Device orientation toggling and zoom scale adjustments (75%, 90%, 100%).
- **Cold-Load Latency Benchmark**:
  - Real-time response timer measuring cold-start latency (ms) for both applications side-by-side with gain percentages.
- **QA Verification & Diff Notes**:
  - Interactive verification checklist covering mobile headers, real-time arrival counters, Singapore 2-hour weather widgets, and favorites.
  - Star rating system and local reviewer findings notepad with clipboard export.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Type check
npm run lint
```
