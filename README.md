# Swish landing page

A responsive landing page for the Swish iPhone focus app. Built with React, Vinext, and CSS, using the app’s real icon and product features.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

Edit `app/page.tsx` for page content and `app/globals.css` for styling. The app is currently labeled “Coming soon to iPhone.” Replace the availability badges with the verified App Store link when it is live. The interface and chart on this page show example activity, not user data.

## Motion

GSAP and ScrollTrigger power the staged hero entrance, section reveals, growing chart bars, task-card stagger, desktop preview tilt/parallax, and reading progress line. `app/swish-motion.tsx` scopes all animations to this page and cleans up animations, triggers, and pointer listeners on unmount. OS reduced-motion changes automatically restore the static layout. Content remains visible without JavaScript; scrolling remains native.
