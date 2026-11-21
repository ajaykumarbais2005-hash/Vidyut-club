# Vidyut Club — Official Landing Page

A premium, responsive landing page for **Vidyut Club**, a college technical and innovation club. Built with semantic HTML, modern CSS, and vanilla JavaScript.

## Project Structure

```text
vidyut-club/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo.svg
└── README.md
```

> This workspace contains the same structure at the project root.

## Features

- Sticky, glassmorphism-inspired navbar with active link highlighting and animated mobile menu
- Hero section with animated gradients, grid/energy effects, and clear calls to action
- About, Events, Team, Benefits, and Join/Registration sections with editable placeholders
- Light/Dark mode toggle (dark by default) with `localStorage` persistence
- Scroll reveal animations using Intersection Observer
- Frontend registration form demo with validation, loading state, and success confirmation
- Responsive layout for desktop, laptop, tablet, and mobile screens
- Accessibility-minded interactions, including reduced-motion support

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- [Lucide Icons](https://lucide.dev/) (CDN script)
- Google Fonts

## Getting Started

1. Open the project folder in VS Code.
2. Open `index.html` in a browser, or use a local development server (recommended), e.g. VS Code Live Server.
3. Edit content placeholders (team names, contact details, event dates/venues, social links) directly in `index.html`.

## Customization Notes

- **Events:** Event cards are sample/demo entries and marked editable in HTML comments/data attributes.
- **Team:** Profile names, images, and details are placeholders—replace with official information when available.
- **Registration form:** Frontend demo only. No data is sent to a server. Integrate a backend endpoint or form service in `js/script.js` when ready.
- **Contact/social links:** Replace placeholder URLs/emails with official club accounts.

## Accessibility & Performance

- Semantic landmarks and labels
- Keyboard-friendly controls and visible focus states
- Respects `prefers-reduced-motion`
- No unnecessary frameworks; lightweight CSS/JS animations

## License

© 2026 Vidyut Club. All Rights Reserved. Replace placeholder details with official club information before publishing.
