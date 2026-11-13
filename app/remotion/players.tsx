/*
 * The Remotion players. Loaded on demand by `session-story.tsx`, so Remotion
 * stays out of the bundle the rest of the page needs to become interactive.
 */
import { Player, type PlayerRef } from '@remotion/player';
import { useEffect } from 'react';
import { Mark, Story } from './compositions';
import { FPS, MARK_DURATION, STORY_DURATION } from './timeline';

interface FilmProps {
  playerRef: React.RefObject<PlayerRef | null>;
  initialFrame: number;
  /** Called once the player exists, so the caller can start or sync it. */
  onReady: () => void;
}

export function StoryPlayer({
  playerRef,
  initialFrame,
  onReady,
  onFrame,
}: FilmProps & { onFrame: (frame: number) => void }) {
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return undefined;
    const listener = (event: { detail: { frame: number } }) =>
      onFrame(event.detail.frame);
    player.addEventListener('frameupdate', listener);
    // Paused players emit no frame updates, so report where this one starts.
    onFrame(player.getCurrentFrame());
    onReady();
    return () => player.removeEventListener('frameupdate', listener);
  }, [playerRef, onFrame, onReady]);

  return (
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
      initialFrame={initialFrame}
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export function MarkPlayer({ playerRef, initialFrame, onReady }: FilmProps) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
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
      initialFrame={initialFrame}
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%' }}
    />
  );
}
