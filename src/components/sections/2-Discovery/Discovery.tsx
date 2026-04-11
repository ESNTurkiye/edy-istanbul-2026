"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

/* ── Landmark data (SVG coordinate space: viewBox 0 0 100 55) ── */
interface Landmark {
    id: string;
    label: string;
    sublabel: string;
    cx: number; // 0–100
    cy: number; // 0–55
}

const LANDMARKS: Landmark[] = [
    { id: "sultanahmet", label: "Sultanahmet",  sublabel: "Historic Heart",   cx: 16, cy: 38 },
    { id: "bazaar",      label: "Kapalıçarşı",  sublabel: "Grand Bazaar",     cx: 28, cy: 33 },
    { id: "galata",      label: "Galata",        sublabel: "Beyoğlu Nights",   cx: 40, cy: 27 },
    { id: "taksim",      label: "Taksim",        sublabel: "İstiklal Avenue",  cx: 53, cy: 24 },
    { id: "kadikoy",     label: "Kadıköy",       sublabel: "Asian Soul",       cx: 76, cy: 37 },
];

// SVG path connecting landmarks (0–100 / 0–55 space)
const ROUTE =
    "M 16,38 C 21,36 24,34 28,33 C 34,31 37,29 40,27 C 46,26 50,25 53,24 C 61,27 68,32 76,37";

export default function Discovery() {
    const sectionRef  = useRef<HTMLElement>(null);
    const mapRef      = useRef<HTMLDivElement>(null);
    const routeRef    = useRef<SVGPathElement>(null);
    const ferryRef    = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const subRef      = useRef<HTMLParagraphElement>(null);
    const pinRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs   = useRef<(HTMLDivElement | null)[]>([]);
    const ringRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const gullRef     = useRef<HTMLDivElement>(null);
    const gull2Ref    = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !routeRef.current || !mapRef.current) return;

        const path   = routeRef.current;
        const length = path.getTotalLength();

        /* Initial states */
        gsap.set(path,                          { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(pinRefs.current,               { scale: 0, opacity: 0 });
        gsap.set(labelRefs.current,             { opacity: 0, y: 10 });
        gsap.set(ferryRef.current,              { x: "115%" });
        gsap.set(headlineRef.current,           { opacity: 0, y: 28 });
        gsap.set(subRef.current,                { opacity: 0 });
        gsap.set([gullRef.current, gull2Ref.current], { opacity: 0, y: -15 });

        const mm = gsap.matchMedia();

        mm.add(
            { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
            (ctx) => {
                const { isMobile } = ctx.conditions as { isMobile: boolean };
                const scrollDist   = isMobile ? "+=180%" : "+=240%";

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start:   "top top",
                        end:     scrollDist,
                        pin:     true,
                        scrub:   1.2,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                /* 0 ─ Headline + seagulls enter */
                tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
                tl.to(subRef.current,      { opacity: 1, duration: 0.5 }, 0.3);
                tl.to([gullRef.current, gull2Ref.current], { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, 0.1);

                /* 0.5 ─ Ferry drifts left to right (very slow, lasts whole timeline) */
                tl.to(ferryRef.current, { x: "-50%", ease: "none", duration: 8 }, 0.5);

                /* 0.8 ─ Route path draws */
                tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 5 }, 0.8);

                /* Pins: staggered along the timeline, synced to path draw */
                const pinTimings = [1.1, 2.0, 3.0, 4.0, 5.1];

                LANDMARKS.forEach((lm, i) => {
                    const t = pinTimings[i];

                    // Pin circle pops in
                    tl.to(pinRefs.current[i],  { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)" }, t);
                    // Ring burst
                    tl.fromTo(
                        ringRefs.current[i],
                        { scale: 1, opacity: 0.9 },
                        { scale: 3, opacity: 0, duration: 0.6, ease: "power2.out" },
                        t + 0.05,
                    );
                    // Label slides up
                    tl.to(labelRefs.current[i], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, t + 0.2);

                    // Subtle map pan toward pin
                    const panX = (50 - lm.cx) * 0.04;
                    const panY = (27 - lm.cy)  * 0.06;
                    tl.to(mapRef.current, {
                        x: `${panX}%`,
                        y: `${panY}%`,
                        scale: 1 + (i + 1) * 0.007,
                        duration: 0.6,
                        ease: "power1.inOut",
                    }, t);
                });

                return () => ctx.revert();
            },
        );

        /* Seagull idle float (not scroll-bound) */
        gsap.to(gullRef.current, {
            y: "+=10", x: "+=6",
            duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
        gsap.to(gull2Ref.current, {
            y: "-=8", x: "-=5",
            duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut",
            delay: 1.2,
        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#020C1C" }}
        >
            {/* ── Atmospheric map-feel gradient ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        "radial-gradient(ellipse 16% 90% at 51% 50%, rgba(0,110,210,0.16) 0%, transparent 70%)",
                        "linear-gradient(108deg, #0C2018 0%, #0A1B2E 34%, #040E1D 47%, #040E1D 53%, #1C1505 66%, #100C04 100%)",
                    ].join(", "),
                }}
            />

            {/* ── Headline ── */}
            <div
                ref={headlineRef}
                className="absolute top-[7%] left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4"
            >
                <h2 className="font-brand font-bold leading-none tracking-tight text-white text-[clamp(2rem,5.5vw,4.2rem)]">
                    7 HILLS&nbsp;·&nbsp;
                    <span style={{ color: "#00a6ef" }}>15 MILLION</span> STORIES
                </h2>
                <p
                    ref={subRef}
                    className="mt-3 text-white/45 text-[clamp(0.7rem,1.2vw,0.85rem)] tracking-[0.2em] uppercase font-light"
                >
                    The Erasmus Route — Istanbul
                </p>
            </div>

            {/* ── Seagulls ── */}
            <div ref={gullRef} className="absolute top-[14%] right-[7%] w-[9%] max-w-[120px] opacity-0 pointer-events-none z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-2.webp`} alt="" className="w-full h-auto" />
            </div>
            <div ref={gull2Ref} className="absolute top-[22%] left-[5%] w-[5%] max-w-[70px] opacity-0 pointer-events-none z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-1.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── Tram accent (desktop only, right edge) ── */}
            <div className="hidden md:block absolute top-[28%] right-[0.5%] w-[11%] max-w-[150px] opacity-20 pointer-events-none z-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/taksim-tramvay.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── Tulip corner ── */}
            <div className="absolute bottom-[4%] left-[2%] w-[6%] max-w-[80px] opacity-35 pointer-events-none z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── MAP STAGE ── */}
            <div ref={mapRef} className="absolute inset-0 flex items-center justify-center">
                <div
                    className="relative w-[96%] sm:w-[90%] max-w-[1160px]"
                    style={{ aspectRatio: "100 / 55" }}
                >
                    {/* SVG Route */}
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 100 55"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <filter id="disc-glow" x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="0.6" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="disc-route" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="#f47b20" stopOpacity="0.7" />
                                <stop offset="50%"  stopColor="#f47b20" />
                                <stop offset="100%" stopColor="#f47b20" stopOpacity="0.6" />
                            </linearGradient>
                        </defs>

                        {/* Subtle Bosphorus water band */}
                        <rect x="59" y="0" width="9" height="55" fill="rgba(0,120,220,0.07)" />

                        {/* "Europe" / "Asia" side labels */}
                        <text x="32"  y="52" fontSize="2.2" fill="rgba(255,255,255,0.12)" textAnchor="middle" fontStyle="italic" fontFamily="sans-serif">Europe</text>
                        <text x="76"  y="52" fontSize="2.2" fill="rgba(255,255,255,0.12)" textAnchor="middle" fontStyle="italic" fontFamily="sans-serif">Asia</text>

                        {/* Animated route path */}
                        <path
                            ref={routeRef}
                            d={ROUTE}
                            fill="none"
                            stroke="url(#disc-route)"
                            strokeWidth="0.45"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#disc-glow)"
                        />
                    </svg>

                    {/* ── Pin Markers (DOM, aligned to SVG viewBox) ── */}
                    {LANDMARKS.map((lm, i) => (
                        <div
                            key={lm.id}
                            className="absolute"
                            style={{
                                left:      `${lm.cx}%`,
                                top:       `${(lm.cy / 55) * 100}%`,
                                transform: "translate(-50%, -50%)",
                                zIndex:    15,
                            }}
                        >
                            {/* Pulse ring (animated on reveal) */}
                            <div
                                ref={el => { ringRefs.current[i] = el; }}
                                className="absolute rounded-full border border-[#f47b20]/50"
                                style={{ inset: "-10px" }}
                            />

                            {/* Pin dot */}
                            <div
                                ref={el => { pinRefs.current[i] = el; }}
                                className="w-3 h-3 md:w-[14px] md:h-[14px] rounded-full"
                                style={{
                                    background:  "#f47b20",
                                    boxShadow:   "0 0 16px 6px rgba(244,123,32,0.5)",
                                    position:    "relative",
                                    zIndex:       2,
                                }}
                            />

                            {/* Label above pin */}
                            <div
                                ref={el => { labelRefs.current[i] = el; }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2 text-center whitespace-nowrap"
                            >
                                <div className="font-brand text-white text-[0.65rem] sm:text-[0.75rem] font-bold leading-tight drop-shadow-md">
                                    {lm.label}
                                </div>
                                <div className="text-[#f47b20] text-[0.55rem] sm:text-[0.65rem] font-medium leading-tight">
                                    {lm.sublabel}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Ferry crossing the scene ── */}
            <div
                ref={ferryRef}
                className="absolute bottom-[7%] right-0 w-[36%] sm:w-[28%] max-w-[460px] opacity-70 pointer-events-none z-10"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${CDN}/feribot-yatay.webp`}
                    alt="Istanbul Ferry"
                    className="w-full h-auto"
                    style={{ transform: "scaleX(-1)" }}
                />
            </div>

            {/* ── Scroll cue arrow ── */}
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-scroll-cue">
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" aria-hidden="true">
                    <rect x="10" y="0" width="4" height="20" rx="2" fill="rgba(255,255,255,0.25)" />
                    <path d="M4 20 L12 32 L20 20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    );
}
