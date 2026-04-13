"use client";

import { useRef, useCallback, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MapBackground = dynamic(() => import("./MapBackground"), { ssr: false });

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

/* ── Landmark data ─────────────────────────────────────────────────────── */
interface Landmark {
    id: string;
    label: string;
    sublabel: string;
    description: string;
    image: string;
    imageAlt: string;
    accent: string;
    /** Real GPS coordinates — used by Leaflet for exact pin placement */
    lat: number;
    lng: number;
    /**
     * Which side the info card appears on relative to the pin.
     * right → card to the right; left → card to the left.
     * Right-of-center (Taksim, Kadıköy) use left so card doesn't overflow screen.
     */
    cardSide: "left" | "right";
}

const LANDMARKS: Landmark[] = [
    {
        id:          "sultanahmet",
        label:       "Sultanahmet",
        sublabel:    "Historic Heart",
        description: "Six minarets, two millennia of empire. The Blue Mosque and Hagia Sophia face each other across a silence that hums with history.",
        image:       `${CDN}/ayasofya.webp`,
        imageAlt:    "Hagia Sophia",
        accent:      "#f47b20",
        lat: 41.0054, lng: 28.9768,
        cardSide: "right",
    },
    {
        id:          "bazaar",
        label:       "Kapalıçarşı",
        sublabel:    "Grand Bazaar",
        description: "61 covered streets, 4,000 shops and the world's oldest scent of spice. Once you enter, the city will never fully let you leave.",
        image:       `${CDN}/kapali-carsi-1.webp`,
        imageAlt:    "Grand Bazaar Istanbul",
        accent:      "#7ac143",
        lat: 41.0107, lng: 28.9681,
        cardSide: "right",
    },
    {
        id:          "galata",
        label:       "Galata",
        sublabel:    "Beyoğlu Nights",
        description: "A medieval tower that watches over the city's most bohemian quarter. Coffee in the morning, jazz at midnight.",
        image:       `${CDN}/galata-kulesi.webp`,
        imageAlt:    "Galata Tower",
        accent:      "#00a6ef",
        lat: 41.0256, lng: 28.9741,
        cardSide: "right",
    },
    {
        id:          "taksim",
        label:       "Taksim",
        sublabel:    "İstiklal Avenue",
        description: "Three kilometres of bookshops, galleries and street music. The nostalgic red tram still runs through the crowd.",
        image:       `${CDN}/taksim-tramvay.webp`,
        imageAlt:    "İstiklal tram Taksim",
        accent:      "#2e3192",
        lat: 41.0370, lng: 28.9851,
        cardSide: "left",
    },
    {
        id:          "kadikoy",
        label:       "Kadıköy",
        sublabel:    "Asian Soul",
        description: "The Bosphorus crossing takes 20 minutes and delivers you to another world. Markets, murals and the bull that became a symbol.",
        image:       `${CDN}/boga-heykeli.webp`,
        imageAlt:    "Kadıköy Bull Statue",
        accent:      "#ec008c",
        lat: 40.9904, lng: 29.0292,
        cardSide: "left",
    },
];

function cubicPoint(
    p0: { x: number; y: number },
    c1: { x: number; y: number },
    c2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number,
) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    return {
        x: mt2 * mt * p0.x + 3 * mt2 * t * c1.x + 3 * mt * t2 * c2.x + t2 * t * p3.x,
        y: mt2 * mt * p0.y + 3 * mt2 * t * c1.y + 3 * mt * t2 * c2.y + t2 * t * p3.y,
    };
}

function curveControls(pts: { x: number; y: number }[], i: number, tension = 1) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const c1 = {
        x: p1.x + ((p2.x - p0.x) / 6) * tension,
        y: p1.y + ((p2.y - p0.y) / 6) * tension,
    };
    const c2 = {
        x: p2.x - ((p3.x - p1.x) / 6) * tension,
        y: p2.y - ((p3.y - p1.y) / 6) * tension,
    };

    return { p1, c1, c2, p2 };
}

/** Smooth route that still passes exactly through every landmark point */
function routePathThroughPoints(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
        const { c1, c2, p2 } = curveControls(pts, i);
        d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
    }

    return d;
}

function pointTimingsFromSmoothCurve(pts: { x: number; y: number }[]) {
    if (pts.length === 0) return [];
    if (pts.length === 1) return [0];

    const lengths: number[] = [0];
    let total = 0;

    for (let i = 0; i < pts.length - 1; i++) {
        const { p1, c1, c2, p2 } = curveControls(pts, i);
        let segLen = 0;
        let prev = p1;

        for (let s = 1; s <= 24; s++) {
            const t = s / 24;
            const curr = cubicPoint(p1, c1, c2, p2, t);
            segLen += Math.hypot(curr.x - prev.x, curr.y - prev.y);
            prev = curr;
        }

        total += segLen;
        lengths.push(total);
    }

    if (total === 0) return lengths.map(() => 0);
    return lengths.map(v => v / total);
}

function pointTimingsFromSegmentDurations(segmentDurations: number[]) {
    const timings = [0];
    const total = segmentDurations.reduce((acc, v) => acc + v, 0);
    if (total === 0) return timings;

    let accum = 0;
    for (let i = 0; i < segmentDurations.length; i++) {
        accum += segmentDurations[i];
        timings.push(accum / total);
    }
    return timings;
}

function flowSide(index: number): "left" | "right" {
    return index % 2 === 0 ? "right" : "left";
}

/** Fixed card slots for cleaner storytelling: right, left, right, left... */
function cardPos(index: number) {
    const side = flowSide(index);
    return {
        left: side === "right" ? "calc(100% - 410px)" : "110px",
        top: "58%",
        side,
    };
}

export default function Discovery() {
    const sectionRef   = useRef<HTMLElement>(null);
    const routeRef     = useRef<SVGPathElement>(null);
    const ferryRef     = useRef<HTMLDivElement>(null);
    const headlineRef  = useRef<HTMLDivElement>(null);
    const subRef       = useRef<HTMLParagraphElement>(null);
    const pinDotRefs   = useRef<(HTMLDivElement | null)[]>([]);
    const ringRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const marti2Ref    = useRef<HTMLDivElement>(null);
    const marti1Ref    = useRef<HTMLDivElement>(null);
    const laleLeftRef  = useRef<HTMLDivElement>(null);
    const laleRightRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leafletMap = useRef<any>(null);
    const [mapReady,      setMapReady]      = useState(false);
    const [pinPositions,  setPinPositions]  = useState<{ x: number; y: number }[]>([]);
    const [routePath,     setRoutePath]     = useState("");

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
        setRoutePath(routePathThroughPoints(positions));
        setMapReady(true);
    }, []);

    useGSAP(() => {
        if (!sectionRef.current) return;

        /* ── Always hide decoratives / headline on first paint ──────────── */
        gsap.set(headlineRef.current,  { opacity: 0, y: 28 });
        gsap.set(subRef.current,       { opacity: 0 });
        gsap.set(ferryRef.current,     { x: "140%" });
        gsap.set([marti2Ref.current, marti1Ref.current], { opacity: 0, y: -15 });
        // Left lale needs to be flipped via GSAP so rotation is also handled by GSAP
        gsap.set(laleLeftRef.current,  { scaleX: -1, opacity: 0, y: -30 });
        gsap.set(laleRightRef.current, { opacity: 0, y: -30 });

        /* Hide pins/cards — refs may still be null before mapReady */
        pinDotRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 0, opacity: 0 }); });
        ringRefs.current.forEach(el   => { if (el) gsap.set(el, { scale: 1, opacity: 0 }); });
        labelRefs.current.forEach(el  => { if (el) gsap.set(el, { opacity: 0, y: 6 }); });
        cardRefs.current.forEach((el, i) => {
            const side = flowSide(i);
            if (el) gsap.set(el, {
                opacity: 0,
                x: side === "right" ? 320 : -320,
                pointerEvents: "none",
            });
        });

        /* ── Bail until Leaflet has calculated real pixel positions ─────── */
        if (!mapReady || pinPositions.length === 0 || !routeRef.current) return;

        const path   = routeRef.current;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const mm = gsap.matchMedia();

        mm.add(
            { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
            (ctx) => {
                const { isMobile } = ctx.conditions as { isMobile: boolean };
                const scrollDist   = isMobile ? "+=200%" : "+=260%";

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

                /* 0 ── Headline */
                tl.to(headlineRef.current,  { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
                tl.to(subRef.current,       { opacity: 1, duration: 0.5 }, 0.3);

                /* 0 ── Lale corner decorations bloom in from top */
                tl.to(laleLeftRef.current,  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0);
                tl.to(laleRightRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.15);

                /* 0 ── Seagulls */
                tl.to(marti2Ref.current,    { opacity: 0.75, y: 0, duration: 0.5 }, 0.1);
                tl.to(marti1Ref.current,    { opacity: 0.55, y: 0, duration: 0.5 }, 0.3);

                /* 0.5 ── Ferry: much slower pass, travels farther and disappears well past left edge */
                tl.to(ferryRef.current, { x: "-420%", ease: "none", duration: 76 }, 0.5);

                /* 0.8 ── Route draws itself */
                const routeStart = 0.8;
                const segmentDurations = [25, 25, 18, 15];
                const pointProgress = pointTimingsFromSmoothCurve(pinPositions);
                const pointTimeProgress = pointTimingsFromSegmentDurations(segmentDurations);

                let segmentStart = routeStart;
                for (let i = 0; i < segmentDurations.length; i++) {
                    const toProgress = pointProgress[i + 1] ?? 1;
                    tl.to(path, {
                        strokeDashoffset: length * (1 - toProgress),
                        ease: "none",
                        duration: segmentDurations[i],
                    }, segmentStart);
                    segmentStart += segmentDurations[i];
                }

                /* ── Per-landmark reveals ──────────────────────────────── */
                LANDMARKS.forEach((lm, i) => {
                    const timeProgress = pointTimeProgress[i] ?? 0;
                    const t = routeStart + segmentDurations.reduce((acc, v) => acc + v, 0) * timeProgress;
                    const prevCard = i > 0 ? cardRefs.current[i - 1] : null;
                    const prevSide = i > 0 ? flowSide(i - 1) : null;

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
                    }, t + 0.05);

                    /* Previous card exits toward its own side */
                    if (prevCard && prevSide) {
                        tl.to(prevCard, {
                            opacity: 0,
                            x: prevSide === "right" ? 320 : -320,
                            duration: 0.22, ease: "power2.in",
                        }, t);
                    }

                    /* Current card appears exactly when route reaches this pin */
                    tl.fromTo(cardRefs.current[i], {
                        x: flowSide(i) === "right" ? 320 : -320,
                    }, {
                        opacity: 1, x: 0,
                        duration: 0.3, ease: "power2.out",
                        pointerEvents: "auto",
                    }, t);
                });

                /* Extra scroll tail after Kadikoy so section does not end immediately */
                tl.to({}, { duration: 14 });

                return () => ctx.revert();
            },
        );

        /* ── Idle / ambient animations ──────────────────────────────────── */
        gsap.to(marti2Ref.current, { y: "+=10", x: "+=6",   duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(marti1Ref.current, { y: "-=4",  rotate: 1.5, duration: 4,  repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
        // Lale sway — transformOrigin at the top so petals swing naturally
        gsap.to(laleLeftRef.current,  { rotate: -1.8, scaleX: -1, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "top right" });
        gsap.to(laleRightRef.current, { rotate:  1.8, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "top left", delay: 0.4 });

        return () => mm.revert();

    }, { scope: sectionRef, dependencies: [mapReady, pinPositions] });

    const positionsReady = pinPositions.length === LANDMARKS.length;

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#07213b" }}
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
                        "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(5,24,45,0.3) 100%)",
                        "linear-gradient(180deg, rgba(4,18,34,0.26) 0%, rgba(4,18,34,0.06) 35%, rgba(4,18,34,0.06) 65%, rgba(4,18,34,0.3) 100%)",
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
                        fontSize:   "clamp(1.8rem, 5.5vw, 4.2rem)",
                        color: "white",
                        textShadow: "0 2px 20px rgba(0,0,0,0.75)",
                    }}
                >
                    7 HILLS&nbsp;&middot;&nbsp;
                    <span style={{ color: "#00a6ef" }}>15 MILLION</span> STORIES
                </h2>
                <p
                    ref={subRef}
                    className="mt-3 tracking-[0.2em] uppercase font-light"
                    style={{
                        fontSize: "clamp(0.65rem, 1.2vw, 0.82rem)",
                        color: "rgba(255,255,255,0.82)",
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
                            <stop offset="0%"   stopColor="#f47b20" stopOpacity="0.7" />
                            <stop offset="50%"  stopColor="#f47b20" />
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
                const pos  = pinPositions[i];
                const card = cardPos(i);

                return (
                    <Fragment key={lm.id}>
                        {/* Pin dot + ring + label */}
                        <div
                            className="absolute"
                            style={{
                                left:      pos.x,
                                top:       pos.y,
                                transform: "translate(-50%, -50%)",
                                zIndex:    15,
                            }}
                        >
                            {/* Expanding ring (burst on reveal) */}
                            <div
                                ref={el => { ringRefs.current[i] = el; }}
                                className="absolute rounded-full"
                                style={{
                                    inset:  "-12px",
                                    border: `1px solid ${lm.accent}70`,
                                }}
                            />
                            {/* Glowing dot */}
                            <div
                                ref={el => { pinDotRefs.current[i] = el; }}
                                className="relative rounded-full"
                                style={{
                                    width:     13,
                                    height:    13,
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
                                        fontFamily:  "var(--font-kelson-sans), Arial, sans-serif",
                                        fontSize:    "clamp(0.58rem, 0.85vw, 0.7rem)",
                                        color:       "white",
                                        textShadow:  "0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)",
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
                                left:   card.left,
                                top:    card.top,
                                width:  300,
                                transform: "translateY(-50%)",
                                zIndex: 40,
                            }}
                        >
                            <div
                                className="rounded-xl overflow-hidden"
                                style={{
                                    background:     "rgba(2,10,24,0.85)",
                                    border:         `1px solid ${lm.accent}55`,
                                    backdropFilter: "blur(14px)",
                                    boxShadow:      `0 4px 28px rgba(0,0,0,0.55), 0 0 0 1px ${lm.accent}22`,
                                }}
                            >
                                {/* Accent stripe */}
                                <div style={{ height: 3, background: lm.accent }} />

                                {/* Landmark image */}
                                <div className="w-full overflow-hidden" style={{ height: 150 }}>
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
                                        style={{ color: lm.accent, fontSize: "0.78rem" }}
                                    >
                                        {lm.sublabel}
                                    </p>
                                    <h3
                                        className="text-white font-bold leading-tight mb-1"
                                        style={{
                                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                            fontSize:   "clamp(1.05rem, 1.6vw, 1.35rem)",
                                        }}
                                    >
                                        {lm.label}
                                    </h3>
                                    <p style={{ color: "rgba(255,255,255,0.84)", fontSize: "0.88rem", lineHeight: 1.4 }}>
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
