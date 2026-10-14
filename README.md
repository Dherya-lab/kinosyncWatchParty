# 🎬 KinoSync — Real-Time Broadcast Suite & Screening Room

**Experience synchronized movie nights with KinoSync.**

🔗 **Live Deployments**

- 🚀 [KinoSync on Vercel](https://kinosync-watch-party.vercel.app/)
- 🌐 [KinoSync on GitHub Pages](https://dherya-lab.github.io/kinosyncWatchParty/)

KinoSync is a real-time synchronized video streaming and co-watching platform designed to deliver consistent media playback across multiple viewers. Built with a studio-grade broadcast aesthetic, KinoSync addresses network desynchronization, concurrent state mutations, and diverse media sources without relying on heavy external dependencies.

---

## ⚡ Core Highlights

- **Low-Latency Synchronization:** Targets a 95th-percentile (p95) playback control propagation latency of **42 ms**, outperforming the 250 ms requirement.
- **Deterministic Clock & Drift Correction:** Maintains playback drift within **500 ms** using continuous telemetry, adaptive playback-rate adjustments, and monotonic seek correction.
- **Multi-Source Playback Engine:** Supports native HTML5 video (MP4/WebM), automatic CDN fallback, synchronized YouTube embeds, and local-file matching using 64-bit FNV-1a checksums.
- **Collaborative Screening Tools:** Includes crowd-reaction heatmaps, collaborative canvas pointers, upvotable playback queues, live group polls, and timestamp-anchored chat with spoiler concealment.
- **Six Studio-Inspired Themes:** Features Obsidian Studio, Criterion 35mm, Tokyo Console, Paper Daylight, Nordic Alabaster, and Warm Editorial.
- **Zero-Build Deployment:** Runs as a standalone `index.html` application using React 18, Babel Standalone, and Tailwind CSS via CDN.

---

## 📐 Architecture Overview

KinoSync uses a host-authoritative playback model. The host broadcasts the room's playback state, while each client independently calculates the expected media position and corrects synchronization drift.

```text
                     ┌───────────────────────────┐
                     │    Host / Room Broadcaster│
                     └─────────────┬─────────────┘
                                   │
                       Broadcast Playback State
                 { seqId, baseTime, updatedAt, isPlaying }
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
    ┌────────────────────────┐              ┌────────────────────────┐
    │      Client Peer A     │              │      Client Peer B     │
    ├────────────────────────┤              ├────────────────────────┤
    │ 650 ms Telemetry Loop  │              │ 650 ms Telemetry Loop  │
    │                        │              │                        │
    │ Drift ≤ 160 ms: No-op  │              │ Drift ≤ 160 ms: No-op  │
    │ 160–500 ms: Rate Nudge │              │ 160–500 ms: Rate Nudge │
    │ Drift > 500 ms: Seek   │              │ Drift > 500 ms: Seek   │
    │                        │              │                        │
    ├────────────────────────┤              ├────────────────────────┤
    │     Media Engine       │              │     Media Engine       │
    │ HTML5 / YouTube / Local│              │ HTML5 / YouTube / Local│
    └────────────────────────┘              └────────────────────────┘
```

### 1. Deterministic Reference Clock

Instead of repeatedly broadcasting basic play/pause commands, KinoSync represents media playback as a deterministic projection of the most recently synchronized state.

The expected playback position is calculated as:

T_expected = T_base + (t_now - t_updated) * playbackRate

Where:

- T_expected is the expected media position.
- T_base is the media position at the last state update.
- t_now is the current time.
- t_updated is the time associated with the last update.
- playbackRate is the intended playback speed.

Each client calculates the target position locally. This allows late-joining or reconnecting viewers to recover the current room position without accumulating synchronization drift.

### 2. Two-Tier Drift Correction

A background monitoring loop runs every **650 ms**, comparing the actual playback position with the expected position.

The playback offset is defined as:

Delta = T_actual - T_expected

KinoSync applies the following correction strategy:

| **Drift Magnitude** | **Correction Strategy** | **Behavior** |
|---|---|---|
| (Delta < 160ms) | Deadband | No correction is applied, preserving playback stability. |
| (160ms < Delta < 500ms) | Rate Adjustment | Playback speed is adjusted to restore synchronization gradually. |
| (Delta > 500ms) | Hard Seek | Playback jumps to the expected media position. |

For moderate drift, the playback rate is adjusted within a small range:

- **Leading client:** Uses a rate of `0.96×` to slow down.
- **Lagging client:** Uses a rate of `1.04×` to catch up.

Once synchronization is restored, normal playback speed can resume.

### 3. Concurrency & Event Echo Prevention

To prevent repeated play/pause events from circulating between clients, transport mutations are tagged with an incrementing `sequenceId`.

Incoming synchronized events activate a **150 ms local event-suppression guard**, implemented through `suppressLocalEventsRef`. This helps prevent remote state changes from triggering redundant outgoing events.

---

## 📊 Latency & Synchronization Benchmarks

The following figures represent the project's stated benchmark results and targets.

| Metric | Target | Local / LAN | WAN / Cloud | Status |
|---|---:|---:|---:|---|
| Control propagation (p50) | ≤ 100 ms | 14 ms | 26 ms | Pass |
| Control propagation (p95) | ≤ 250 ms | 24 ms | 42 ms | Pass |
| Maximum drift after recovery | ≤ 500 ms | ≤ 80 ms | ≤ 160 ms | Pass |
| Concurrent viewer capacity | ≥ 10 users | 10 peers sustained | 10 peers sustained | Pass |
| Late-join catch-up | Immediate | < 1 frame (42 ms) | < 2 frames (80 ms) | Pass |

> **Note:** These are the benchmark values supplied in the project description. For reproducible performance claims, validate them using documented test conditions, network configurations, and measurement procedures.

---

## 🛠️ Multi-Source Playback Engine

KinoSync supports three playback modes to accommodate different media sources and network conditions.

### 1. Native HTML5 Media — MP4 / WebM

- Supports browser-native HTML5 video playback.
- Uses multiple media sources to improve resilience against unavailable or restricted hosts.
- Supports automatic fallback to secondary and tertiary mirrors when a source fails.
- Maintains room synchronization while recovering from media-source failures.

### 2. Synchronized YouTube Playback

- Uses privacy-enhanced YouTube embeds through [`youtube-nocookie.com`](https://www.youtube-nocookie.com/).
- Configures `referrerPolicy="strict-origin-when-cross-origin"`.
- Handles common YouTube URL formats:
  - Standard watch URLs: `watch?v=VIDEO_ID`
  - Shortened URLs: `youtu.be/VIDEO_ID`
  - Shorts URLs: `/shorts/VIDEO_ID`
  - Raw 11-character video IDs
- Includes handling for incompatible origin parameters and embed-related errors.

### 3. Zero-Bandwidth Local File Matching

Viewers who already possess the same media file can synchronize playback without uploading or streaming the file through KinoSync.

The matching process uses:

- A 64-bit FNV-1a checksum calculated from the first 64 KB of the file.
- The total file size as an additional matching attribute.

This approach reduces bandwidth requirements, although it is a lightweight matching mechanism rather than a cryptographic guarantee that two files are identical.

---

## 🎨 Studio Theme Suite

KinoSync includes six integrated visual themes designed around cinematic screening rooms and professional broadcast consoles.

### 🌑 Dark Themes

| Theme | Design Direction |
|---|---|
| **Obsidian Studio** | Matte-black console with bold red accents. |
| **Criterion 35mm** | Warm cinematic aesthetic with amber highlights. |
| **Tokyo Console** | Deep navy interface with cyber-cyan accents. |

### ☀️ Light Themes

| Theme | Design Direction |
|---|---|
| **Paper Daylight** | Clean technical-paper layout with royal-blue contrast. |
| **Nordic Alabaster** | Minimalist stone palette with emerald-green accents. |
| **Warm Editorial** | Soft parchment tones with terracotta highlights. |

All six themes are accessible from the top control header.

---

## 🚀 Quick Start & Deployment

KinoSync is designed to run as a standalone `index.html` application without a conventional frontend build step.

### Prerequisites

Install the following:

- [Git](https://git-scm.com/downloads), to clone the repository.
- [Node.js](https://nodejs.org/), for the optional `serve` command.

Alternatively, use Python's built-in HTTP server if Python is already installed.

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Dherya-lab/kinosyncWatchParty.git
cd kinosyncWatchParty
```

### 2. Start a Local HTTP Server

**Option A — Using Node.js:**

```bash
npx serve .
```

**Option B — Using Python:**

```bash
python -m http.server 3000
```

If you use Python, open the following address:

[http://localhost:3000](http://localhost:3000)

Open the application in multiple browser tabs to test the interface and room synchronization.

> **Important:** A local static server does not automatically provide cross-device signaling, persistent room state, or a production WebSocket backend. Verify the application's actual networking implementation before testing across devices or deploying it for public use.

### 3. Deploy to Vercel

1. Push the repository to GitHub.
2. Visit [Vercel](https://vercel.com/new).
3. Select **Import Git Repository**.
4. Import `kinosyncWatchParty`.
5. Keep the default settings if the application is served directly from the repository root.
6. Click **Deploy**.

Once deployment completes, open the generated URL to access the application.

---

## 📋 Task Checklist & Core Deliverables

### Room Management & Synchronization

- [x] Create and join screening rooms using six-character room codes or shareable invitation links.
- [x] Synchronize play, pause, seek, and automatic playback progression.
- [x] Maintain monotonic playback-state sequencing.
- [x] Implement continuous drift monitoring and recovery.
- [x] Support late-joining viewers and synchronization recovery.

### Discovery & Navigation

- [x] Movie catalog with category-based discovery.
- [x] Timecode indicators.
- [x] Real-time fuzzy search.

### Social & Collaborative Features

- [x] 20-segment crowd-reaction density heatmap across the playback timeline.
- [x] Floating emoji-reaction tray.
- [x] Timestamp-anchored live chat.
- [x] Spoiler concealment controls.
- [x] Upvotable shared playback queue.
- [x] Live group-polling system.
- [x] Collaborative canvas with laser pointers and telestration.

### Resilience & Testing

- [x] Media-source fallback handling.
- [x] Late-join synchronization recovery.
- [x] Drift-simulation controls.
- [x] Concurrent playback-state management.

---

## 🔒 Privacy & Media Handling

- YouTube playback uses the privacy-enhanced embed domain.
- Local-file matching is designed to compare file signatures without uploading the media itself.
- Actual privacy guarantees depend on the application's networking, analytics, storage, and third-party integrations.

---

## 📄 License

KinoSync is distributed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for details.
