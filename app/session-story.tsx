'use client';

import type { PlayerRef } from '@remotion/player';
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  STORY_DURATION,
  STORY_POSTER_FRAME,
  STORY_STEPS,
  STORY_STILL_FRAME,
} from './remotion/timeline';

/*
 * Remotion is the largest thing on the page, so it loads in its own chunk:
 * once the browser is idle after load, or as soon as a film nears the screen.
 * Until then each film shows a still that matches its first played frame.
 */
let playersModule: Promise<typeof import('./remotion/players')> | undefined;
const loadPlayers = () =>
  (playersModule ??= import('./remotion/players').catch((error: unknown) => {
    playersModule = undefined;
    throw error;
  }));
const StoryPlayer = lazy(() =>
  loadPlayers().then((m) => ({ default: m.StoryPlayer })),
);
const MarkPlayer = lazy(() =>
  loadPlayers().then((m) => ({ default: m.MarkPlayer })),
);

/** If the players can't load, the stills stay; the rest of the page carries on. */
class KeepStill extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function prefetchPlayersWhenIdle() {
  const start = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => void loadPlayers().catch(() => {}), {
        timeout: 2500,
      });
    } else {
      setTimeout(() => void loadPlayers().catch(() => {}), 1200);
    }
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCE_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** False on the server; on the client, whether the viewer asked for less motion. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(REDUCE_MOTION).matches,
    () => false,
  );
}

/**
 * Whether the element is near the screen (`near`, sticky: once true it stays
 * true, which is when its player loads) and whether enough of it is on screen
 * to play (`visible`).
 */
function useViewport(node: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = node.current;
    if (!element) return undefined;
    const nearObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    const visibleObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
    nearObserver.observe(element);
    visibleObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [node]);
  return { near, visible };
}

/** Plays while the player exists, is on screen and is wanted; pauses otherwise. */
function usePlayback(
  player: React.RefObject<PlayerRef | null>,
  shouldPlay: boolean,
) {
  useEffect(() => {
    if (shouldPlay) player.current?.play();
    else player.current?.pause();
  }, [player, shouldPlay]);
}

/** The opening of the story, drawn without Remotion. Matches STORY_POSTER_FRAME. */
const STORY_POSTER = (
  <div className="story-poster" aria-hidden="true">
    <div className="poster-card">
      {[
        { title: 'Write project brief', meta: 'Work', dots: [1, 0, 0, 0] },
        { title: 'Read chapter 5', meta: 'Study', dots: [1, 1, 0] },
        { title: 'Plan the weekend trip', meta: 'Personal', dots: [0] },
      ].map((task) => (
        <div className="poster-row" key={task.title}>
          <span className="poster-check" />
          <span className="poster-text">
            <b>{task.title}</b>
            <span>{task.meta}</span>
          </span>
          <span className="poster-dots">
            {task.dots.map((on, i) => (
              <span key={i} data-on={on ? 'true' : 'false'} />
            ))}
          </span>
          <span className="poster-play">
            <svg viewBox="0 0 16 16">
              <path d="M4 2.5v11a.8.8 0 0 0 1.2.7l8.6-5.5a.8.8 0 0 0 0-1.4L5.2 1.8A.8.8 0 0 0 4 2.5z" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  </div>
);

export function SessionStory() {
  const reduceMotion = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const { near, visible } = useViewport(filmRef);
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState(STORY_POSTER_FRAME);
  const [paused, setPaused] = useState(false);
  const playing = !reduceMotion && !paused;
  usePlayback(playerRef, ready && visible && playing);

  useEffect(prefetchPlayersWhenIdle, []);
  const onReady = useCallback(() => setReady(true), []);

  const step = STORY_STEPS.reduce(
    (current, s, i) => (frame >= s.from ? i : current),
    0,
  );

  const progress = (i: number) => {
    if (i < step) return 100;
    if (i > step) return 0;
    const end = STORY_STEPS[i + 1]?.from ?? STORY_DURATION;
    const start = STORY_STEPS[i].from;
    return Math.min(100, ((frame - start) / (end - start)) * 100);
  };

  const jumpTo = (i: number) => {
    playerRef.current?.seekTo(STORY_STEPS[i].from + (i === 0 ? 0 : 12));
  };

  const togglePlayback = () => setPaused(playing);

  return (
    <div className="story">
      <div className="story-film" ref={filmRef}>
        {STORY_POSTER}
        {near && (
          <KeepStill>
            <Suspense fallback={null}>
              <div className="story-player">
                <StoryPlayer
                  playerRef={playerRef}
                  initialFrame={
                    reduceMotion ? STORY_STILL_FRAME : STORY_POSTER_FRAME
                  }
                  onReady={onReady}
                  onFrame={setFrame}
                />
              </div>
            </Suspense>
          </KeepStill>
        )}
      </div>
      <div className="story-steps">
        <ol>
          {STORY_STEPS.map((s, i) => (
            <li key={s.title} data-active={i === step ? 'true' : 'false'}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={i === step ? 'step' : undefined}
              >
                <span className="step-bar" aria-hidden="true">
                  <span style={{ width: `${progress(i)}%` }} />
                </span>
                <b>{s.title}</b>
                <span className="step-body">{s.body}</span>
              </button>
            </li>
          ))}
        </ol>
        {!reduceMotion && (
          <button
            type="button"
            className="story-toggle"
            onClick={togglePlayback}
          >
            {playing ? 'Pause animation' : 'Play animation'}
          </button>
        )}
      </div>
    </div>
  );
}

/** The app icon's mark, animated like the iOS splash screen. */
export function RitliMark() {
  const reduceMotion = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { near, visible } = useViewport(boxRef);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  usePlayback(playerRef, ready && visible && !reduceMotion);

  return (
    <div className="mark" ref={boxRef} aria-hidden="true">
      {!ready && (
        <svg width="120" height="120" viewBox="0 0 192 192" fill="none">
          <path
            d="M72 66v62M72 104c0-22 12-36 32-36"
            stroke="var(--ink)"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <circle cx="130" cy="124" r="15" fill="var(--coral)" />
          <path
            d="M130 110.6c-2.1-4.3-5.9-4.8-8.6-3.2M130 110.6c2.1-4.3 5.9-4.8 8.6-3.2"
            stroke="var(--leaf-text)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </svg>
      )}
      {near && (
        <KeepStill>
          <Suspense fallback={null}>
            <MarkPlayer
              playerRef={playerRef}
              initialFrame={reduceMotion ? 60 : 0}
              onReady={onReady}
            />
          </Suspense>
        </KeepStill>
      )}
    </div>
  );
}
