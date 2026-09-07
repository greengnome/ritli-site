'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Progressive enhancement: the server-rendered page is visible without JS. */
export function RitliMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const select = gsap.utils.selector(root);

    // MatchMedia also reverts every tween/trigger when the OS preference changes.
    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from(select('.site-header > *'), {
            y: -12,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
          })
          .from(
            select('.hero-copy > .eyebrow'),
            { y: 14, opacity: 0, duration: 0.6 },
            0.15,
          )
          .from(
            select('.headline-line'),
            {
              yPercent: 105,
              rotation: 2,
              opacity: 0,
              duration: 0.95,
              stagger: 0.13,
            },
            0.25,
          )
          .from(
            select('.hero-copy > p, .hero-actions, .hero-note'),
            { y: 22, opacity: 0, duration: 0.75, stagger: 0.1 },
            0.55,
          )
          .from(
            select('.app-preview'),
            { y: 50, rotation: -5, scale: 0.93, opacity: 0, duration: 1.25 },
            0.2,
          )
          .from(
            select('.product-caption'),
            { opacity: 0, y: 12, duration: 0.6 },
            0.7,
          )
          .from(
            select('.break-note'),
            {
              x: -24,
              y: 15,
              rotation: -12,
              opacity: 0,
              duration: 0.9,
              ease: 'back.out(1.4)',
            },
            0.85,
          )
          .from(
            select('.timer-ring'),
            { scale: 0.87, opacity: 0, duration: 1, ease: 'back.out(1.6)' },
            0.7,
          );

        gsap.from(select('.principles > span'), {
          y: 18,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: {
            trigger: select('.principles')[0],
            start: 'top 92%',
            once: true,
          },
        });

        select('.section-heading, .rhythm-intro').forEach(
          (element) => {
            gsap.from(element.children, {
              y: 26,
              opacity: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            });
          },
        );

        // Each card gets its own trigger so reveals also work in the mobile stack.
        select('.feature-card').forEach((card) => {
          const sequence = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
          sequence.from(card, { y: 44, opacity: 0, duration: 0.8 });
          const tasks = card.querySelectorAll('.task-list > div');
          const bars = card.querySelectorAll('.bars > div > span');
          const routine = card.querySelectorAll('.routine-demo > div');
          if (tasks.length)
            sequence.from(
              tasks,
              { x: -24, opacity: 0, stagger: 0.14, duration: 0.7 },
              0.2,
            );
          if (bars.length)
            sequence.from(
              bars,
              {
                scaleY: 0,
                transformOrigin: 'center bottom',
                stagger: 0.09,
                duration: 0.9,
              },
              0.25,
            );
          if (routine.length)
            sequence.from(
              routine,
              {
                y: 16,
                scale: 0.88,
                opacity: 0,
                stagger: 0.18,
                duration: 0.8,
                ease: 'back.out(1.5)',
              },
              0.25,
            );
        });

        select('.steps > li').forEach((step) => {
          gsap.from(step.children, {
            x: -18,
            opacity: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 87%', once: true },
          });
        });

        gsap.from(select('.coming-soon > *'), {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: select('.coming-soon')[0],
            start: 'top 80%',
            once: true,
          },
        });

        gsap.fromTo(
          select('.reading-progress'),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        );
      },
      root,
    );

    // Fine-pointer devices get a small, responsive tilt and scroll depth.
    media.add(
      '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 761px)',
      () => {
        const surface = select('.hero-product')[0] as HTMLElement;
        const preview = select('.preview-wrap')[0] as HTMLElement;
        const rotateX = gsap.quickTo(preview, 'rotationX', {
          duration: 0.65,
          ease: 'power3.out',
        });
        const rotateY = gsap.quickTo(preview, 'rotationY', {
          duration: 0.65,
          ease: 'power3.out',
        });
        const move = (event: PointerEvent) => {
          const bounds = surface.getBoundingClientRect();
          rotateX(-((event.clientY - bounds.top) / bounds.height - 0.5) * 7);
          rotateY(((event.clientX - bounds.left) / bounds.width - 0.5) * 9);
        };
        const reset = () => {
          rotateX(0);
          rotateY(0);
        };
        surface.addEventListener('pointermove', move);
        surface.addEventListener('pointerleave', reset);
        gsap.to(preview, {
          y: -35,
          ease: 'none',
          scrollTrigger: {
            trigger: select('.hero')[0],
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
        return () => {
          surface.removeEventListener('pointermove', move);
          surface.removeEventListener('pointerleave', reset);
        };
      },
      root,
    );

    return () => media.revert();
  }, []);

  return (
    <div id="top" className="page-shell" ref={root}>
      <div className="reading-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
