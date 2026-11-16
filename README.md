# Ritli landing page

A responsive landing page for the Ritli iPhone focus app. Built with React, Vinext, CSS and Remotion, using the app’s real icon and product features.

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

Edit `app/page.tsx` for page content and `app/globals.css` for styling. The header, hero, and closing calls to action all use the shared `APP_STORE_URL` in `app/brand.tsx`: [Ritli on the App Store](https://apps.apple.com/app/ritli-focus-timer/id6809929070). The link has no country code, so Apple opens each visitor's own storefront. Change the link there and every button follows; the Smart App Banner in `app/layout.tsx` uses `APP_STORE_ID` from the same file. The timer, tasks and chart on this page show example activity, not user data.

## Privacy policy

The `/privacy` route is implemented in `app/privacy/page.tsx` and linked from the homepage footer. Edit that page for the public app-policy wording and its revision date; keep developer review notes out of the public content. The page uses the existing brand styles, responsive section navigation, and the support address `kirillgl.dev@gmail.com`.

Before publishing, verify Vercel's enabled services and visitor-data handling, confirm the policy matches actual support practices, and set the publication/effective date. After deployment, check `/privacy` on the public production URL while signed out before using it in the iOS app or App Store Connect. The local addition does not deploy the site or update those URLs automatically.

## SEO

`lib/site.ts` holds the site title, description, and public origin. The origin comes from `SITE_URL` if set, otherwise from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, so canonical URLs, Open Graph tags, and the sitemap always point at the production domain. Set `SITE_URL` in Vercel if the automatically chosen domain is not the one you want indexed.

`app/layout.tsx` defines the shared metadata and social preview (`public/og-image.png`, 1200×630). Each page sets its own canonical URL, and the homepage embeds `SoftwareApplication` and `FAQPage` structured data. The FAQ section and its structured data both come from the `FAQ` list in `app/page.tsx`. `npm run build:vercel` finishes by running `scripts/write-seo-files.mjs`, which writes `robots.txt` and `sitemap.xml` into `dist/client`; add new pages to the list in that script.

## Motion

The page has three kinds of motion, all optional:

- **Live timer** (`app/ritli-experience.tsx`): a working Ritli timer in the hero. The Lock Screen card, the task list and the week chart read from the same state, so a session finished in the hero lands on a task and on today's bar. The tasks and the week are example data.
- **Remotion films** (`app/remotion/compositions.tsx`, played by `app/remotion/players.tsx`): the "How a session goes" walkthrough and the animated logo in the closing section. Remotion loads in its own chunk, once the page is idle or a film nears the screen, so the rest of the page becomes interactive without it. Until then `app/session-story.tsx` shows stills (a CSS copy of the story's opening frame and a static logo), and they stay if the chunk fails to load. Shared timing lives in `app/remotion/timeline.ts`, which has no Remotion imports. Films play while on screen and show a still frame with Reduce Motion. They use the page's CSS colour tokens, so they follow light and dark mode.
- **Scroll-driven CSS** (end of `app/globals.css`): sections rise in, coloured bands open to full width, and a reading-progress bar runs along the top. It uses `animation-timeline`, so browsers without support and visitors with Reduce Motion see the finished page.

Colours, type and the icon follow the iOS app's redesign: paper, ink, coral and terracotta, leaf green for breaks, Nunito for headings and Inter for text (loaded from Google Fonts).
