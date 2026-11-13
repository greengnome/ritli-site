/*
 * Remotion compositions for the landing page, played with @remotion/player.
 * Colours come from the page's CSS tokens, so both films follow the viewer's
 * light or dark theme. Import only from client components.
 */
import {
  AbsoluteFill,
  Easing,
  Interactive,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';

// Colours come from the page's CSS tokens, so both films follow the
// viewer's light or dark theme without re-rendering.
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const fmt = (seconds: number) => {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
};
const fmtMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

// ---------------------------------------------------------------------------
// The story: pick a task, focus, take a break, watch it add up.
// ---------------------------------------------------------------------------

const TASKS = [
  {
    title: 'Write project brief',
    meta: 'Work',
    dots: [1, 0, 0, 0],
    color: 'var(--coral)',
  },
  { title: 'Read chapter 5', meta: 'Study', dots: [1, 1, 0], color: '#5B8EC9' },
  {
    title: 'Plan the weekend trip',
    meta: 'Personal',
    dots: [0],
    color: '#9A7BC8',
  },
];

const TaskScene = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      name="Tasks"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: interpolate(frame, [72, 88], [1, 0], clamp),
      }}
    >
      <Interactive.Div
        name="Task card"
        style={{
          width: 560,
          background: 'var(--surface)',
          borderRadius: 32,
          padding: '10px 28px',
          display: 'flex',
          flexDirection: 'column',
          translate: interpolate(frame, [0, 18], ['0px 30px', '0px 0px'], {
            ...clamp,
            easing: easeOut,
          }),
          opacity: interpolate(frame, [0, 14], [0, 1], clamp),
        }}
      >
        {TASKS.map((task, i) => (
          <div
            key={task.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              minHeight: 104,
              borderBottom:
                i < TASKS.length - 1 ? '2px solid var(--hair)' : 'none',
              opacity: interpolate(
                frame,
                [6 + i * 6, 20 + i * 6],
                [0, 1],
                clamp,
              ),
              translate: interpolate(
                frame,
                [6 + i * 6, 22 + i * 6],
                ['0px 18px', '0px 0px'],
                { ...clamp, easing: easeOut },
              ),
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                border: '3px solid var(--stone)',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--text)',
                  fontWeight: 600,
                  fontSize: 28,
                  color: 'var(--ink)',
                }}
              >
                {task.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--text)',
                  fontSize: 20,
                  color: 'var(--stone)',
                }}
              >
                {task.meta}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {task.dots.map((on, d) => (
                <div
                  key={d}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 7,
                    background: on ? 'var(--coral)' : 'transparent',
                    border: on ? 'none' : '2.5px solid var(--stone)',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
            <Interactive.Div
              name={`Play ${i + 1}`}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                position: 'relative',
                background:
                  i === 0 && frame >= 44 ? 'var(--terra)' : 'var(--sand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scale:
                  i === 0
                    ? interpolate(frame, [40, 46, 54], [1, 0.86, 1], clamp)
                    : 1,
              }}
            >
              {i === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 32,
                    border: '3px solid var(--terra)',
                    scale: interpolate(frame, [42, 64], [1, 1.9], {
                      ...clamp,
                      easing: easeOut,
                    }),
                    opacity: interpolate(
                      frame,
                      [42, 44, 64],
                      [0, 0.7, 0],
                      clamp,
                    ),
                  }}
                />
              )}
              <svg width="22" height="22" viewBox="0 0 16 16">
                <path
                  d="M4 2.5v11a.8.8 0 0 0 1.2.7l8.6-5.5a.8.8 0 0 0 0-1.4L5.2 1.8A.8.8 0 0 0 4 2.5z"
                  fill={i === 0 && frame >= 44 ? '#FFFFFF' : 'var(--terra-ink)'}
                />
              </svg>
            </Interactive.Div>
          </div>
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

interface DialProps {
  fraction: number;
  completed: number;
  ring: string;
  track: string;
  children: React.ReactNode;
}

const Dial = ({ fraction, completed, ring, track, children }: DialProps) => {
  const r = 91;
  const c = 2 * Math.PI * r;
  const seg = c / 4;
  const gap = 0.06 * c;
  return (
    <div style={{ position: 'relative', width: 360, height: 360 }}>
      <svg width="360" height="360" viewBox="0 0 264 264" fill="none">
        <circle cx="132" cy="132" r="118" stroke={track} strokeWidth="18" />
        <circle
          cx="132"
          cy="132"
          r="118"
          stroke={ring}
          strokeWidth="18"
          strokeLinecap="round"
          pathLength="1000"
          strokeDasharray="1000"
          strokeDashoffset={(1 - fraction) * 1000}
          transform="rotate(-90 132 132)"
        />
        <g
          transform="rotate(-79.2 132 132)"
          strokeWidth="8"
          strokeLinecap="round"
        >
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx="132"
              cy="132"
              r={r}
              stroke={ring}
              strokeOpacity={
                i < Math.floor(completed)
                  ? 1
                  : i < completed
                    ? 0.25 + 0.75 * (completed % 1)
                    : 0.25
              }
              strokeDasharray={`${seg - gap} ${c - seg + gap}`}
              strokeDashoffset={-seg * i}
            />
          ))}
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const FocusScene = () => {
  const frame = useCurrentFrame();
  const remaining = interpolate(frame, [26, 122], [1500, 0], {
    ...clamp,
    easing: Easing.inOut((t: number) => Easing.quad(t)),
  });
  return (
    <AbsoluteFill
      name="Focus"
      style={{ opacity: interpolate(frame, [124, 140], [1, 0], clamp) }}
    >
      {/* The session colour spreads out from the button that was tapped. */}
      <AbsoluteFill
        name="Focus colour"
        style={{
          background: 'var(--focus-screen)',
          clipPath: `circle(${interpolate(frame, [0, 22], [0, 1020], { ...clamp, easing: Easing.in((t: number) => Easing.quad(t)) })}px at 78% 30%)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          color: 'var(--on)',
          opacity: interpolate(frame, [14, 28], [0, 1], clamp),
          scale: interpolate(frame, [14, 34], [0.94, 1], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontFamily: 'var(--text)', fontSize: 20, opacity: 0.85 }}
          >
            Working on
          </div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: 40,
            }}
          >
            Write project brief
          </div>
        </div>
        <Dial
          fraction={remaining / 1500}
          completed={interpolate(frame, [118, 130], [1, 2], clamp)}
          ring="var(--acc-focus)"
          track="color-mix(in srgb, var(--on) 24%, transparent)"
        >
          <div
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: 64,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(remaining)}
          </div>
          <div
            style={{
              fontFamily: 'var(--text)',
              fontSize: 20,
              opacity: 0.85,
              marginTop: 6,
            }}
          >
            Remaining
          </div>
        </Dial>
        <div style={{ fontFamily: 'var(--text)', fontSize: 20, opacity: 0.85 }}>
          Session 2 of 4 · then a 5 min break
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BreakScene = () => {
  const frame = useCurrentFrame();
  const remaining = interpolate(frame, [10, 110], [300, 228], clamp);
  return (
    <AbsoluteFill
      name="Break"
      style={{
        background: 'var(--break-screen)',
        color: 'var(--on)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: interpolate(frame, [0, 12, 96, 110], [0, 1, 1, 0], clamp),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          translate: '0px 60px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontFamily: 'var(--text)', fontSize: 20, opacity: 0.85 }}
          >
            Short break
          </div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: 40,
            }}
          >
            Stretch, sip, look far away
          </div>
        </div>
        <Dial
          fraction={remaining / 300}
          completed={2}
          ring="var(--acc-break)"
          track="color-mix(in srgb, var(--on) 24%, transparent)"
        >
          <div
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: 64,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(remaining)}
          </div>
          <div
            style={{
              fontFamily: 'var(--text)',
              fontSize: 20,
              opacity: 0.85,
              marginTop: 6,
            }}
          >
            Remaining
          </div>
        </Dial>
      </div>

      {/* The Lock Screen card drops in from the top, like a Live Activity. */}
      <Interactive.Div
        name="Lock Screen card"
        style={{
          position: 'absolute',
          top: 0,
          left: 70,
          width: 580,
          borderRadius: 36,
          padding: '26px 30px',
          background: '#1F5238',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          boxSizing: 'border-box',
          translate: interpolate(frame, [18, 44], ['0px -180px', '0px 36px'], {
            ...clamp,
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      >
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#FFF6EC"
            strokeOpacity="0.25"
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
            strokeDashoffset={(1 - remaining / 300) * 1000}
            transform="rotate(-90 24 24)"
          />
        </svg>
        <div style={{ flex: 1, color: '#FFF6EC' }}>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: 28,
            }}
          >
            Short break
          </div>
          <div
            style={{ fontFamily: 'var(--text)', fontSize: 19, opacity: 0.9 }}
          >
            Back at 10:33
          </div>
        </div>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 900,
            fontSize: 48,
            color: '#FFF6EC',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmt(remaining)}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const WEEK = [75, 100, 125, 50, 50, 0, 0];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Today', 'Sat', 'Sun'];

const WeekScene = () => {
  const frame = useCurrentFrame();
  const bump = interpolate(frame, [40, 56], [0, 25], {
    ...clamp,
    easing: easeOut,
  });
  const total = 400 + bump;
  return (
    <AbsoluteFill
      name="Week"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: interpolate(frame, [0, 12, 76, 90], [0, 1, 1, 0], clamp),
      }}
    >
      <Interactive.Div
        name="Week card"
        style={{
          width: 580,
          background: 'var(--surface)',
          borderRadius: 32,
          padding: 36,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          translate: interpolate(frame, [0, 18], ['0px 24px', '0px 0px'], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--text)',
              fontSize: 20,
              color: 'var(--stone)',
            }}
          >
            Focused this week
          </div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: 64,
              color: 'var(--ink)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmtMinutes(total)}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 16,
            height: 260,
          }}
        >
          {WEEK.map((minutes, i) => {
            const isToday = i === 4;
            const value = isToday ? minutes + bump : minutes;
            return (
              <div
                key={DAYS[i]}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--text)',
                    fontWeight: 600,
                    fontSize: 20,
                    color: 'var(--terra-ink)',
                    opacity: isToday
                      ? interpolate(
                          frame,
                          [40, 50, 70, 78],
                          [0, 1, 1, 0],
                          clamp,
                        )
                      : 0,
                  }}
                >
                  +25m
                </div>
                <div
                  style={{
                    width: '100%',
                    height: Math.max(4, (value / 140) * 190),
                    borderRadius: '12px 12px 5px 5px',
                    background: isToday ? 'var(--coral)' : 'var(--track)',
                    transformOrigin: '50% 100%',
                    scale: `1 ${interpolate(frame, [4 + i * 3, 26 + i * 3], [0, 1], { ...clamp, easing: easeOut })}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: 'var(--text)',
                    fontSize: 18,
                    color: isToday ? 'var(--ink)' : 'var(--stone)',
                    fontWeight: isToday ? 600 : 400,
                  }}
                >
                  {DAYS[i]}
                </div>
              </div>
            );
          })}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const Story = () => (
  <AbsoluteFill
    name="Story"
    style={{ background: 'var(--sand)', overflow: 'hidden' }}
  >
    <Sequence name="Pick" from={0} durationInFrames={90}>
      <TaskScene />
    </Sequence>
    <Sequence name="Focus" from={76} durationInFrames={140}>
      <FocusScene />
    </Sequence>
    <Sequence name="Break" from={206} durationInFrames={110}>
      <BreakScene />
    </Sequence>
    <Sequence name="Week" from={310} durationInFrames={90}>
      <WeekScene />
    </Sequence>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// The mark: the "r" rises, the tomato drops and lands, the leaf sprouts.
// The same motion as the app's splash screen.
// ---------------------------------------------------------------------------

export const Mark = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [104, 118], [1, 0], clamp);
  return (
    <AbsoluteFill
      name="Mark"
      style={{ alignItems: 'center', justifyContent: 'center', opacity: fade }}
    >
      <Interactive.Svg
        name="Logo"
        width="200"
        height="200"
        viewBox="0 0 192 192"
        fill="none"
        style={{ overflow: 'visible' }}
      >
        <Interactive.Path
          name="Letter r"
          d="M72 66v62M72 104c0-22 12-36 32-36"
          stroke="var(--ink)"
          strokeWidth="26"
          strokeLinecap="round"
          style={{
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
            translate: interpolate(frame, [0, 11], ['0px 14px', '0px 0px'], {
              ...clamp,
              easing: easeOut,
            }),
          }}
        />
        <Interactive.Circle
          name="Tomato"
          cx="130"
          cy="124"
          r="15"
          fill="var(--coral)"
          style={{
            transformBox: 'fill-box',
            transformOrigin: '50% 100%',
            opacity: interpolate(frame, [8, 9], [0, 1], clamp),
            translate: interpolate(frame, [9, 19], ['0px -70px', '0px 0px'], {
              ...clamp,
              easing: Easing.in((t: number) => Easing.quad(t)),
            }),
            scale: `${interpolate(frame, [19, 22, 30], [1, 1.16, 1], clamp)} ${interpolate(frame, [19, 22, 30], [1, 0.84, 1], clamp)}`,
          }}
        />
        <Interactive.Path
          name="Leaf"
          d="M130 110.6c-2.1-4.3-5.9-4.8-8.6-3.2M130 110.6c2.1-4.3 5.9-4.8 8.6-3.2"
          stroke="var(--leaf-text)"
          strokeWidth="3.6"
          strokeLinecap="round"
          style={{
            transformBox: 'fill-box',
            transformOrigin: '50% 100%',
            scale: interpolate(frame, [25, 30, 34], [0, 1.25, 1], clamp),
          }}
        />
      </Interactive.Svg>
    </AbsoluteFill>
  );
};
