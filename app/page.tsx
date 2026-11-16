import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';
import { APP_STORE_URL, RitliIcon, SiteFooter, SiteHeader } from './brand';
import { RitliExperience } from './ritli-experience';
import { RitliMark, SessionStory } from './session-story';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Structured data describing the app to search engines.
const APP_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  alternateName: 'Ritli: Focus Timer',
  description: SITE_DESCRIPTION,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/ritli-icon.png`,
  installUrl: APP_STORE_URL,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'iOS',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Focus timer with real breaks',
    'Tasks to focus on',
    'Lock Screen timer',
    'Weekly focus stats',
  ],
}).replace(/</g, '\\u003c');

// One list feeds both the FAQ section and its structured data.
const FAQ = [
  {
    q: 'Is Ritli free?',
    a: 'Yes. Ritli is free to download on the App Store, and it has no ads.',
  },
  {
    q: 'Is Ritli a Pomodoro timer?',
    a: 'Yes. It follows the Pomodoro technique: 25 minutes of focus, a short break, and a longer break after four sessions. You can change the focus and break lengths and save them as routines.',
  },
  {
    q: 'Does the timer keep running when I lock my iPhone?',
    a: 'Yes. Ritli keeps accurate time even when the app is closed, and the countdown shows on the Lock Screen and in the Dynamic Island.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. Open the app and start. Your tasks, routines and session history stay on your iPhone and are not sent to a server.',
  },
  {
    q: 'Can I see how much I have focused?',
    a: 'Yes. Ritli shows your focus time by day, week, month and year, with a calendar of every session.',
  },
  {
    q: 'Which iPhones does Ritli work on?',
    a: 'Ritli needs iOS 17 or later.',
  },
];

const FAQ_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}).replace(/</g, '\\u003c');

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: APP_JSON_LD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="progress" aria-hidden="true" />
      <div className="wrap">
        <SiteHeader>
          <nav className="site-nav" aria-label="Sections">
            <a href="#how">How it works</a>
            <a href="#lock">Lock Screen</a>
            <a href="#week">Your week</a>
            <a href="#privacy">Privacy</a>
          </nav>
          <a className="cta small" href={APP_STORE_URL}>
            Get the app
          </a>
        </SiteHeader>
      </div>

      <main id="main">
        <RitliExperience
          story={
            <section id="how" className="band" aria-labelledby="how-title">
              <div className="wrap">
                <div className="how-head rise">
                  <h2 id="how-title" className="display">
                    How a session goes.
                  </h2>
                  <p className="lede">
                    Four steps, about half an hour, and the screen always tells
                    you which one you&apos;re in.
                  </p>
                </div>
                <SessionStory />
              </div>
            </section>
          }
        />

        <section
          id="privacy"
          className="private band"
          aria-labelledby="privacy-title"
        >
          <div className="wrap">
            <h2 id="privacy-title" className="display rise">
              Your tasks stay on your iPhone.
            </h2>
            <p className="lede rise">
              Ritli keeps your tasks, routines and session history on your
              device. It doesn&apos;t send them to a server.
            </p>
            <div className="facts">
              <div>
                <b>No account</b>
                <span>
                  Open the app and start. There is nothing to sign up for.
                </span>
              </div>
              <div>
                <b>No ads or analytics</b>
                <span>
                  No advertising, no third-party analytics, no cross-app
                  tracking.
                </span>
              </div>
              <div>
                <b>Private Lock Screen</b>
                <span>
                  Task names appear on the Lock Screen only if you choose.
                </span>
              </div>
            </div>
            <a className="private-link" href="/privacy">
              Read the privacy policy
            </a>
          </div>
        </section>

        <section id="faq" className="faq band" aria-labelledby="faq-title">
          <div className="wrap">
            <h2 id="faq-title" className="display rise">
              Common questions.
            </h2>
            <dl className="faq-list">
              {FAQ.map(({ q, a }) => (
                <div key={q}>
                  <dt>{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="band" aria-labelledby="close-title">
          <div className="wrap close">
            <RitliMark />
            <h2 id="close-title" className="display rise">
              Ritli is on the App Store.
            </h2>
            <p className="lede rise">
              Download it on your iPhone, pick one thing and start your first
              25 minutes.
            </p>
            <a className="cta" href={APP_STORE_URL}>
              <RitliIcon size={22} />
              Get Ritli on the App Store
            </a>
          </div>
        </section>
      </main>

      <div className="wrap">
        <SiteFooter current="home" />
      </div>
    </>
  );
}
