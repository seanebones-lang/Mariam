"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const sizeClamp =
  "text-[clamp(3.25rem,10.5vw,6.75rem)] md:text-[clamp(3.5rem,11vw,7.25rem)]";

/**
 * Custom hero mark: interlocked blackletter, subtle ink displacement,
 * letterpress stack (no generic single gradient string).
 */
export function MBBMonogram({ className }: { className?: string }) {
  const raw = useId().replace(/:/g, "");
  const ids = useMemo(
    () => ({
      rough: `mbb-rough-${raw}`,
      ruleGrad: `mbb-rule-grad-${raw}`,
    }),
    [raw]
  );

  const [inkRough, setInkRough] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setInkRough(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const letters = [
    {
      ch: "M" as const,
      delay: "0ms",
      wrap: "-rotate-[5deg] translate-y-[0.08em] -mr-[0.12em] z-[1]",
    },
    {
      ch: "B" as const,
      delay: "90ms",
      wrap: "z-[3] -mx-[0.14em] scale-[1.07] translate-y-0",
    },
    {
      ch: "B" as const,
      delay: "180ms",
      wrap: "rotate-[4deg] translate-y-[0.06em] -ml-[0.1em] z-[2]",
    },
  ];

  return (
    <div
      className={cn("relative isolate select-none", className)}
      aria-label="MBB monogram"
    >
      <svg
        width="0"
        height="0"
        className="pointer-events-none absolute"
        aria-hidden
      >
        <defs>
          <filter
            id={ids.rough}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065 0.13"
              numOctaves="2"
              seed="19"
              result="n"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale="1.05"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id={ids.ruleGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a3121f" stopOpacity="0" />
            <stop offset="12%" stopColor="#a3121f" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#a3121f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a3121f" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="pointer-events-none absolute -left-1 top-[0.12em] bottom-[0.4em] w-px bg-gradient-to-b from-transparent via-blood/50 to-transparent md:-left-2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1 top-[0.12em] bottom-[0.4em] w-px bg-gradient-to-b from-transparent via-blood/50 to-transparent md:-right-2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-2 top-3 h-2 w-2 rotate-45 border border-blood/30 md:-left-3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-2 bottom-12 h-2 w-2 rotate-45 border border-blood/30 md:-right-3"
        aria-hidden
      />

      <div
        className="mbb-word relative inline-flex items-end"
        style={inkRough ? { filter: `url(#${ids.rough})` } : undefined}
      >
        {letters.map((L, i) => (
          <span
            key={`${L.ch}-${i}`}
            className={cn("mbb-L relative inline-block", sizeClamp, L.wrap)}
            style={{ ["--delay" as string]: L.delay } as React.CSSProperties}
          >
            <span
              className="absolute inset-0 text-char [font-family:var(--font-display),serif]"
              style={{
                transform: "translate(0.07em, 0.1em)",
                opacity: 0.92,
              }}
              aria-hidden
            >
              {L.ch}
            </span>
            <span
              className="absolute inset-0 text-transparent [font-family:var(--font-display),serif]"
              style={{ WebkitTextStroke: "2px #060606" }}
              aria-hidden
            >
              {L.ch}
            </span>
            <span
              className={cn(
                "relative block bg-gradient-to-b from-bandage via-bone to-blood bg-clip-text text-transparent [font-family:var(--font-display),serif]",
                "[text-shadow:0_0_28px_rgba(163,18,31,0.28),0_1px_0_rgba(0,0,0,0.88)]"
              )}
            >
              {L.ch}
            </span>
          </span>
        ))}
      </div>

      <svg
        className="mbb-word-foot pointer-events-none relative -mt-0.5 ml-[16%] h-5 w-3.5 text-blood/70 md:ml-[17%] md:h-6 md:w-4"
        viewBox="0 0 16 24"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M8 0c2 4 6 9 5.2 14.5C12.5 20 8 24 8 24S3.5 20 2.8 14.5C2 9 6 4 8 0z"
        />
      </svg>

      <svg
        className="mbb-rule-foot mt-1.5 h-3 w-[min(17rem,90vw)] max-w-full md:h-3.5"
        viewBox="0 0 320 14"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill={`url(#${ids.ruleGrad})`}
          d="M0 6 L12 4 L28 7 L44 3 L62 8 L80 4 L96 9 L114 5 L130 8 L148 4 L166 7 L184 3 L200 8 L218 5 L236 9 L254 4 L272 7 L290 3 L308 8 L320 5 L320 10 L308 12 L290 9 L272 11 L254 8 L236 11 L218 9 L200 12 L184 10 L166 12 L148 9 L130 11 L114 10 L96 12 L80 10 L62 11 L44 9 L28 10 L12 8 L0 9 Z"
        />
      </svg>

      <p
        className="mt-2 font-serif text-[0.62rem] uppercase tracking-[0.5em] text-bone/40 md:text-[0.7rem]"
        aria-hidden
      >
        Est. MMXXVI
      </p>
    </div>
  );
}
