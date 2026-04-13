"use client";

import { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

const ISTANBUL_LAT = 41.0082;
const ISTANBUL_LNG = 28.9784;

const GLOBE_POINTS = [
    { lat: ISTANBUL_LAT, lng: ISTANBUL_LNG, color: "#ec008c", radius: 0.45 },
];
const GLOBE_RINGS = [
    { lat: ISTANBUL_LAT, lng: ISTANBUL_LNG },
];

interface IntroSplashProps {
    onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeWrapRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globeEl = useRef<any>(null);

    // Called by Globe once the WebGL scene is ready
    const handleGlobeReady = useCallback(() => {
        const g = globeEl.current;
        if (!g) return;

        const ctrl = g.controls();
        ctrl.enableZoom = false;
        ctrl.autoRotate = true;
        ctrl.autoRotateSpeed = 20;

        g.pointOfView({ lat: 20, lng: ISTANBUL_LNG, altitude: 2.5 }, 0);

        setTimeout(() => {
            ctrl.autoRotate = false;
            g.pointOfView({ lat: ISTANBUL_LAT, lng: ISTANBUL_LNG, altitude: 1.1 }, 1400);
        }, 3150);
    }, []);

    useGSAP(() => {
        if (!containerRef.current) return;
        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = "";
                onComplete();
            },
        });

        // ── 0.0  Fade in overlay ─────────────────────────────────────────
        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" },
        );

        // ── 0.7  Headline ────────────────────────────────────────────────
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 16, letterSpacing: "0.55em" },
            { opacity: 1, y: 0, letterSpacing: "0.18em", duration: 1.1, ease: "power2.out" },
            0.7,
        );

        // ── 1.1  Tagline ─────────────────────────────────────────────────
        tl.fromTo(taglineRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.7 },
            1.1,
        );

        // ── 4.7  "Istanbul" label pops in (fly-to completes ~3.15+1.4 = 4.55 s)
        tl.fromTo(labelRef.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.8)" },
            4.7,
        );

        // ── 5.1  Texts fade out ──────────────────────────────────────────
        tl.to(
            [titleRef.current, taglineRef.current],
            { opacity: 0, duration: 0.45, ease: "power2.in" },
            5.1,
        );

        // ── 5.3  Zoom Phase 0 – Anticipation ────────────────────────────
        tl.to(globeWrapRef.current, {
            scale: 0.93,
            duration: 0.28,
            ease: "power2.in",
        }, 5.3);

        // ── 5.58  Zoom Phase 1 – Ease-In-Quart (fast acceleration) ───────
        tl.to(globeWrapRef.current, {
            scale: 2.1,
            filter: "blur(2px)",
            duration: 0.52,
            ease: "power4.in",
        }, 5.58);

        // ── 6.1  Zoom Phase 2 – Linear peak velocity ─────────────────────
        tl.to(globeWrapRef.current, {
            scale: 4.6,
            filter: "blur(5px)",
            duration: 0.38,
            ease: "none",
        }, 6.1);

        // ── 6.48  Zoom Phase 3 – Ease-Out-Expo (cinematic landing) ────────
        tl.to(globeWrapRef.current, {
            scale: 9,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "expo.out",
        }, 6.48);

        // ── 7.6  Fade overlay away ────────────────────────────────────────
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.in",
        }, 7.6);

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
            {/* ── Starfield ──────────────────────────────────────────────── */}
            <Stars />

            {/* ── Globe wrapper (zoom target) ─────────────────────────────── */}
            <div
                ref={globeWrapRef}
                className="relative mb-10 pointer-events-none"
                style={{ willChange: "transform, filter" }}
            >

                {/* Globe */}
                <GlobeGL
                    ref={globeEl}
                    onGlobeReady={handleGlobeReady}
                    width={460}
                    height={460}
                    backgroundColor="rgba(0,0,0,0)"
                    rendererConfig={{ alpha: true, antialias: true }}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    showAtmosphere
                    atmosphereColor="#4fa3f0"
                    atmosphereAltitude={0.22}
                    // Istanbul dot
                    pointsData={GLOBE_POINTS}
                    pointColor="color"
                    pointAltitude={0.015}
                    pointRadius="radius"
                    pointResolution={16}
                    // Istanbul pulsing ring
                    ringsData={GLOBE_RINGS}
                    ringColor={() => ["rgba(236,0,140,0.9)", "rgba(236,0,140,0)"]}
                    ringMaxRadius={3.5}
                    ringPropagationSpeed={2.5}
                    ringRepeatPeriod={1000}
                />

                {/* "Istanbul" text label – centered over globe after fly-to */}
                <div
                    ref={labelRef}
                    className="absolute pointer-events-none"
                    style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, 18px)",
                        opacity: 0,
                        zIndex: 10,
                        textAlign: "center",
                    }}
                >
                    <span
                        style={{
                            color: "rgba(255,255,255,0.92)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.24em",
                            textTransform: "uppercase",
                            textShadow: "0 0 12px rgba(236,0,140,0.9), 0 0 28px rgba(236,0,140,0.5)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Istanbul
                    </span>
                </div>
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
                        textShadow: "0 0 60px rgba(0,174,239,0.4)",
                    }}
                >
                    ISTANBUL
                </h1>
            </div>

            {/* ── Tagline ───────────────────────────────────────────────── */}
            <div ref={taglineRef} className="mt-3 opacity-0 text-center">
                {/* Poetic line — distilled from content themes */}
                <p
                    style={{
                        color: "rgba(255,255,255,0.82)",
                        fontSize: "clamp(0.72rem, 1.6vw, 0.92rem)",
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        marginBottom: "0.55rem",
                    }}
                >
                    History.&nbsp; Culture.&nbsp; Home.
                </p>
                {/* Official branding line */}
                <p
                    style={{
                        color: "rgba(255,255,255,0.38)",
                        fontSize: "clamp(0.55rem, 1.1vw, 0.68rem)",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                    }}
                >
                    Erasmus Destination of the Year 2026
                </p>
            </div>
        </div>
    );
}

/* ── Deterministic starfield (no hydration mismatch) ─────────────────────── */
function Stars() {
    const stars: { x: number; y: number; r: number; o: number }[] = [];
    let seed = 0x8f3a;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0x100000000;
    };
    for (let i = 0; i < 80; i++) {
        stars.push({ x: rand() * 100, y: rand() * 100, r: rand() * 1.2 + 0.4, o: rand() * 0.5 + 0.15 });
    }
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            {stars.map((s, i) => (
                <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o} />
            ))}
        </svg>
    );
}
