"use client";

import { useRef, useCallback } from "react";
import type { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MapBackground = dynamic(() => import("./MapBackground"), { ssr: false });

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const PIN_TIMINGS = [1.1, 2.0, 3.0, 4.0, 5.1] as const;
const TOTAL_DURATION = 6.1;

/* ── Landmark data ─────────────────────────────────────────────────────── */
interface Landmark {
    id: string;
    label: string;
    sublabel: string;
    description: string;
    image: string;
    imageAlt: string;
    accent: string;
    cx: number;
    cy: number;
    lat: number;
    lng: number;
    mapZoom: number;
    panelSide: "left" | "right";
}

const LANDMARKS: Landmark[] = [
    {
        id: "sultanahmet",
        label: "Sultanahmet",
        sublabel: "Historic Heart",
        description: "Six minarets, two millennia of empire. The Blue Mosque and Hagia Sophia face each other across a silence that hums with history.",
        image: `${CDN}/ayasofya.webp`,
        imageAlt: "Hagia Sophia",
        accent: "#f47b20",
        cx: 16, cy: 38,
        lat: 41.0054, lng: 28.9768, mapZoom: 15,
        panelSide: "right",
    },
    {
        id: "bazaar",
        label: "Kapalıçarşı",
        sublabel: "Grand Bazaar",
        description: "61 covered streets, 4,000 shops and the world's oldest scent of spice. Once you enter, the city will never fully let you leave.",
        image: `${CDN}/kapali-carsi-1.webp`,
        imageAlt: "Grand Bazaar Istanbul",
        accent: "#7ac143",
        cx: 28, cy: 33,
        lat: 41.0105, lng: 28.9680, mapZoom: 15,
        panelSide: "right",
    },
    {
        id: "galata",
        label: "Galata",
        sublabel: "Beyoğlu Nights",
        description: "A medieval tower that watches over the city's most bohemian quarter. Coffee in the morning, jazz at midnight.",
        image: `${CDN}/galata-kulesi.webp`,
        imageAlt: "Galata Tower",
        accent: "#00a6ef",
        cx: 40, cy: 27,
        lat: 41.0258, lng: 28.9744, mapZoom: 15,
        panelSide: "right",
    },
    {
        id: "taksim",
        label: "Taksim",
        sublabel: "İstiklal Avenue",
        description: "Three kilometres of bookshops, galleries and street music. The nostalgic red tram still runs through the crowd.",
        image: `${CDN}/taksim-tramvay.webp`,
        imageAlt: "İstiklal tram Taksim",
        accent: "#2e3192",
        cx: 53, cy: 24,
        lat: 41.0369, lng: 28.9854, mapZoom: 15,
        panelSide: "left",
    },
    {
        id: "kadikoy",
        label: "Kadıköy",
        sublabel: "Asian Soul",
        description: "The Bosphorus crossing takes 20 minutes and delivers you to another world. Markets, murals and the bull that became a symbol.",
        image: `${CDN}/boga-heykeli.webp`,
        imageAlt: "Kadıköy Bull Statue",
        accent: "#ec008c",
        cx: 76, cy: 37,
        lat: 40.9924, lng: 29.0275, mapZoom: 15,
        panelSide: "left",
    },
];

const ROUTE =
    "M 16,38 C 21,36 24,34 28,33 C 34,31 37,29 40,27 C 46,26 50,25 53,24 C 61,27 68,32 76,37";

export default function Discovery() {
    const sectionRef = useRef<HTMLElement>(null);
    const svgStageRef = useRef<HTMLDivElement>(null);
    const routeRef = useRef<SVGPathElement>(null);
    const ferryRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const atmRefs = useRef<(HTMLDivElement | null)[]>([]);
    const marti2Ref = useRef<HTMLDivElement>(null);
    const marti1Ref = useRef<HTMLDivElement>(null);
    const laleRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);

    const handleMapReady = useCallback((m: LeafletMap) => {
        leafletMap.current = m;
    }, []);

    useGSAP(() => {
        if (!sectionRef.current || !routeRef.current || !svgStageRef.current) return;

        const path = routeRef.current;
        const length = path.getTotalLength();

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(pinRefs.current, { scale: 0, opacity: 0 });
        gsap.set(labelRefs.current, { opacity: 0, y: 10 });
        gsap.set(ferryRef.current, { x: "115%" });
        gsap.set(headlineRef.current, { opacity: 0, y: 28 });
        gsap.set(subRef.current, { opacity: 0 });
        gsap.set([marti2Ref.current, marti1Ref.current], { opacity: 0, y: -15 });
        gsap.set(laleRef.current, { opacity: 0, y: 40 });

        LANDMARKS.forEach((lm, i) => {
            const p = panelRefs.current[i];
            if (p) gsap.set(p, {
                opacity: 0,
                x: lm.panelSide === "right" ? 80 : -80,
                pointerEvents: "none",
            });
            const a = atmRefs.current[i];
            if (a) gsap.set(a, {
                opacity: 0,
                x: lm.panelSide === "right" ? -80 : 80,
            });
        });

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


                        onUpdate: (() => {
                            let sizeFixed = false;
                            return (self: ScrollTrigger) => {
                                if (!sizeFixed && leafletMap.current) {
                                    leafletMap.current.invalidateSize();
                                    sizeFixed = true;
                                }
                                const pProg = self.progress * TOTAL_DURATION;
                                let activeIndex = -1;
                                for (let i = 0; i < PIN_TIMINGS.length; i++) {
                                    if (pProg >= PIN_TIMINGS[i]) activeIndex = i;
                                }
                                if (!leafletMap.current) return;

                                if (activeIndex >= 0) {
                                    const lm = LANDMARKS[activeIndex];
                                    leafletMap.current.setView(
                                        [lm.lat, lm.lng],
                                        lm.mapZoom,
                                        { animate: true, duration: 0.9 },
                                    );
                                } else {
                                    leafletMap.current.setView(
                                        [41.01, 29.0], 12,
                                        { animate: true, duration: 0.9 },
                                    );
                                }
                            };
                        })(),
                    },
                });

                tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
                tl.to(subRef.current, { opacity: 1, duration: 0.5 }, 0.3);
                tl.to(marti2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
                tl.to(marti1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.3);
                tl.to(laleRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.2);

                tl.to(ferryRef.current, { x: "-50%", ease: "none", duration: 8 }, 0.5);

                tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 5 }, 0.8);

                LANDMARKS.forEach((lm, i) => {
                    const t = PIN_TIMINGS[i];
                    const prev = i > 0 ? panelRefs.current[i - 1] : null;
                    const prevAtm = i > 0 ? atmRefs.current[i - 1] : null;
                    const prevLm = i > 0 ? LANDMARKS[i - 1] : null;

                    tl.to(pinRefs.current[i], {
                        scale: 1, opacity: 1,
                        duration: 0.4, ease: "back.out(2.5)",
                    }, t);
                    tl.fromTo(ringRefs.current[i],
                        { scale: 1, opacity: 0.9 },
                        { scale: 3, opacity: 0, duration: 0.6, ease: "power2.out" },
                        t + 0.05,
                    );
                    tl.to(labelRefs.current[i], {
                        opacity: 1, y: 0, duration: 0.4, ease: "power2.out",
                    }, t + 0.2);
                    if (prev && prevLm) {
                        tl.to(prev, {
                            opacity: 0,
                            x: prevLm.panelSide === "right" ? 60 : -60,
                            duration: 0.35, ease: "power2.in",
                        }, t - 0.1);
                    }
                    if (prevAtm && prevLm) {
                        tl.to(prevAtm, {
                            opacity: 0,
                            x: prevLm.panelSide === "right" ? -60 : 60,
                            duration: 0.35, ease: "power2.in",
                        }, t - 0.1);
                    }
                    tl.to(panelRefs.current[i], {
                        opacity: 1, x: 0,
                        duration: 0.55, ease: "power2.out",
                        pointerEvents: "auto",
                    }, t + 0.15);
                    tl.to(atmRefs.current[i], {
                        opacity: 1, x: 0,
                        duration: 0.65, ease: "power2.out",
                    }, t + 0.1);
                    tl.to(svgStageRef.current, {
                        x: `${(50 - lm.cx) * 0.035}%`,
                        y: `${(27 - lm.cy) * 0.05}%`,
                        scale: 1 + (i + 1) * 0.006,
                        duration: 0.6, ease: "power1.inOut",
                    }, t);
                });

                return () => ctx.revert();
            },
        );

        /* ── Idle animations (non-scroll, loop forever) ─────────────────── */
        gsap.to(marti2Ref.current, { y: "+=10", x: "+=6", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(marti1Ref.current, { y: "-=4", rotate: 1.5, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
        gsap.to(laleRef.current, { rotate: 2, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "bottom center" });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#020C1C" }}
        >
            {/* ── z:1  Real Istanbul map (CartoDB dark tiles via Leaflet) ── */}
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <MapBackground onMapReady={handleMapReady} />
            </div>

            {/* ── z:2  Atmospheric colour overlay on top of map tiles ─────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 2,
                    background: [
                        "radial-gradient(ellipse 18% 80% at 51% 50%, rgba(0,100,210,0.12) 0%, transparent 70%)",
                        "linear-gradient(108deg, rgba(12,32,24,0.72) 0%, rgba(10,27,46,0.62) 34%, rgba(4,14,29,0.48) 47%, rgba(4,14,29,0.48) 53%, rgba(28,21,5,0.68) 66%, rgba(16,12,4,0.74) 100%)",
                    ].join(", "),
                }}
            />

            {/* ── z:20  Headline ──────────────────────────────────────────── */}
            <div
                ref={headlineRef}
                className="absolute top-[7%] left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4"
                style={{ zIndex: 20 }}
            >
                <h2
                    className="font-bold leading-none tracking-tight text-white"
                    style={{
                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                        fontSize: "clamp(1.8rem, 5.5vw, 4.2rem)",
                    }}
                >
                    7 HILLS&nbsp;&middot;&nbsp;
                    <span style={{ color: "#00a6ef" }}>15 MILLION</span> STORIES
                </h2>
                <p
                    ref={subRef}
                    className="mt-3 text-white/45 tracking-[0.2em] uppercase font-light"
                    style={{ fontSize: "clamp(0.65rem, 1.2vw, 0.82rem)" }}
                >
                    The Erasmus Route &mdash; Istanbul
                </p>
            </div>

            {/* ── z:8  Large atmospheric ghost images (scroll-animated) ────── */}
            {/*
                These are full-height cutout images of each landmark that slide
                in from the opposite side of the info panel, creating a dramatic
                split-screen cinematic feel.
                – mask-image vignette fades the image into the dark background
                – panelSide "right" → ghost on LEFT side; "left" → ghost on RIGHT
            */}
            {LANDMARKS.map((lm, i) => (
                <div
                    key={`atm-${lm.id}`}
                    ref={el => { atmRefs.current[i] = el; }}
                    className="absolute pointer-events-none"
                    style={{
                        top: "14%",
                        bottom: "14%",
                        zIndex: 8,
                        width: "clamp(160px, 28vw, 360px)",
                        ...(lm.panelSide === "right"
                            ? { left: "3%", right: "auto" }
                            : { right: "3%", left: "auto" }),
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lm.image}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-contain"
                        style={{
                            opacity: 0.28,
                            // Radial vignette: image fades toward all edges
                            WebkitMaskImage:
                                lm.panelSide === "right"
                                    ? "radial-gradient(ellipse 90% 80% at 60% 50%, black 35%, transparent 80%)"
                                    : "radial-gradient(ellipse 90% 80% at 40% 50%, black 35%, transparent 80%)",
                            maskImage:
                                lm.panelSide === "right"
                                    ? "radial-gradient(ellipse 90% 80% at 60% 50%, black 35%, transparent 80%)"
                                    : "radial-gradient(ellipse 90% 80% at 40% 50%, black 35%, transparent 80%)",
                            filter: `drop-shadow(0 0 30px ${lm.accent}60)`,
                        }}
                    />
                    {/* Accent glow behind the image */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${lm.accent}18 0%, transparent 70%)`,
                        }}
                    />
                </div>
            ))}

            {/* ── z:10  marti-2 – flying seagull, top-right corner ─────────── */}
            <div
                ref={marti2Ref}
                className="absolute top-[11%] right-[5%] w-[7%] max-w-[90px] opacity-0 pointer-events-none"
                style={{ zIndex: 10, mixBlendMode: "multiply" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:10  marti-1 – standing seagull, bottom-right corner ─────── */}
            <div
                ref={marti1Ref}
                className="absolute bottom-[4%] right-[1.5%] w-[4%] max-w-[52px] opacity-0 pointer-events-none"
                style={{ zIndex: 10, mixBlendMode: "multiply" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-1.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:10  lale-2 – golden tulip cluster, bottom-left corner ───── */}
            <div
                ref={laleRef}
                className="absolute bottom-0 left-[0.5%] w-[11%] max-w-[138px] opacity-0 pointer-events-none"
                style={{ zIndex: 10, mixBlendMode: "multiply" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* ── z:12  SVG route + pin markers (GSAP pan target) ─────────── */}
            <div
                ref={svgStageRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 12 }}
            >
                <div
                    className="relative w-[96%] sm:w-[90%] max-w-[1160px]"
                    style={{ aspectRatio: "100 / 55" }}
                >
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 100 55"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <filter id="disc-glow" x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="0.5" result="blur" />
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

                    {/* ── Pin markers ─────────────────────────────────────── */}
                    {LANDMARKS.map((lm, i) => (
                        <div
                            key={lm.id}
                            className="absolute"
                            style={{
                                left: `${lm.cx}%`,
                                top: `${(lm.cy / 55) * 100}%`,
                                transform: "translate(-50%, -50%)",
                                zIndex: 15,
                            }}
                        >
                            {/* Pulse ring */}
                            <div
                                ref={el => { ringRefs.current[i] = el; }}
                                className="absolute rounded-full"
                                style={{
                                    inset: "-10px",
                                    border: `1px solid ${lm.accent}60`,
                                }}
                            />
                            {/* Dot */}
                            <div
                                ref={el => { pinRefs.current[i] = el; }}
                                className="w-3 h-3 md:w-[14px] md:h-[14px] rounded-full relative"
                                style={{
                                    background: lm.accent,
                                    boxShadow: `0 0 16px 6px ${lm.accent}70`,
                                    zIndex: 2,
                                }}
                            />
                            {/* Label above pin */}
                            <div
                                ref={el => { labelRefs.current[i] = el; }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2 text-center whitespace-nowrap"
                            >
                                <div
                                    className="text-white text-[0.65rem] sm:text-[0.75rem] font-bold leading-tight drop-shadow-lg"
                                    style={{ fontFamily: "var(--font-kelson-sans), Arial, sans-serif" }}
                                >
                                    {lm.label}
                                </div>
                                <div className="text-[0.55rem] sm:text-[0.65rem] font-medium leading-tight" style={{ color: lm.accent }}>
                                    {lm.sublabel}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── z:30  Landmark info panels ───────────────────────────────── */}
            {/*
                panelSide "right" → bottom-right, slides from right
                panelSide "left"  → bottom-left,  slides from left
                They are never shown simultaneously — GSAP hides prev before showing next.
            */}
            {LANDMARKS.map((lm, i) => (
                <div
                    key={`panel-${lm.id}`}
                    ref={el => { panelRefs.current[i] = el; }}
                    className="absolute pointer-events-none"
                    style={{
                        bottom: "6%",
                        zIndex: 30,
                        ...(lm.panelSide === "right"
                            ? { right: "3%", left: "auto" }
                            : { left: "3%", right: "auto" }),
                        width: "clamp(170px, 22vw, 260px)",
                    }}
                >
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: "rgba(2,12,28,0.72)",
                            border: `1px solid ${lm.accent}40`,
                            backdropFilter: "blur(14px)",
                        }}
                    >
                        {/* Image */}
                        <div className="w-full overflow-hidden" style={{ height: "clamp(90px, 13vw, 150px)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={lm.image}
                                alt={lm.imageAlt}
                                className="w-full h-full object-contain object-bottom"
                                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}
                            />
                        </div>
                        {/* Text */}
                        <div className="px-4 pb-4 pt-2">
                            <div
                                className="text-[0.58rem] font-semibold tracking-[0.24em] uppercase mb-1"
                                style={{ color: lm.accent }}
                            >
                                {lm.sublabel}
                            </div>
                            <h3
                                className="text-white font-bold leading-tight mb-1.5"
                                style={{
                                    fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                    fontSize: "clamp(0.82rem, 1.3vw, 1.0rem)",
                                }}
                            >
                                {lm.label}
                            </h3>
                            <p className="text-white/52 leading-snug" style={{ fontSize: "0.66rem" }}>
                                {lm.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* ── z:10  Ferry crossing the Bosphorus ───────────────────────── */}
            <div
                ref={ferryRef}
                className="absolute bottom-[7%] right-0 w-[36%] sm:w-[28%] max-w-[460px] opacity-60 pointer-events-none"
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

            {/* ── z:20  Scroll cue ─────────────────────────────────────────── */}
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 pointer-events-none animate-scroll-cue" style={{ zIndex: 20 }}>
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" aria-hidden="true">
                    <rect x="10" y="0" width="4" height="20" rx="2" fill="rgba(255,255,255,0.25)" />
                    <path d="M4 20 L12 32 L20 20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    );
}
