import { APP_STORE_URL, RitliIcon, SiteFooter, SiteHeader } from './brand';
import { RitliExperience } from './ritli-experience';
import { RitliMark, SessionStory } from './session-story';
export default function Home() {
  return (
    <>
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
