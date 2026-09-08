# Ritli landing page

A responsive landing page for the Ritli iPhone focus app. Built with React, Vinext, and CSS, using the app’s real icon and product features.

## Local development

Use **Node.js 24 LTS**. The project declares `24.x` in `package.json` and `24` in `.nvmrc`, keeping local development and Vercel on the same supported major version while allowing security and patch updates. If you use nvm, run `nvm install` and `nvm use` in this directory first; otherwise select Node 24 with your preferred installer or version manager.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
```

Edit `app/page.tsx` for page content and `app/globals.css` for styling. The app is currently labeled “Coming soon to iPhone.” Replace the availability badges with the verified App Store link when it is live. The interface and chart on this page show example activity, not user data.

## Privacy policy

The `/privacy` route is implemented in `app/privacy/page.tsx` and linked from the homepage footer. Edit that page for the public app-policy wording and its revision date; keep developer review notes out of the public content. The page uses the existing brand styles, responsive section navigation, and the support address `kirillgl.dev@gmail.com`.

Before publishing, verify Vercel's enabled services and visitor-data handling, confirm the policy matches actual support and beta-data practices, and set the publication/effective date. After deployment, check `/privacy` on the public production URL while signed out before using it in the iOS app or App Store Connect. The local addition does not deploy the site or update those URLs automatically.

## Motion

GSAP and ScrollTrigger power the staged hero entrance, section reveals, growing chart bars, task-card stagger, desktop preview tilt/parallax, and reading progress line. `app/ritli-motion.tsx` scopes all animations to this page and cleans up animations, triggers, and pointer listeners on unmount. OS reduced-motion changes automatically restore the static layout. Content remains visible without JavaScript; scrolling remains native.

## Vercel deployment

Connect this repository with the project root set to the repository root. `vercel.json` selects the Other framework preset, runs `npm run build:vercel`, and serves `dist/client`. This build exports the page to static HTML and includes the JavaScript needed for GSAP animations.

Vercel uses the `engines.node` setting in `package.json` to select Node 24 for new builds, overriding the dashboard's Node version. Existing deployments are unchanged until redeployed. [Vercel's supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

The standard `npm run build` still produces the original Cloudflare Worker for Sites. Its client-assets folder alone is not a deployable website because it contains no `index.html`. Use the Vercel build command when deploying on Vercel.
