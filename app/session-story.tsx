'use client';

import { Player, type PlayerRef } from '@remotion/player';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  FPS,
  Mark,
  MARK_DURATION,
  STORY_DURATION,
  STORY_STEPS,
  Story,
} from './remotion/compositions';

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

/** True only after hydration, so the Player never renders on the server. */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Plays while at least a third of the film is on screen, pauses otherwise. */
function usePlayWhenVisible(
  player: React.RefObject<PlayerRef | null>,
  container: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const node = container.current;
    if (!node || !enabled) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) player.current?.play();
          else player.current?.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [player, container, enabled]);
}

const FALLBACK = (
  <ol className="story-fallback">
    {STORY_STEPS.map((step) => (
      <li key={step.title}>
        <b>{step.title}.</b> {step.body}
      </li>
    ))}
  </ol>
);

export function SessionStory() {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduceMotion && !paused;
  usePlayWhenVisible(playerRef, filmRef, isClient && playing);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return undefined;
    const onFrame = (event: { detail: { frame: number } }) =>
      setFrame(event.detail.frame);
    player.addEventListener('frameupdate', onFrame);
    return () => player.removeEventListener('frameupdate', onFrame);
  }, [isClient]);

  if (!isClient) return FALLBACK;

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

  const togglePlayback = () => {
    if (playing) {
      playerRef.current?.pause();
      setPaused(true);
    } else {
      playerRef.current?.play();
      setPaused(false);
    }
  };

  return (
    <div className="story">
      <div className="story-film" ref={filmRef}>
        <Player
          ref={playerRef}
          component={Story}
          durationInFrames={STORY_DURATION}
          compositionWidth={720}
          compositionHeight={720}
          fps={FPS}
          loop
          controls={false}
          clickToPlay={false}
          initialFrame={reduceMotion ? 150 : 0}
          acknowledgeRemotionLicense
          style={{ width: '100%', height: '100%' }}
        />
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
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  usePlayWhenVisible(playerRef, boxRef, isClient && !reduceMotion);

  return (
    <div className="mark" ref={boxRef} aria-hidden="true">
      {isClient ? (
        <Player
          ref={playerRef}
          component={Mark}
          durationInFrames={MARK_DURATION}
          compositionWidth={200}
          compositionHeight={200}
          fps={FPS}
          loop
          controls={false}
          clickToPlay={false}
          initialFrame={reduceMotion ? 60 : 0}
          acknowledgeRemotionLicense
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
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
    </div>
  );
}
