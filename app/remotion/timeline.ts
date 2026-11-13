/*
 * Timing shared by the page and the Remotion compositions. Kept free of
 * Remotion imports so the page can lay out the story before the films load.
 */
export const FPS = 30;

export const STORY_DURATION = 400;
export const STORY_STEPS = [
  {
    from: 0,
    title: 'Pick one thing',
    body: 'Start focus straight from a task.',
  },
  {
    from: 80,
    title: 'Give it your focus',
    body: 'The screen fills with colour and the ring counts down.',
  },
  {
    from: 210,
    title: 'Take a real break',
    body: 'Green means rest. The Lock Screen keeps time for you.',
  },
  {
    from: 310,
    title: 'Watch it add up',
    body: 'Each session lands on today in your stats.',
  },
];

/** The story frame the poster shows: the task list, fully in. */
export const STORY_POSTER_FRAME = 32;
/** A still from the focus scene, shown instead of motion with Reduce Motion. */
export const STORY_STILL_FRAME = 130;

export const MARK_DURATION = 4 * FPS;
