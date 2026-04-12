"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface IntroSplashProps {
    onComplete: () => void;
}

// Istanbul sits at ~41°N, ~29°E.
// On a 280×280 sphere rendered equirectangularly (center = 15°E, 20°N):
//   x = 280/2 + (29−15)/180 × 280/2  ≈  140 + 11 ≈ 151  → left: 54%
//   y = 280/2 − (41−20)/90  × 280/2  ≈  140 − 65 ≈  75  → top:  27%
const ISTANBUL_X = "54%";
const ISTANBUL_Y = "27%";

export default function IntroSplash({ onComplete }: IntroSplashProps) {
    const containerRef     = useRef<HTMLDivElement>(null);
    const globeWrapRef     = useRef<HTMLDivElement>(null);
    const markerRef        = useRef<HTMLDivElement>(null);
    const titleRef         = useRef<HTMLDivElement>(null);
    const taglineRef       = useRef<HTMLDivElement>(null);
    const esnBadgeRef      = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !globeWrapRef.current) return;

        // Lock scroll while intro plays
        document.body.style.overflow = "hidden";

        // Position the zoom origin exactly over Istanbul
        gsap.set(globeWrapRef.current, {
            transformOrigin: `${ISTANBUL_X} ${ISTANBUL_Y}`,
        });

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = "";
                onComplete();
            },
        });

        // ── 0.0  Fade in ───────────────────────────────────────────────
        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" },
        );

        // ── 0.4  ESN badge floats up ────────────────────────────────────
        tl.fromTo(esnBadgeRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            0.4,
        );

        // ── 0.7  Headline sweeps in ─────────────────────────────────────
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 16, letterSpacing: "0.55em" },
            { opacity: 1, y: 0, letterSpacing: "0.18em", duration: 1.1, ease: "power2.out" },
            0.7,
        );

        // ── 1.0  Tagline fades in ───────────────────────────────────────
        tl.fromTo(taglineRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.7 },
            1.1,
        );

        // ── 1.6  Istanbul marker pops in ───────────────────────────────
        tl.fromTo(markerRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.8)" },
            1.7,
        );

        // ── 2.8  Texts fade out ahead of zoom ──────────────────────────
        tl.to([titleRef.current, taglineRef.current, esnBadgeRef.current], {
            opacity: 0,
            duration: 0.45,
            ease: "power2.in",
        }, 2.75);

        // ── 2.9  Zoom INTO Istanbul ─────────────────────────────────────
        tl.to(globeWrapRef.current, {
            scale: 9,
            duration: 1.2,
            ease: "power3.in",
        }, 2.85);

        // ── 3.7  Fade entire overlay away ──────────────────────────────
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.55,
            ease: "power2.in",
        }, 3.6);

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 flex flex-col items-center justify-center select-none"
            style={{
                zIndex: 9999,
                background:
                    "radial-gradient(ellipse 90% 100% at 50% 65%, #071d4a 0%, #030d1e 55%, #010810 100%)",
            }}
            aria-hidden="true"
        >
            {/* ── Starfield (CSS-only) ──────────────────────────────────── */}
            <Stars />

            {/* ── Globe ──────────────────────────────────────────────────── */}
            <div ref={globeWrapRef} className="relative mb-10 pointer-events-none">

                {/* Atmospheric halo behind the sphere */}
                <div className="globe-atmosphere" style={{ width: 280, height: 280 }} />

                {/* The sphere itself */}
                <div className="globe-sphere" style={{ width: 280, height: 280 }}>
                    {/* Latitude parallels */}
                    <div className="globe-latitudes" />
                    {/* Rotating meridians */}
                    <div className="globe-grid" />
                    {/* Specular highlight */}
                    <div className="globe-shine" />

                    {/* Istanbul marker */}
                    <div
                        ref={markerRef}
                        className="absolute"
                        style={{
                            left: ISTANBUL_X,
                            top: ISTANBUL_Y,
                            transform: "translate(-50%, -50%)",
                            opacity: 0,
                            zIndex: 10,
                        }}
                    >
                        {/* Pulsing rings */}
                        <div className="marker-ring marker-ring-outer" />
                        <div className="marker-ring marker-ring-inner" />
                        {/* Solid glow dot */}
                        <div className="marker-dot" />
                        {/* City label */}
                        <div className="marker-label">Istanbul</div>
                    </div>
                </div>
            </div>

            {/* ── ESN badge ─────────────────────────────────────────────── */}
            <div ref={esnBadgeRef} className="mb-4 opacity-0">
                <span
                    className="inline-block px-3 py-1 rounded-full text-[0.62rem] tracking-[0.28em] uppercase font-semibold"
                    style={{
                        background: "rgba(0,166,239,0.12)",
                        color: "#00a6ef",
                        border: "1px solid rgba(0,166,239,0.3)",
                    }}
                >
                    ESN Turkey presents
                </span>
            </div>

            {/* ── City title ────────────────────────────────────────────── */}
            <div ref={titleRef} className="opacity-0 text-center">
                <h1
                    style={{
                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(2.4rem, 7vw, 4rem)",
                        letterSpacing: "0.18em",
                        color: "white",
                        lineHeight: 1.0,
                        textShadow: "0 0 60px rgba(0,166,239,0.4)",
                    }}
                >
                    ISTANBUL
                </h1>
            </div>

            {/* ── Tagline ───────────────────────────────────────────────── */}
            <div ref={taglineRef} className="mt-3 opacity-0 text-center">
                <p
                    style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "clamp(0.65rem, 1.4vw, 0.82rem)",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                    }}
                >
                    Erasmus Destination of the Year 2026
                </p>
            </div>
        </div>
    );
}

/* ── Starfield helper ─────────────────────────────────────────────────────── */
function Stars() {
    // 72 deterministic stars to avoid hydration mismatch
    const stars: { x: number; y: number; r: number; o: number }[] = [];
    // Simple LCG seeded sequence for reproducible positions
    let seed = 0x8f3a;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0x100000000;
    };
    for (let i = 0; i < 72; i++) {
        stars.push({ x: rand() * 100, y: rand() * 100, r: rand() * 1.2 + 0.4, o: rand() * 0.5 + 0.15 });
    }

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            {stars.map((s, i) => (
                <circle
                    key={i}
                    cx={`${s.x}%`}
                    cy={`${s.y}%`}
                    r={s.r}
                    fill="white"
                    opacity={s.o}
                />
            ))}
        </svg>
    );
}
