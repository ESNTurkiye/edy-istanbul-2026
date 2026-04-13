"use client";

import { useRef, useCallback, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CDN, PIN_TIMINGS, LANDMARKS, smoothPath, cardPos } from "./landmarks";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MapBackground = dynamic(() => import("./MapBackground"), { ssr: false });

export default function Discovery() {
    const sectionRef = useRef<HTMLElement>(null);
    const routeRef = useRef<SVGPathElement>(null);
    const ferryRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const pinDotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const marti2Ref = useRef<HTMLDivElement>(null);
    const marti1Ref = useRef<HTMLDivElement>(null);
    const laleLeftRef = useRef<HTMLDivElement>(null);
    const laleRightRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leafletMap = useRef<any>(null);
    const [mapReady, setMapReady] = useState(false);
    const [pinPositions, setPinPositions] = useState<{ x: number; y: number }[]>([]);
    const [routePath, setRoutePath] = useState("");

    const handleMapReady = useCallback((m: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map = m as any;
        leafletMap.current = map;
        map.invalidateSize();

        // Use Leaflet's own projection — pins will sit exactly on the map tiles
        const positions = LANDMARKS.map(lm => {
            const pt = map.latLngToContainerPoint([lm.lat, lm.lng]);
            return { x: Math.round(pt.x), y: Math.round(pt.y) };
        });

        setPinPositions(positions);
        setRoutePath(smoothPath(positions));
        setMapReady(true);
    }, []);

    useGSAP(() => {
        if (!sectionRef.current) return;

        /* ── Always hide decoratives / headline on first paint ──────────── */
        gsap.set(headlineRef.current, { opacity: 0, y: 28 });
        gsap.set(subRef.current, { opacity: 0 });
        gsap.set(ferryRef.current, { x: "115%" });
        gsap.set([marti2Ref.current, marti1Ref.current], { opacity: 0, y: -15 });
        // Left lale needs to be flipped via GSAP so rotation is also handled by GSAP
        gsap.set(laleLeftRef.current, { scaleX: -1, opacity: 0, y: -30 });
        gsap.set(laleRightRef.current, { opacity: 0, y: -30 });

        /* Hide pins/cards — refs may still be null before mapReady */
        pinDotRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 0, opacity: 0 }); });
        ringRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 1, opacity: 0 }); });
        labelRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0, y: 6 }); });
        cardRefs.current.forEach((el, i) => {
            if (el) gsap.set(el, {
                opacity: 0,
                x: LANDMARKS[i].cardSide === "right" ? -20 : 20,
                pointerEvents: "none",
            });
        });

        /* ── Bail until Leaflet has calculated real pixel positions ─────── */
        if (!mapReady || pinPositions.length === 0 || !routeRef.current) return;

        const path = routeRef.current;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const mm = gsap.matchMedia();

        mm.add(
            { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
            (ctx) => {
                const { isMobile } = ctx.conditions as { isMobile: boolean };
                const scrollDist = isMobile ? "+=200%" : "+=260%";

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: scrollDist,
                        pin: true,
                        scrub: 1.2,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                /* 0 ── Headline */
                tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
                tl.to(subRef.current, { opacity: 1, duration: 0.5 }, 0.3);

                /* 0 ── Lale corner decorations bloom in from top */
                tl.to(laleLeftRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0);
                tl.to(laleRightRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.15);

                /* 0 ── Seagulls */
                tl.to(marti2Ref.current, { opacity: 0.75, y: 0, duration: 0.5 }, 0.1);
                tl.to(marti1Ref.current, { opacity: 0.55, y: 0, duration: 0.5 }, 0.3);

                /* 0.5 ── Ferry */
                tl.to(ferryRef.current, { x: "-50%", ease: "none", duration: 8 }, 0.5);

                /* 0.8 ── Route draws itself */
                tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 5 }, 0.8);

                /* ── Per-landmark reveals ──────────────────────────────── */
                LANDMARKS.forEach((lm, i) => {
                    const t = PIN_TIMINGS[i];
                    const prevCard = i > 0 ? cardRefs.current[i - 1] : null;
                    const prevLm = i > 0 ? LANDMARKS[i - 1] : null;

                    /* Pin dot pop */
                    tl.to(pinDotRefs.current[i], {
                        scale: 1, opacity: 1,
                        duration: 0.4, ease: "back.out(2.5)",
                    }, t);

                    /* Expanding ring */
                    tl.fromTo(ringRefs.current[i],
                        { scale: 1, opacity: 0.8 },
                        { scale: 3.5, opacity: 0, duration: 0.55, ease: "power2.out" },
                        t + 0.05,
                    );

                    /* Label */
                    tl.to(labelRefs.current[i], {
                        opacity: 1, y: 0,
                        duration: 0.4, ease: "power2.out",
                    }, t + 0.2);

                    /* Previous card exits toward its own side */
                    if (prevCard && prevLm) {
                        tl.to(prevCard, {
                            opacity: 0,
                            x: prevLm.cardSide === "right" ? 16 : -16,
                            duration: 0.3, ease: "power2.in",
                        }, t - 0.1);
                    }

                    /* Current card slides in */
                    tl.to(cardRefs.current[i], {
                        opacity: 1, x: 0,
                        duration: 0.55, ease: "power2.out",
                        pointerEvents: "auto",
                    }, t + 0.2);
                });

                return () => ctx.revert();
            },
        );

        /* ── Idle / ambient animations ──────────────────────────────────── */
        gsap.to(marti2Ref.current, { y: "+=10", x: "+=6", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(marti1Ref.current, { y: "-=4", rotate: 1.5, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
        // Lale sway — transformOrigin at the top so petals swing naturally
        gsap.to(laleLeftRef.current, { rotate: -1.8, scaleX: -1, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "top right" });
        gsap.to(laleRightRef.current, { rotate: 1.8, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "top left", delay: 0.4 });

        return () => mm.revert();

    }, { scope: sectionRef, dependencies: [mapReady, pinPositions] });

    const positionsReady = pinPositions.length === LANDMARKS.length;

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#020C1C" }}
        >
            {/* ── z:1  Leaflet map — CartoDB dark tiles, fixed at zoom 13 ── */}
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <MapBackground onMapReady={handleMapReady} />
            </div>

            {/* ── z:2  Light veil — preserves map readability ──────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 2,
                    background: [
                        "radial-gradient(ellipse 60% 70% at 50% 50%, transparent 35%, rgba(2,12,28,0.42) 100%)",
                        "linear-gradient(180deg, rgba(2,12,28,0.38) 0%, rgba(2,12,28,0.08) 35%, rgba(2,12,28,0.08) 65%, rgba(2,12,28,0.42) 100%)",
                    ].join(", "),
                }}
            />

            {/* ── z:10  lale-2 top-left (desktop — visible throughout scroll) */}
            {/*
                GSAP sets scaleX(-1) to flip; the outer div is positioned at
                the corner. Stays visible the entire pinned scroll duration.
            */}
            <div
                ref={laleLeftRef}
                className="hidden md:block absolute top-0 left-0 pointer-events-none"
                style={{
                    zIndex: 10,
                    width: "clamp(180px, 22vw, 300px)",
                    mixBlendMode: "multiply",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:10  lale-2 top-right (desktop) ───────────────────────── */}
            <div
                ref={laleRightRef}
                className="hidden md:block absolute top-0 right-0 pointer-events-none"
                style={{
                    zIndex: 10,
                    width: "clamp(180px, 22vw, 300px)",
                    mixBlendMode: "multiply",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:20  Headline ──────────────────────────────────────────── */}
            <div
                ref={headlineRef}
                className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4"
                style={{ zIndex: 20 }}
            >
                <h2
                    className="font-bold leading-none tracking-tight"
                    style={{
                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                        fontSize: "clamp(1.8rem, 5.5vw, 4.2rem)",
                        color: "white",
                        textShadow: "0 2px 20px rgba(0,0,0,0.75)",
                    }}
                >
                    7 HILLS&nbsp;&middot;&nbsp;
                    <span style={{ color: "#00aeef" }}>15 MILLION</span> STORIES
                </h2>
                <p
                    ref={subRef}
                    className="mt-3 tracking-[0.2em] uppercase font-light"
                    style={{
                        fontSize: "clamp(0.65rem, 1.2vw, 0.82rem)",
                        color: "rgba(255,255,255,0.52)",
                        textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                    }}
                >
                    The Erasmus Route &mdash; Istanbul
                </p>
            </div>

            {/* ── z:10  marti-2 flying seagull ────────────────────────────── */}
            <div
                ref={marti2Ref}
                className="absolute top-[11%] right-[5%] w-[7%] max-w-[88px] pointer-events-none"
                style={{ zIndex: 10, mixBlendMode: "multiply" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:10  marti-1 standing seagull, bottom-right ────────────── */}
            <div
                ref={marti1Ref}
                className="absolute bottom-[4%] right-[1.5%] w-[4%] max-w-[50px] pointer-events-none"
                style={{ zIndex: 10, mixBlendMode: "multiply" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-1.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:12  SVG route — pixel-space coordinates from Leaflet ─────
                No viewBox: SVG user units = CSS pixels, matching containerPoint.
                overflow-visible allows the path to extend outside the rect.   */}
            {routePath && (
                <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: "100%", height: "100%", zIndex: 12, overflow: "visible" }}
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="disc-glow" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="disc-route" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f47b20" stopOpacity="0.7" />
                            <stop offset="50%" stopColor="#f47b20" />
                            <stop offset="100%" stopColor="#f47b20" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <path
                        ref={routeRef}
                        d={routePath}
                        fill="none"
                        stroke="url(#disc-route)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#disc-glow)"
                    />
                </svg>
            )}

            {/* ── z:15/18  Pin markers + info cards ────────────────────────
                All positioned using Leaflet's latLngToContainerPoint() values.
                Pin dots are exactly over the correct geographic tile locations.  */}
            {positionsReady && LANDMARKS.map((lm, i) => {
                const pos = pinPositions[i];
                const card = cardPos(pos, lm);

                return (
                    <Fragment key={lm.id}>
                        {/* Pin dot + ring + label */}
                        <div
                            className="absolute"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: "translate(-50%, -50%)",
                                zIndex: 15,
                            }}
                        >
                            {/* Expanding ring (burst on reveal) */}
                            <div
                                ref={el => { ringRefs.current[i] = el; }}
                                className="absolute rounded-full"
                                style={{
                                    inset: "-12px",
                                    border: `1px solid ${lm.accent}70`,
                                }}
                            />
                            {/* Glowing dot */}
                            <div
                                ref={el => { pinDotRefs.current[i] = el; }}
                                className="relative rounded-full"
                                style={{
                                    width: 13,
                                    height: 13,
                                    background: lm.accent,
                                    boxShadow: `0 0 14px 5px ${lm.accent}90`,
                                    zIndex: 2,
                                }}
                            />
                            {/* Label above pin */}
                            <div
                                ref={el => { labelRefs.current[i] = el; }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 pb-[6px] whitespace-nowrap text-center"
                            >
                                <span
                                    className="font-bold leading-tight"
                                    style={{
                                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                        fontSize: "clamp(0.58rem, 0.85vw, 0.7rem)",
                                        color: "white",
                                        textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)",
                                    }}
                                >
                                    {lm.label}
                                </span>
                            </div>
                        </div>

                        {/* Info card — positioned next to the pin */}
                        <div
                            ref={el => { cardRefs.current[i] = el; }}
                            className="absolute pointer-events-none"
                            style={{
                                left: card.x,
                                top: card.y,
                                width: 200,
                                zIndex: 18,
                            }}
                        >
                            <div
                                className="rounded-xl overflow-hidden"
                                style={{
                                    background: "rgba(2,10,24,0.85)",
                                    border: `1px solid ${lm.accent}55`,
                                    backdropFilter: "blur(14px)",
                                }}
                            >

                                {/* Landmark image */}
                                <div className="w-full overflow-hidden" style={{ height: 100 }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={lm.image}
                                        alt={lm.imageAlt}
                                        className="w-full h-full object-contain object-bottom"
                                        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
                                    />
                                </div>

                                {/* Text */}
                                <div className="px-3 pb-3 pt-2">
                                    <p
                                        className="font-semibold tracking-[0.2em] uppercase mb-0.5"
                                        style={{ color: lm.accent, fontSize: "0.52rem" }}
                                    >
                                        {lm.sublabel}
                                    </p>
                                    <h3
                                        className="text-white font-bold leading-tight mb-1"
                                        style={{
                                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                            fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
                                        }}
                                    >
                                        {lm.label}
                                    </h3>
                                    <p style={{ color: "rgba(255,255,255,0.52)", fontSize: "0.59rem", lineHeight: 1.4 }}>
                                        {lm.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            })}

            {/* ── z:10  Ferry crossing the Bosphorus ──────────────────────── */}
            <div
                ref={ferryRef}
                className="absolute bottom-[7%] right-0 w-[36%] sm:w-[28%] max-w-[460px] opacity-55 pointer-events-none"
                style={{ zIndex: 10 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${CDN}/feribot-yatay.webp`}
                    alt="Istanbul ferry"
                    className="w-full h-auto"
                    style={{ transform: "scaleX(-1)" }}
                />
            </div>

            {/* ── z:20  Scroll cue ──────────────────────────────────────────── */}
            <div
                className="absolute bottom-[2%] left-1/2 -translate-x-1/2 pointer-events-none animate-scroll-cue"
                style={{ zIndex: 20 }}
            >
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" aria-hidden="true">
                    <rect x="10" y="0" width="4" height="20" rx="2" fill="rgba(255,255,255,0.25)" />
                    <path d="M4 20 L12 32 L20 20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    );
}
