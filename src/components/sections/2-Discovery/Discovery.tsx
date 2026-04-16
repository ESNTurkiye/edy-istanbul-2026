"use client";

import { useRef, useCallback, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Map } from "leaflet";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CDN, LANDMARKS } from "./landmarks";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MapBackground = dynamic(() => import("./MapBackground"), { ssr: false });

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

function routePathThroughPoints(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
        const { c1, c2, p2 } = curveControls(pts, i);
        d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
    }

    return d;
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

function pathProgressAtRoutePoints(path: SVGPathElement, pts: { x: number; y: number }[]) {
    if (pts.length === 0) return [];

    const total = path.getTotalLength();
    if (total <= 0) return pts.map(() => 0);

    const samples = 1800;
    const progresses: number[] = [0];
    let startIndex = 0;

    for (let i = 1; i < pts.length; i++) {
        let bestIdx = startIndex;
        let bestDist = Number.POSITIVE_INFINITY;

        for (let s = startIndex; s <= samples; s++) {
            const l = (s / samples) * total;
            const p = path.getPointAtLength(l);
            const dx = p.x - pts[i].x;
            const dy = p.y - pts[i].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestDist) {
                bestDist = d2;
                bestIdx = s;
            }
        }

        startIndex = bestIdx;
        progresses.push(bestIdx / samples);
    }

    return progresses;
}

export default function Discovery() {
    const sectionRef = useRef<HTMLElement>(null);
    const routeRef = useRef<SVGPathElement>(null);
    const ferryRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const pinDotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardFrameRef = useRef<HTMLDivElement>(null);
    const cardTrackRef = useRef<HTMLDivElement>(null);
    const marti2Ref = useRef<HTMLDivElement>(null);
    const marti1Ref = useRef<HTMLDivElement>(null);

    const leafletMap = useRef<Map | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [pinPositions, setPinPositions] = useState<{ x: number; y: number }[]>([]);
    const [routePath, setRoutePath] = useState("");

    const handleMapReady = useCallback((map: Map) => {
        leafletMap.current = map;
        map.invalidateSize();

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

        gsap.set(headlineRef.current, { opacity: 0, y: 28 });
        gsap.set(subRef.current, { opacity: 0 });
        gsap.set(ferryRef.current, { x: "140%" });
        gsap.set(marti2Ref.current, { opacity: 0, y: -15 });
        gsap.set(marti1Ref.current, { opacity: 0, y: -15, xPercent: -50 });
        gsap.set(cardFrameRef.current, { opacity: 0, x: -28 });
        gsap.set(cardTrackRef.current, { xPercent: 0 });

        pinDotRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 0, opacity: 0 }); });
        ringRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 1, opacity: 0 }); });
        labelRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0, y: 6 }); });

        if (!mapReady || pinPositions.length === 0 || !routeRef.current) return;

        const path = routeRef.current;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const mm = gsap.matchMedia();

        mm.add(
            { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
            (ctx) => {
                const { isMobile } = ctx.conditions as { isMobile: boolean };
                const scrollDist = isMobile ? "+=150%" : "+=180%";

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

                tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
                tl.to(subRef.current, { opacity: 1, duration: 0.5 }, 0.3);

                tl.to(marti2Ref.current, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.05);
                tl.to(marti1Ref.current, { opacity: 0.95, y: 0, duration: 0.55, ease: "power2.out" }, 0.2);

                gsap.to(ferryRef.current, {
                    x: "-150%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: scrollDist,
                        scrub: 1.2,
                        invalidateOnRefresh: true,
                    },
                });

                const routeStart = 0.8;
                const segmentDurations = [25, 25, 18, 15];
                const pointTimings = pointTimingsFromSegmentDurations(segmentDurations);
                const routeProgressAtPoints = pathProgressAtRoutePoints(path, pinPositions);

                let segStart = routeStart;
                for (let seg = 0; seg < segmentDurations.length; seg++) {
                    const nextProgress = routeProgressAtPoints[seg + 1] ?? 1;
                    tl.to(path, {
                        strokeDashoffset: length * (1 - nextProgress),
                        ease: "none",
                        duration: segmentDurations[seg],
                    }, segStart);
                    segStart += segmentDurations[seg];
                }

                const totalDuration = segmentDurations.reduce((a, b) => a + b, 0);
                LANDMARKS.forEach((lm, i) => {
                    const t = routeStart + totalDuration * (pointTimings[i] ?? 0);

                    tl.to(pinDotRefs.current[i], {
                        scale: 1, opacity: 1,
                        duration: 0.4, ease: "back.out(2.5)",
                    }, t);

                    tl.fromTo(ringRefs.current[i],
                        { scale: 1, opacity: 0.8 },
                        { scale: 3.5, opacity: 0, duration: 0.55, ease: "power2.out" },
                        t + 0.05,
                    );

                    tl.to(labelRefs.current[i], {
                        opacity: 1, y: 0,
                        duration: 0.4, ease: "power2.out",
                    }, t + 0.05);

                    if (i === 0) {
                        tl.to(cardFrameRef.current, {
                            opacity: 1,
                            x: 0,
                            duration: 0.35,
                            ease: "power2.out",
                        }, t);
                    }

                    tl.to(cardTrackRef.current, {
                        xPercent: -100 * i,
                        duration: 5,
                        ease: "power2.out",
                    }, t);
                });

                return () => ctx.revert();
            },
        );

        gsap.to(marti2Ref.current, { y: "+=12", x: "+=8", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(marti1Ref.current, { y: "-=6", rotate: 2, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });

        return () => mm.revert();

    }, { scope: sectionRef, dependencies: [mapReady, pinPositions] });

    const positionsReady = pinPositions.length === LANDMARKS.length;

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#07213b" }}
        >
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <MapBackground onMapReady={handleMapReady} />
            </div>
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
            <div
                ref={headlineRef}
                className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4 top-32 max-md:top-[calc(env(safe-area-inset-top,0px)+5.75rem)] md:top-[6%]"
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
            </div>
            <div
                ref={marti2Ref}
                className="absolute right-[2%] sm:right-[4%] pointer-events-none max-md:top-[calc(env(safe-area-inset-top,0px)+10rem)] md:top-[7%]"
                style={{
                    zIndex: 17,
                    width: "clamp(100px, 16vw, 200px)",
                    filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.55)) drop-shadow(0 0 1px rgba(255,255,255,0.35))",
                }}
            >
                <Image src={`${CDN}/marti-2.webp`} alt="" width={400} height={300} className="w-full h-auto" sizes="(max-width: 768px) 100px, 200px" />
            </div>
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
            {positionsReady && LANDMARKS.map((lm, i) => {
                const pos = pinPositions[i];

                return (
                    <Fragment key={lm.id}>
                        <div
                            className="absolute"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: "translate(-50%, -50%)",
                                zIndex: 15,
                            }}
                        >
                            <div
                                ref={el => { ringRefs.current[i] = el; }}
                                className="absolute rounded-full max-md:-inset-[14px] md:-inset-3"
                                style={{
                                    border: `1px solid ${lm.accent}70`,
                                }}
                            />
                            <div
                                ref={el => { pinDotRefs.current[i] = el; }}
                                className="relative rounded-full w-4 h-4 md:w-[13px] md:h-[13px]"
                                style={{
                                    background: lm.accent,
                                    boxShadow: `0 0 14px 5px ${lm.accent}90`,
                                    zIndex: 2,
                                }}
                            />
                            <div
                                ref={el => { labelRefs.current[i] = el; }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 pb-[6px] whitespace-nowrap text-center"
                            >
                                <span
                                    className="font-bold leading-tight text-[0.68rem] md:text-[clamp(0.58rem,0.85vw,0.7rem)]"
                                    style={{
                                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                        color: "white",
                                        textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)",
                                    }}
                                >
                                    {lm.label}
                                </span>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
            <div
                ref={cardFrameRef}
                className="absolute left-[6%] bottom-[12%] pointer-events-none overflow-hidden rounded-2xl"
                style={{
                    width: "clamp(230px, 28vw, 340px)",
                    zIndex: 40,
                    isolation: "isolate",
                    background: "rgba(2,10,24,0.85)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                }}
            >
                <div ref={cardTrackRef} className="flex w-full">
                    {LANDMARKS.map((lm) => (
                        <div
                            key={`film-card-${lm.id}`}
                            className="shrink-0 overflow-hidden rounded-2xl"
                            style={{
                                width: "100%",
                                boxShadow: `inset 0 0 0 1px ${lm.accent}55`,
                            }}
                        >
                            <div className="relative w-full overflow-hidden" style={{ height: 110 }}>
                                <Image
                                    src={lm.image}
                                    alt={lm.imageAlt}
                                    fill
                                    className="object-contain object-bottom"
                                    style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
                                    sizes="340px"
                                />
                            </div>

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
                                <p style={{ color: "rgba(255,255,255,0.84)", fontSize: "0.59rem", lineHeight: 1.4 }}>
                                    {lm.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                ref={ferryRef}
                className="absolute bottom-[7%] right-0 w-[36%] sm:w-[28%] max-w-[460px] pointer-events-none"
                style={{ zIndex: 10 }}
            >
                <Image
                    src={`${CDN}/feribot-yatay.webp`}
                    alt="Istanbul ferry"
                    width={920}
                    height={360}
                    className="relative z-0 w-full h-auto opacity-55"
                    style={{ transform: "scaleX(-1)" }}
                    sizes="(max-width: 640px) 36vw, 460px"
                />
                <div
                    ref={marti1Ref}
                    className="absolute left-[44%] z-10 pointer-events-none"
                    style={{
                        top: "calc(2% + 39px)",
                        width: "clamp(42px, 15%, 92px)",
                        filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 1px rgba(255,255,255,0.4))",
                    }}
                >
                    <Image src={`${CDN}/marti-1.webp`} alt="" width={184} height={138} className="w-full h-auto" sizes="92px" />
                </div>
            </div>
            <div
                className="absolute bottom-[2%] left-1/2 -translate-x-1/2 pointer-events-none animate-scroll-cue"
                style={{ zIndex: 20 }}
            >
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" aria-hidden="true">
                    <rect x="10" y="0" width="4" height="20" rx="2" fill="rgba(255,255,255,0.25)" />
                    <path d="M4 20 L12 32 L20 20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <ul className="sr-only" aria-label="Istanbul landmarks">
                {LANDMARKS.map(lm => (
                    <li key={lm.id}>
                        <strong>{lm.label}</strong> {lm.sublabel}: {lm.description}
                    </li>
                ))}
            </ul>
        </section>
    );
}
