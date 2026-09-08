import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Ritli',
  description:
    'How Ritli handles local task and timer data, notifications, support messages, and TestFlight feedback. Learn about your privacy choices and deleting data.',
};

const sections = [
  ['local-data', 'Information stored by the app'],
  ['notifications', 'Notifications & Lock Screen'],
  ['support', 'Support messages'],
  ['testflight', 'TestFlight beta testing'],
  ['deletion', 'Retention, deletion & backups'],
  ['choices', 'Your privacy choices'],
  ['changes', 'Policy changes'],
  ['contact', 'Contact'],
] as const;

export default function PrivacyPolicy() {
  return (
    <div className="page-shell privacy-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header privacy-header">
        <a className="brand" href="/" aria-label="Ritli home">
          <img src="/ritli-icon.png" alt="" width="42" height="42" />
          <span>ritli</span>
        </a>
        <a className="privacy-back" href="/">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Ritli
        </a>
      </header>

      <main id="main">
        <header className="privacy-intro">
          <p className="privacy-meta">
            Ritli: Focus Timer · Last updated{' '}
            <time dateTime="2026-09-08">September 8, 2026</time>
          </p>
          <h1>Privacy Policy</h1>
          <p>
            Ritli: Focus Timer is provided by Kirill Gladkov (“we,” “us”). This
            policy explains how we handle information when you use the Ritli iOS
            app, test its beta versions, or contact us for support.
          </p>
          <p>
            For privacy questions or requests, contact{' '}
            <a href="mailto:kirillgl.dev@gmail.com">kirillgl.dev@gmail.com</a>.
          </p>
        </header>

        <div className="privacy-layout">
          <nav
            className="privacy-contents"
            aria-label="Privacy policy sections"
          >
            <p>On this page</p>
            <ol>
              {sections.map(([id, title]) => (
                <li key={id}>
                  <a href={`#${id}`}>{title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="privacy-body" aria-label="Ritli privacy policy">
            <section id="local-data" aria-labelledby="local-data-title">
              <h2 id="local-data-title">Information stored by the app</h2>
              <p>
                Ritli stores information on your device to provide its
                task-management, timer, and progress features. This includes:
              </p>
              <ul>
                <li>
                  Tasks and any notes, categories, priorities, due dates, and
                  estimates you enter.
                </li>
                <li>
                  Custom timer routines, focus and break durations, and app
                  preferences.
                </li>
                <li>
                  Focus and break session records, including timing, completion
                  status, associated tasks or categories, and time-zone
                  information.
                </li>
                <li>
                  The state needed to restore an active or paused timer and
                  remember onboarding preferences.
                </li>
              </ul>
              <p>
                The current app does not require a Ritli account or send this
                task and timer database to a server operated by us. It has no
                advertising, third-party analytics SDKs, or cross-app
                advertising tracking. It does not implement its own cloud-sync
                service. Device backups are separate from app-operated syncing,
                as explained below.
              </p>
            </section>

            <section id="notifications" aria-labelledby="notifications-title">
              <h2 id="notifications-title">
                Notifications and Lock Screen visibility
              </h2>
              <p>
                With your permission, Ritli schedules local notifications on
                your device when a focus or break period ends. You can turn
                notifications off in Ritli or in iOS Settings.
              </p>
              <p>
                Live Activities can display your timer on the Lock Screen and
                Dynamic Island. If you enable{' '}
                <strong>Show task names on Lock Screen</strong>, the associated
                task name can also appear there and may be visible to someone
                looking at your screen. Turn that setting off to hide task names
                from Ritli’s Live Activities. iOS also provides controls for
                Live Activities and notification visibility.
              </p>
            </section>

            <section id="support" aria-labelledby="support-title">
              <h2 id="support-title">Support messages</h2>
              <p>
                If you email us, we receive your email address, the content of
                your message, and any attachments or other information you
                choose to send. We use that information to answer your request
                and investigate or fix problems. Please avoid sending sensitive
                task details unless they are necessary to explain the issue.
              </p>
              <p>
                The app also links to GitHub Issues for support. Information you
                post in a public issue can be read by other people; use email
                for private requests. Email and GitHub services process
                communications under their own terms and privacy policies. We do
                not automatically attach your local task database to support
                requests.
              </p>
            </section>

            <section id="testflight" aria-labelledby="testflight-title">
              <h2 id="testflight-title">TestFlight beta testing</h2>
              <p>
                When you test Ritli through TestFlight, Apple automatically
                collects and shares beta crash logs and usage information with
                us. Depending on how you join testing and submit feedback, we
                may also receive your name, email address, device and
                app-version information, comments, and screenshots. Personal
                details entered in a screenshot may be visible to us.
              </p>
              <p>
                We use beta information to investigate issues and improve Ritli,
                not for advertising. We do not share TestFlight beta information
                with third parties. Apple’s processing is described in{' '}
                <a href="https://www.apple.com/legal/privacy/data/en/test-flight/">
                  TestFlight &amp; Privacy
                </a>
                .
              </p>
              <p>
                You can leave the beta through <strong>Stop Testing</strong> in
                TestFlight. This stops your participation but does not
                automatically delete information already shared. Contact us
                about information we hold, and use{' '}
                <a href="https://privacy.apple.com/">
                  Apple’s Data and Privacy page
                </a>{' '}
                for information Apple controls.
              </p>
            </section>

            <section id="deletion" aria-labelledby="deletion-title">
              <h2 id="deletion-title">Retention, deletion, and backups</h2>
              <p>
                <strong>Data on your device:</strong> Ritli retains its local
                records until you remove them or remove the app’s local data.
              </p>
              <ul>
                <li>
                  <strong>Tasks:</strong> Archive a task and then delete it from{' '}
                  <strong>Archived Tasks</strong>. Archiving alone does not
                  delete a task. Deleting a task does not delete its recorded
                  focus sessions.
                </li>
                <li>
                  <strong>Session history:</strong> In{' '}
                  <strong>Settings → Data → Clear focus history</strong>, you
                  can remove recorded completed, cancelled, or skipped sessions.
                  Tasks, preferences, and any running or paused timer are kept.
                </li>
                <li>
                  <strong>All local app data:</strong> Use iOS’s{' '}
                  <strong>Delete App</strong> option to remove Ritli and its
                  local app data. <strong>Offload App</strong> keeps documents
                  and data and is not equivalent to deletion.
                </li>
              </ul>
              <p>
                Your app data may be included in iCloud or computer backups
                depending on your device settings. Deleting information from
                Ritli does not necessarily remove earlier backup copies, and
                restoring a backup may restore that information. Manage backups
                separately through Apple’s device and backup controls. We cannot
                access or erase your device or backup copies remotely.
              </p>
              <p>
                <strong>Information sent to us:</strong> We retain support
                correspondence only for as long as needed to handle the request,
                resolve related problems, and keep records that are necessary
                for security or legal obligations. Beta information we
                separately retain is kept only while needed to investigate
                issues and improve the tested functionality. You may request
                deletion using the contact email above; we will explain any
                information we must retain and why. Apple’s retention of
                information in TestFlight is governed separately by its policy.
              </p>
            </section>

            <section id="choices" aria-labelledby="choices-title">
              <h2 id="choices-title">Your privacy choices</h2>
              <p>
                You can use the local timer and task features without creating
                an account, sending support messages, or joining TestFlight. You
                can change notification and Lock Screen preferences and remove
                local information using the controls above.
              </p>
              <p>
                Depending on the laws that apply to you, you may have rights to
                access, correct, delete, or restrict the use of personal
                information we hold, object to certain processing, or request a
                portable copy. Contact us to make a request. We may need
                proportionate information to verify that the request concerns
                your data. You may also have a right to contact your local
                data-protection authority.
              </p>
            </section>

            <section id="changes" aria-labelledby="changes-title">
              <h2 id="changes-title">Changes to this policy</h2>
              <p>
                We will update this policy when Ritli’s data practices change
                and show the new effective date. If a change requires notice or
                consent under applicable law, we will provide it before applying
                that change.
              </p>
            </section>

            <section id="contact" aria-labelledby="contact-title">
              <h2 id="contact-title">Contact</h2>
              <address>
                Kirill Gladkov
                <br />
                Ritli: Focus Timer
                <br />
                <a href="mailto:kirillgl.dev@gmail.com">
                  kirillgl.dev@gmail.com
                </a>
              </address>
            </section>
          </article>
        </div>
      </main>

      <footer className="privacy-footer">
        <a className="brand brand-footer" href="/" aria-label="Ritli home">
          <img src="/ritli-icon.png" alt="" width="31" height="31" />
          <span>ritli</span>
        </a>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/privacy" aria-current="page">
            Privacy Policy
          </a>
        </nav>
        <small>© {new Date().getFullYear()} Ritli</small>
      </footer>
    </div>
  );
}
