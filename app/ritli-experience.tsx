'use client';

import { useEffect, useReducer, useRef, type ReactNode } from 'react';
import { APP_STORE_URL } from './brand';

/*
 * A working Ritli timer. The hero phone, the Lock Screen band, the task list
 * and the week chart all read from (and write to) this one state, so a
 * session finished in the hero lands on a task and on today's bar.
 * The tasks and the week are example data, not anyone's own.
 */

type Mode = 'focus' | 'short' | 'long';

const LENGTH: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};
const CYCLE = 4;
const MODE_NAME: Record<Mode, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
};

interface Task {
  title: string;
  category: string;
  color: string;
  estimate: number;
  done: number;
}

interface State {
  mode: Mode;
  running: boolean;
  paused: boolean;
  remaining: number;
  completed: number;
  speed: 1 | 60;
  todaySessions: number;
  todayMinutes: number;
  taskIndex: number;
  tasks: Task[];
  pressedDay: number;
  /** Wall-clock time of the last tick, for the Lock Screen's "ends at". */
  now: number;
  announcement: string;
}

type Action =
  | { type: 'setMode'; mode: Mode }
  | { type: 'start'; now: number }
  | { type: 'pause' }
  | { type: 'cancel' }
  | { type: 'skip' }
  | { type: 'tick'; seconds: number; now: number }
  | { type: 'setSpeed'; speed: 1 | 60 }
  | { type: 'focusOn'; index: number; now: number }
  | { type: 'toggleTask'; index: number }
  | { type: 'pressDay'; index: number };

const initialState: State = {
  mode: 'focus',
  running: false,
  paused: false,
  remaining: LENGTH.focus,
  completed: 0,
  speed: 60,
  todaySessions: 2,
  todayMinutes: 50,
  taskIndex: 0,
  tasks: [
    {
      title: 'Write project brief',
      category: 'Work',
      color: 'var(--coral)',
      estimate: 4,
      done: 1,
    },
    {
      title: 'Read chapter 5',
      category: 'Study',
      color: 'var(--study)',
      estimate: 3,
      done: 2,
    },
    {
      title: 'Plan the weekend trip',
      category: 'Personal',
      color: 'var(--personal)',
      estimate: 1,
      done: 0,
    },
    {
      title: 'Review pull requests',
      category: 'Work',
      color: 'var(--coral)',
      estimate: 2,
      done: 2,
    },
  ],
  pressedDay: -1,
  now: 0,
  announcement: '',
};

const WEEK = [
  { day: 'Mon', minutes: 75 },
  { day: 'Tue', minutes: 100 },
  { day: 'Wed', minutes: 125 },
  { day: 'Thu', minutes: 50 },
  { day: 'Fri', minutes: 0, today: true },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 0 },
];

const isBreak = (mode: Mode) => mode !== 'focus';

function finish(state: State): State {
  if (state.mode === 'focus') {
    const completed = state.completed + 1;
    const mode: Mode = completed >= CYCLE ? 'long' : 'short';
    const tasks = state.tasks.map((task, i) =>
      i === state.taskIndex && task.done < task.estimate
        ? { ...task, done: task.done + 1 }
        : task,
    );
    return {
      ...state,
      running: false,
      paused: false,
      completed,
      mode,
      remaining: LENGTH[mode],
      todaySessions: state.todaySessions + 1,
      todayMinutes: state.todayMinutes + LENGTH.focus / 60,
      tasks,
      announcement: `Focus done. Time for a ${MODE_NAME[mode].toLowerCase()}.`,
    };
  }
  return {
    ...state,
    running: false,
    paused: false,
    completed: state.mode === 'long' ? 0 : state.completed,
    mode: 'focus',
    remaining: LENGTH.focus,
    announcement: 'Break over. Ready to focus.',
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setMode':
      if (state.running || state.paused) return state;
      return { ...state, mode: action.mode, remaining: LENGTH[action.mode] };
    case 'start':
      return {
        ...state,
        running: true,
        paused: false,
        now: action.now,
        announcement: `${MODE_NAME[state.mode]} started`,
      };
    case 'pause':
      return { ...state, running: false, paused: true, announcement: 'Paused' };
    case 'cancel':
      return {
        ...state,
        running: false,
        paused: false,
        remaining: LENGTH[state.mode],
        announcement: 'Session cancelled',
      };
    case 'skip':
      return isBreak(state.mode) ? finish(state) : state;
    case 'tick': {
      if (!state.running) return state;
      const remaining = state.remaining - action.seconds * state.speed;
      if (remaining <= 0) return finish(state);
      return { ...state, remaining, now: action.now };
    }
    case 'setSpeed':
      return { ...state, speed: action.speed };
    case 'focusOn':
      return {
        ...state,
        taskIndex: action.index,
        mode: 'focus',
        remaining: LENGTH.focus,
        running: true,
        paused: false,
        now: action.now,
        announcement: `Focus started on ${state.tasks[action.index]?.title ?? 'a task'}`,
      };
    case 'toggleTask':
      return {
        ...state,
        tasks: state.tasks.map((task, i) => {
          if (i !== action.index) return task;
          const finished = task.done >= task.estimate;
          return {
            ...task,
            done: finished ? Math.max(0, task.estimate - 1) : task.estimate,
          };
        }),
      };
    case 'pressDay':
      return {
        ...state,
        pressedDay: state.pressedDay === action.index ? -1 : action.index,
      };
  }
}

function fmt(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function fmtMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function clock(ms: number) {
  const date = new Date(ms);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const PLAY = (
  <path d="M4 2.5v11a.8.8 0 0 0 1.2.7l8.6-5.5a.8.8 0 0 0 0-1.4L5.2 1.8A.8.8 0 0 0 4 2.5z" />
);
const PAUSE = (
  <>
    <rect x="3" y="2" width="3.6" height="12" rx="1.2" />
    <rect x="9.4" y="2" width="3.6" height="12" rx="1.2" />
  </>
);

/** The inner ring: one arc per focus session in the cycle, as in the app. */
function CycleRing({ completed }: { completed: number }) {
  const r = 91;
  const c = 2 * Math.PI * r;
  const seg = c / CYCLE;
  const gap = 0.06 * c;
  return (
    <g transform="rotate(-79.2 132 132)" strokeWidth="8" strokeLinecap="round">
      {Array.from({ length: CYCLE }, (_, i) => (
        <circle
          key={i}
          cx="132"
          cy="132"
          r={r}
          stroke={i < completed ? 'var(--scr-ring)' : 'var(--scr-track)'}
          strokeDasharray={`${seg - gap} ${c - seg + gap}`}
          strokeDashoffset={-seg * i}
        />
      ))}
    </g>
  );
}

export function RitliExperience({ story }: { story: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: 'tick', seconds: (now - last) / 1000, now: Date.now() });
      last = now;
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  const active = state.running || state.paused;
  const kind = isBreak(state.mode) ? 'break' : 'focus';
  const fraction = state.remaining / LENGTH[state.mode];
  const ringOffset = Math.round((1 - fraction) * 1000);
  const task = state.tasks[state.taskIndex];
  const sessionNo = Math.min(state.completed + 1, CYCLE);

  const status = state.running
    ? 'Remaining'
    : state.paused
      ? 'Paused'
      : isBreak(state.mode)
        ? 'Ready to rest'
        : 'Ready to focus';
  const primaryLabel = state.running
    ? 'Pause'
    : state.paused
      ? 'Resume'
      : isBreak(state.mode)
        ? 'Start break'
        : 'Start focus';
  const caption = isBreak(state.mode)
    ? `Then ${LENGTH.focus / 60} min of focus`
    : `Session ${sessionNo} of ${CYCLE} · then a ${sessionNo === CYCLE ? '15 min long' : '5 min'} break`;

  const endsAt = state.now + (state.remaining / state.speed) * 1000;
  const lockSub = state.running
    ? `${isBreak(state.mode) ? 'Back at' : 'Focus · ends at'} ${clock(endsAt)}`
    : state.paused
      ? 'Paused'
      : `${MODE_NAME[state.mode]} · ${LENGTH[state.mode] / 60} min`;
  const lockNote = state.running
    ? 'Live from the timer above.'
    : state.paused
      ? 'Paused in the timer above.'
      : 'This follows the timer above. Start it and watch.';
  const islandTint = isBreak(state.mode) ? '#6CC790' : '#E8846B';

  const weekTotal = WEEK.reduce(
    (sum, d) => sum + (d.today ? state.todayMinutes : d.minutes),
    0,
  );

  const focusOn = (index: number, now: number) => {
    dispatch({ type: 'focusOn', index, now });
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    heroRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <section
        ref={heroRef}
        id="top"
        className="hero wrap"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <h1 id="hero-title" className="display">
            Pick one thing.
            <br />
            Give it 25 minutes.
          </h1>
          <p className="lede">
            Ritli is a calm focus timer for iPhone. Choose a task, start the
            timer, and take a real break when it rings. It keeps accurate time
            even when the app is closed.
          </p>
          <div className="hero-actions">
            <a className="cta" href={APP_STORE_URL}>
              Get Ritli on the App Store
            </a>
            <span className="note">iPhone · No account · No ads</span>
          </div>
        </div>

        <div className="demo">
          <section className="phone" aria-label="Interactive Ritli timer">
            <div
              className="screen"
              data-kind={kind}
              data-active={String(active)}
            >
              <div className="scr-top">
                <small>
                  {isBreak(state.mode) ? MODE_NAME[state.mode] : 'Working on'}
                </small>
                <strong>
                  {isBreak(state.mode)
                    ? state.mode === 'long'
                      ? 'Step away for a while'
                      : 'Stretch, sip, look far away'
                    : (task?.title ?? 'No task')}
                </strong>
              </div>

              <fieldset className="modes" hidden={active}>
                <legend className="sr-only">Timer mode</legend>
                {(['focus', 'short', 'long'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={state.mode === mode}
                    onClick={() => dispatch({ type: 'setMode', mode })}
                  >
                    {MODE_NAME[mode]}
                  </button>
                ))}
              </fieldset>

              <div className="dial">
                <svg viewBox="0 0 264 264" fill="none" aria-hidden="true">
                  <circle
                    cx="132"
                    cy="132"
                    r="118"
                    stroke="var(--scr-track)"
                    strokeWidth="18"
                  />
                  <circle
                    className="ring"
                    cx="132"
                    cy="132"
                    r="118"
                    stroke="var(--scr-ring)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    pathLength="1000"
                    strokeDasharray="1000"
                    strokeDashoffset={ringOffset}
                    transform="rotate(-90 132 132)"
                  />
                  <CycleRing completed={state.completed} />
                </svg>
                <div className="dial-center">
                  <span className="time">{fmt(state.remaining)}</span>
                  <small>{status}</small>
                </div>
              </div>

              <div className="scr-caption">{caption}</div>

              <div className="controls">
                {active && (
                  <button
                    type="button"
                    className="round"
                    aria-label="Cancel session"
                    onClick={() => dispatch({ type: 'cancel' })}
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className="primary"
                  onClick={() =>
                    state.running
                      ? dispatch({ type: 'pause' })
                      : dispatch({ type: 'start', now: Date.now() })
                  }
                >
                  <svg
                    aria-hidden="true"
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    {state.running ? PAUSE : PLAY}
                  </svg>
                  <span>{primaryLabel}</span>
                </button>
                {active && isBreak(state.mode) && (
                  <button
                    type="button"
                    className="round"
                    aria-label="Skip break"
                    onClick={() => dispatch({ type: 'skip' })}
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 6l8 6-8 6zM18 6v12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="today">
                <b>Today</b>
                <span>
                  <b className="num">{state.todaySessions}</b> sessions ·{' '}
                  <b className="num">{state.todayMinutes}</b> min focused
                </span>
              </div>
            </div>
          </section>
          <div className="demo-bar">
            <span>Try it. Timer speed:</span>
            <fieldset className="segmented">
              <legend className="sr-only">Timer speed</legend>
              <button
                type="button"
                aria-pressed={state.speed === 1}
                onClick={() => dispatch({ type: 'setSpeed', speed: 1 })}
              >
                Real time
              </button>
              <button
                type="button"
                aria-pressed={state.speed === 60}
                onClick={() => dispatch({ type: 'setSpeed', speed: 60 })}
              >
                60× demo
              </button>
            </fieldset>
          </div>
          <p className="sr-only" aria-live="polite">
            {state.announcement}
          </p>
        </div>
      </section>

      {story}

      <section id="lock" className="lock band" aria-labelledby="lock-title">
        <div className="wrap lock-grid">
          <div className="lock-copy rise">
            <h2 id="lock-title" className="display">
              Your timer, on the Lock Screen.
            </h2>
            <p className="lede">
              Glance at the Lock Screen or the Dynamic Island to see what is
              left, without opening the app. Task names stay hidden there unless
              you turn them on.
            </p>
          </div>
          <div className="lock-stack">
            <div className="lock-card" data-kind={kind}>
              <svg
                aria-hidden="true"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#FFF6EC"
                  strokeOpacity=".25"
                  strokeWidth="7"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#FFF6EC"
                  strokeWidth="7"
                  strokeLinecap="round"
                  pathLength="1000"
                  strokeDasharray="1000"
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <span className="t">
                <b>
                  {isBreak(state.mode)
                    ? MODE_NAME[state.mode]
                    : (task?.title ?? 'Focus')}
                </b>
                <span>{lockSub}</span>
              </span>
              <span className="big">{fmt(state.remaining)}</span>
            </div>
            <div className="island" aria-hidden="true">
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke={islandTint}
                  strokeOpacity=".3"
                  strokeWidth="5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke={islandTint}
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength="1000"
                  strokeDasharray="1000"
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 12 12)"
                />
              </svg>
              <b>{fmt(state.remaining)}</b>
            </div>
            <p className="lock-note">{lockNote}</p>
          </div>
        </div>
      </section>

      <section id="tasks" className="band" aria-labelledby="tasks-title">
        <div className="wrap split">
          <div className="rise">
            <h2 id="tasks-title" className="display">
              Plans become sessions.
            </h2>
            <p className="lede">
              Give each task an estimate in focus sessions. Start one straight
              from the list, and Ritli checks it off when its sessions are done.
            </p>
            <p className="note">
              Tap the play button on a task to load it into the timer above.
            </p>
          </div>
          <div>
            <div className="tasks">
              {state.tasks.map((item, i) => {
                const finished = item.done >= item.estimate;
                const current = i === state.taskIndex && !finished;
                return (
                  <div
                    key={item.title}
                    className="task"
                    data-done={String(finished)}
                  >
                    <button
                      type="button"
                      className="check"
                      aria-label={`${finished ? 'Reopen' : 'Mark done:'} ${item.title}`}
                      onClick={() => dispatch({ type: 'toggleTask', index: i })}
                    >
                      <i>
                        <svg
                          aria-hidden="true"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="3.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </i>
                    </button>
                    <div className="task-text">
                      <b>{item.title}</b>
                      <span>
                        {item.category} · {item.done} of {item.estimate}{' '}
                        {item.estimate === 1 ? 'session' : 'sessions'}
                        {current && (
                          <span className="current"> · in the timer</span>
                        )}
                      </span>
                    </div>
                    <div className="pips" aria-hidden="true">
                      {Array.from({ length: item.estimate }, (_, p) => (
                        <span
                          key={p}
                          className={p < item.done ? 'pip on' : 'pip'}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="play"
                      disabled={finished}
                      aria-label={`Focus on ${item.title} in the timer above`}
                      onClick={() => focusOn(i, Date.now())}
                    >
                      <svg
                        aria-hidden="true"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        {PLAY}
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="week" className="week band" aria-labelledby="week-title">
        <div className="wrap split">
          <div className="rise">
            <h2 id="week-title" className="display">
              See where the time went.
            </h2>
            <p className="lede">
              Focus time by day, week, month and year, with a calendar of every
              session. Sessions you finish in the timer above land on
              today&apos;s bar.
            </p>
          </div>
          <div>
            <div className="chart-card">
              <div className="chart-head">
                <div>
                  <small>Focused this week (example)</small>
                  <div className="total">{fmtMinutes(weekTotal)}</div>
                </div>
                <small>{Math.round(weekTotal / 25)} sessions</small>
              </div>
              <fieldset className="bars">
                <legend className="sr-only">
                  Focus minutes per day. Tap a day to see its total.
                </legend>
                {WEEK.map((d, i) => {
                  const minutes = d.today ? state.todayMinutes : d.minutes;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      className={d.today ? 'bar today' : 'bar'}
                      aria-pressed={state.pressedDay === i}
                      aria-label={`${d.day}: ${fmtMinutes(minutes)} focused${d.today ? ', today' : ''}`}
                      onClick={() => dispatch({ type: 'pressDay', index: i })}
                    >
                      <span className="value">
                        {minutes ? fmtMinutes(minutes) : ''}
                      </span>
                      <span
                        className="fill"
                        style={{
                          height: `${Math.max(3, Math.min(150, (minutes / 180) * 150))}px`,
                        }}
                      />
                      <span className="day">{d.today ? 'Today' : d.day}</span>
                    </button>
                  );
                })}
              </fieldset>
              <div className="cats" aria-hidden="true">
                <span style={{ flex: 52, background: 'var(--coral)' }} />
                <span style={{ flex: 31, background: 'var(--study)' }} />
                <span style={{ flex: 17, background: 'var(--personal)' }} />
              </div>
              <div className="legend">
                <span>
                  <i style={{ background: 'var(--coral)' }} />
                  Work 52%
                </span>
                <span>
                  <i style={{ background: 'var(--study)' }} />
                  Study 31%
                </span>
                <span>
                  <i style={{ background: 'var(--personal)' }} />
                  Personal 17%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
