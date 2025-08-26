# Red-Blue-Pill
Flip Your Algorithm

See what your feed hides. Red-Blue Pill lets you toggle to an opposite or diversified view on major sites—starting with YouTube and Google Search—while keeping your data on your device.

# What it does (MVP)

Profile readback (local): On-device heuristics infer what your feed favors (topics, brands, leanings).

Flip mode: Overlay clearly labeled panels that surface contrasting content (e.g., opposite political slant, competitor brands, more uplifting items).

YouTube (first target): “Opposite topics” rail you can browse with one click.

Google Search (first target): “Outside your bubble” panel to compare less-personalized results.

Controls: Global ON/OFF toggle, intensity slider, per-category switches (politics / brands / mood), and Delete my data.

The extension adds labeled overlays; it doesn’t impersonate accounts or secretly replace native content.

# Privacy & Data

Default: on-device only. Analysis and settings live in your browser (chrome.storage.local).

Opt-in telemetry (optional): If enabled, only high-level, anonymous usage stats are sent to improve suggestions. Off by default.

One-click wipe: A visible “Delete my data” button clears everything the extension stored.

No third-party sharing: We do not sell or share personal data. Anonymized aggregate metrics are used only if you opt in.

# Why this exists

Algorithms narrow what we see. Over time, feeds reflect our preferences back at us, making other viewpoints (or even other products) seem invisible. Red-Blue Pill gives you a frictionless switch to explore outside that bubble—on your terms.

🧩 Scope & Roadmap

Current (Pre-alpha / planning):

Chromium browsers (Chrome/Edge/Brave)

Sites: YouTube + Google Search

Local heuristics; basic “opposite” rules

Next:

Smarter opposite mappings (media-bias sources, brand competitor graph, mood safeguards)

Side-by-side “neutral” result diffs for Google

Optional, light X/Twitter panel using public lists

Per-site toggles & better small-screen layouts

Later (exploration):

Facebook/Instagram analysis overlays (non-intrusive; avoid brittle injections)

Firefox (desktop + Android) & Safari Web Extension packaging

Classroom/education mode (media-literacy exercises)

# Safety & Content Standards

Quality over outrage: Prefer reputable, mainstream sources when flipping viewpoints; avoid promoting known misinformation or extremist content.

Clear labeling: Overlays always show “via Red-Blue Pill”.

User control first: Easy dismiss, quick toggle back, intensity control.




# Local install (for testers)

Clone or download this repo.

In Chrome/Edge: open chrome://extensions (or edge://extensions) → Developer mode ON.

Click Load unpacked → select the project folder.

Pin the extension icon → visit YouTube or Google to see overlays.

Use the popup to toggle features; try Options → Delete my data.
