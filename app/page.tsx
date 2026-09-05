import { SwishMotion } from './swish-motion';
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Coffee,
  ListTodo,
  Play,
  Settings2,
  Smartphone,
  Timer,
} from 'lucide-react';

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand${footer ? ' brand-footer' : ''}`}
      href="#top"
      aria-label="Swish home"
    >
      <img src="/swish-icon.png" alt="" width="42" height="42" />
      <span>swish</span>
    </a>
  );
}

function AppPreview() {
  return (
    <figure
      className="app-preview"
      aria-label="Preview of Swish with a 25 minute focus timer and example daily progress"
    >
      <div className="app-heading">
        <strong>Swish</strong>
        <Settings2 size={19} />
      </div>
      <div className="selected-task">
        <span className="task-symbol">
          <ListTodo size={17} />
        </span>
        <div>
          <small>TIME TO WORK ON</small>
          <strong>Make something great</strong>
        </div>
        <ChevronDown size={16} />
      </div>
      <div className="timer-card">
        <div className="timer-top">
          <span>
            <i /> Focus <ChevronDown size={12} />
          </span>
          <small>25 min</small>
        </div>
        <div className="timer-ring">
          <div>
            <strong>25:00</strong>
            <span>One thing at a time</span>
          </div>
        </div>
        <div className="preview-start">
          <Play size={15} fill="currentColor" /> Start Focus
        </div>
      </div>
      <div className="today-heading">
        <strong>Today’s progress</strong>
        <span>View all</span>
      </div>
      <div className="today-stats">
        <div>
          <Clock3 />
          <strong>1h 40m</strong>
          <span>Focus time</span>
        </div>
        <div>
          <CircleCheck />
          <strong>4</strong>
          <span>Sessions</span>
        </div>
        <div>
          <ListTodo />
          <strong>2</strong>
          <span>Tasks done</span>
        </div>
      </div>
      <div className="app-tabs">
        <span className="active">
          <Timer />
          Focus
        </span>
        <span>
          <ListTodo />
          Tasks
        </span>
        <span>
          <BarChart3 />
          Stats
        </span>
      </div>
      <figcaption>APP PREVIEW · EXAMPLE ACTIVITY</figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SwishMotion>
        <header className="site-header">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#features">Why Swish</a>
            <a href="#rhythm">Find your rhythm</a>
          </nav>
          <a className="header-cta" href="#coming-soon">
            Made for iPhone <ArrowUpRight size={16} />
          </a>
        </header>
        <main id="main">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="status-dot" /> A LITTLE SPACE FOR WHAT MATTERS
              </span>
              <h1 id="hero-title">
                <span className="headline-mask">
                  <span className="headline-line">A little focus.</span>
                </span>
                <span className="headline-mask">
                  <span className="headline-line hero-accent">
                    A lot forward.
                  </span>
                </span>
              </h1>
              <p>
                Your next chapter starts with the next 25 minutes. Meet the
                focus timer that turns good intentions into a little more done.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#features">
                  Meet Swish <ArrowDown size={18} />
                </a>
                <span className="availability">
                  <Smartphone size={19} />
                  <span>
                    Coming soon
                    <br />
                    <strong>to iPhone</strong>
                  </span>
                </span>
              </div>
              <div className="hero-note">
                <span>Less switching.</span>
                <span>More doing.</span>
                <span>Room to breathe.</span>
              </div>
            </div>
            <div className="hero-product">
              <span className="product-caption">YOUR TIME, WELL SPENT.</span>
              <div className="preview-wrap">
                <AppPreview />
                <div className="break-note">
                  <span className="break-icon">
                    <Coffee size={21} />
                  </span>
                  <div>
                    <strong>And room for a break.</strong>
                    <span>Good work needs a little rest.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="principles" aria-label="Swish features">
            <span>
              <Timer /> Focus with intention
            </span>
            <span>
              <ListTodo /> Give your tasks a plan
            </span>
            <span>
              <BarChart3 /> See your progress
            </span>
          </div>
          <section
            id="features"
            className="features section"
            aria-labelledby="features-title"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">SMALL SESSIONS. REAL PROGRESS.</span>
                <h2 id="features-title">
                  Find your focus.
                  <br />
                  Keep your momentum.
                </h2>
              </div>
              <p>
                Everything you need to get into your work,
                <br className="desktop-break" /> and feel good stepping away
                from it.
              </p>
            </div>
            <div className="feature-grid">
              <article className="feature-card task-feature">
                <span className="feature-index">01 / A CLEAR NEXT STEP</span>
                <div className="task-list" aria-label="Example tasks">
                  <div>
                    <span className="task-check">
                      <Check size={13} />
                    </span>
                    <span className="completed-task">Read a chapter</span>
                    <span className="task-category green">Personal</span>
                  </div>
                  <div>
                    <span className="task-check empty" />
                    <span>Shape the big idea</span>
                    <span className="task-category">Work</span>
                  </div>
                  <div>
                    <span className="task-check empty purple-border" />
                    <span>Practice Spanish</span>
                    <span className="task-category purple">Learning</span>
                  </div>
                </div>
                <h3>A home for your to-dos.</h3>
                <p>
                  Organize tasks by category, give them a routine, and start a
                  focus session right from your list.
                </p>
              </article>
              <article className="feature-card routine-feature">
                <span className="feature-index">02 / YOUR KIND OF FLOW</span>
                <div className="routine-demo">
                  <div>
                    <Timer size={19} />
                    <strong>25</strong>
                    <span>Focus</span>
                  </div>
                  <span className="routine-divider">/</span>
                  <div>
                    <Coffee size={19} />
                    <strong>5</strong>
                    <span>Rest</span>
                  </div>
                  <span className="minutes-label">MINUTES, MADE YOURS</span>
                </div>
                <h3>A rhythm that fits you.</h3>
                <p>
                  Set your own focus and break lengths. Save routines for the
                  work that deserves a different pace.
                </p>
              </article>
              <article className="feature-card stats-feature">
                <span className="feature-index">03 / THE BIGGER PICTURE</span>
                <div
                  className="chart-demo"
                  aria-label="Illustrative focus activity across a week"
                >
                  <div className="chart-title">
                    <span>Focus this week</span>
                    <BarChart3 size={16} />
                  </div>
                  <div className="bars">
                    {[38, 61, 47, 86, 67, 100, 54].map((height, i) => (
                      <div key={i}>
                        <span
                          style={{ height: `${height}%` }}
                          className={i === 5 ? 'highlight-bar' : ''}
                        />
                        <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <h3>Watch the effort add up.</h3>
                <p>
                  Explore your focus time, session history, and category
                  breakdowns. See where your attention goes.
                </p>
              </article>
            </div>
          </section>
          <section
            id="rhythm"
            className="rhythm section"
            aria-labelledby="rhythm-title"
          >
            <div className="rhythm-intro">
              <span className="eyebrow">ONE THING AT A TIME</span>
              <h2 id="rhythm-title">
                Big plans.
                <br />
                Small beginnings.
              </h2>
              <p>
                You don’t have to do it all right now.
                <br />
                Just give the next thing your attention.
              </p>
              <span className="rhythm-signature">That’s the Swish of it.</span>
            </div>
            <ol className="steps">
              <li>
                <span className="step-number">01</span>
                <div>
                  <h3>Pick one thing.</h3>
                  <p>Choose a task, or start a session with a clean slate.</p>
                </div>
              </li>
              <li>
                <span className="step-number">02</span>
                <div>
                  <h3>Give it your focus.</h3>
                  <p>
                    Settle in. Your timer stays with you through Live
                    Activities, even on your Lock Screen.
                  </p>
                </div>
              </li>
              <li>
                <span className="step-number">03</span>
                <div>
                  <h3>Take a breath. Go again.</h3>
                  <p>
                    Make space for a short break, then come back ready for the
                    next little step.
                  </p>
                </div>
              </li>
            </ol>
          </section>
          <section
            id="coming-soon"
            className="coming-soon"
            aria-labelledby="coming-title"
          >
            <img
              src="/swish-icon.png"
              alt="Swish app icon"
              width="80"
              height="80"
            />
            <span className="eyebrow">GOOD THINGS TAKE A LITTLE FOCUS</span>
            <h2 id="coming-title">
              A little more present.
              <br />A little more possible.
            </h2>
            <p>A calmer way to get things done is on its way.</p>
            <span className="coming-badge">
              <Smartphone size={20} /> Coming soon to iPhone
            </span>
          </section>
        </main>
        <footer>
          <Brand footer />
          <span>A little focus goes a long way.</span>
          <small>© {new Date().getFullYear()} Swish</small>
        </footer>
      </SwishMotion>
    </>
  );
}
