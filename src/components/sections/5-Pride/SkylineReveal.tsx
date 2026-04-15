"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

/**
 * Depth layers — back-to-front (ascending zIndex = closer to viewer).
 * yEntry:  how many px below final position the monument starts (rise-in)
 * yScroll: how many px the element moves UP while user scrolls through section
 *          — larger value = closer layer = more parallax movement
 * floatAmp: idle oscillation amplitude in px
 */
const MONUMENTS = [
    // Back layer — Blue Mosque, centred, barely moves (deep background anchor)
    {
        src: "ayasofya.webp",
        alt: "Blue Mosque",
        x: "50%",
        w: "72%",
        maxW: 860,
        zIndex: 2,
        bottom: "0%",
        yEntry: 160,
        yScroll: 18,   // almost stationary — far-background feel
        delay: 0.12,
        floatAmp: 5,
    },
    // Left foreground — Galata Tower, very fast parallax
    {
        src: "galata-kulesi.webp",
        alt: "Galata Tower",
        x: "25%",
        w: "45%",
        maxW: 520,
        zIndex: 4,
        bottom: "-11%",
        yEntry: 280,
        yScroll: 260,  // starts lower, then rises stronger on scroll
        delay: 0,
        floatAmp: 11,
    },
    // Right mid — Maiden's Tower, fast parallax
    {
        src: "kiz-kulesi-2.webp",
        alt: "Maiden's Tower",
        x: "78%",
        w: "38%",
        maxW: 460,
        zIndex: 3,
        bottom: "-9%",
        yEntry: 245,
        yScroll: 220,  // starts lower, then rises with scroll
        delay: 0.2,
        floatAmp: 9,
    },
] as const;

const TOWER_START_RAISE = 300;

export default function SkylineReveal() {
    const wrapRef = useRef<HTMLDivElement>(null);
    // Outer wrappers carry scroll-driven travel toward final positions.
    const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    // Inner wrappers carry opacity + local idle sway.
    const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
    const bird1Ref = useRef<HTMLImageElement>(null);
    const bird2Ref = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;

        // Keep wrappers horizontally centered without relying on CSS transform,
        // so scroll tweens can safely animate `y`.
        parallaxRefs.current.filter(Boolean).forEach((el) => {
            gsap.set(el, { xPercent: -50 });
        });

        const revealTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=60%",
            scrub: 0.5,
        };

        const towerScrollTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=480%",
            scrub: 0.6,
        };

        // ── Inner layer reveal + local sway (stays around local anchor) ──
        entryRefs.current.filter(Boolean).forEach((el, i) => {
            const m = MONUMENTS[i];
            gsap.fromTo(
                el,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: revealTrigger,
                },
            );

            gsap.to(el, {
                y: `-=${m.floatAmp}`,
                x: i % 2 === 0 ? "+=4" : "-=4",
                rotate: i % 2 === 0 ? 1.6 : -1.6,
                duration: 4.5 + i * 0.65,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        // ── Scroll travel: towers start lower, move up on scroll, keep moving ──
        parallaxRefs.current.filter(Boolean).forEach((el, i) => {
            if (i === 1 || i === 2) {
                gsap.fromTo(el,
                    { y: MONUMENTS[i].yEntry - TOWER_START_RAISE },
                    {
                        y: -400,
                        ease: "none",
                        scrollTrigger: towerScrollTrigger,
                    },
                );
                return;
            }

            // Keep a gentle deep-layer parallax for mosque.
            gsap.to(el, {
                y: -MONUMENTS[i].yScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.8,
                },
            });
        });

        // ── Galata Tower warm light pulse ──────────────────────────────────
        const galataImg = entryRefs.current[1]?.querySelector<HTMLImageElement>("img");
        if (galataImg) {
            gsap.fromTo(
                galataImg,
                { filter: "brightness(1) drop-shadow(0 24px 48px rgba(0,0,0,0.6))" },
                {
                    filter: "brightness(1.16) drop-shadow(0 24px 48px rgba(0,0,0,0.6))",
                    duration: 5.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: 2,
                },
            );
        }

        // ── Seagulls: fade in on entry, then rotate with scroll ───────────
        const birdScrollTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=480%",
            scrub: 0.6,
        };

        // Bird 1 — appears above Galata Tower area, banks nose-down on scroll
        if (bird1Ref.current) {
            // Entry fade-in
            gsap.fromTo(bird1Ref.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 0.9, scale: 1, ease: "none", scrollTrigger: revealTrigger },
            );
            // Scroll-driven bank: tilts from -18° (gliding up) → +22° (nosing down)
            gsap.fromTo(bird1Ref.current,
                { rotation: -18 },
                { rotation: 22, ease: "none", scrollTrigger: birdScrollTrigger },
            );

            // Starts far-left, reaches anchor, then continues route with scroll.
            gsap.fromTo(bird1Ref.current, {
                x: -260,
                y: 8,
            }, {
                x: 400,
                y: -24,
                ease: "none",
                scrollTrigger: birdScrollTrigger,
            });

            // Keep subtle local sway around its current path.
            gsap.to(bird1Ref.current, {
                xPercent: 6,
                yPercent: -6,
                rotate: 2.2,
                duration: 4.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

        // Bird 2 — appears above Kız Kulesi area, banks in opposite direction
        if (bird2Ref.current) {
            // Entry fade-in while preserving mirrored orientation.
            gsap.fromTo(bird2Ref.current,
                { opacity: 0, scaleX: -0.9, scaleY: 0.9 },
                { opacity: 0.7, scaleX: -1, scaleY: 1, ease: "none", scrollTrigger: revealTrigger },
            );
            // Scroll-driven bank: tilts from +15° → -20° (mirrored feel, opposite phase)
            gsap.fromTo(bird2Ref.current,
                { rotation: 15 },
                { rotation: -20, ease: "none", scrollTrigger: birdScrollTrigger },
            );

            // Starts far-right, reaches anchor, then continues route with scroll.
            gsap.fromTo(bird2Ref.current, {
                x: 260,
                y: -8,
            }, {
                x: -400,
                y: 18,
                ease: "none",
                scrollTrigger: birdScrollTrigger,
            });

            // Keep subtle local sway around its current path.
            gsap.to(bird2Ref.current, {
                xPercent: -6,
                yPercent: 6,
                rotate: -2.2,
                duration: 5.3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

    }, { scope: wrapRef });

    return (
        <div
            ref={wrapRef}
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(520px, 72vw, 900px)" }}
        >
            {/* ── Atmospheric deep-ground warm glow ─────────────────────── */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "70%",
                    background:
                        "radial-gradient(ellipse 110% 75% at 50% 105%, rgba(244,123,32,0.28) 0%, rgba(180,60,0,0.14) 38%, transparent 68%)",
                    zIndex: 1,
                }}
            />

            {/* ── Mid-scene ambient orange fog layer ────────────────────── */}
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                    bottom: "8%",
                    height: "35%",
                    background:
                        "radial-gradient(ellipse 80% 55% at 50% 100%, rgba(255,140,30,0.12) 0%, transparent 70%)",
                    filter: "blur(32px)",
                    zIndex: 1,
                }}
            />

            {/* ── Ground fog / section-bottom fade ─────────────────────── */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "30%",
                    background: "linear-gradient(to top, rgba(42,18,0,0.9) 0%, transparent 100%)",
                    zIndex: 9,
                }}
            />

            {/* ── Top fade — blends with section above ─────────────────── */}
            <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "22%",
                    background: "linear-gradient(to bottom, rgba(42,18,0,0.55) 0%, transparent 100%)",
                    zIndex: 9,
                }}
            />

            {/* ── Monuments ─────────────────────────────────────────────── */}
            {MONUMENTS.map((m, i) => (
                <div
                    key={m.alt}
                    ref={el => { parallaxRefs.current[i] = el; }}
                    className="absolute bottom-0 pointer-events-none"
                    style={{
                        left: m.x,
                        width: m.w,
                        maxWidth: m.maxW,
                        zIndex: m.zIndex,
                        bottom: m.bottom,
                        willChange: "transform",
                    }}
                >
                    <div
                        ref={el => { entryRefs.current[i] = el; }}
                        className="opacity-0"
                        style={{ willChange: "transform, opacity" }}
                    >
                        {/* Per-monument base glow */}
                        <div
                            className="absolute inset-x-0 bottom-0 pointer-events-none"
                            style={{
                                height: "45%",
                                background:
                                    "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(244,123,32,0.38) 0%, transparent 70%)",
                                filter: "blur(18px)",
                                zIndex: -1,
                            }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${CDN}/${m.src}`}
                            alt={m.alt}
                            className="relative w-full h-auto"
                            style={{
                                filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.65))",
                            }}
                        />
                    </div>
                </div>
            ))}

            {/* ── Seagull 1 — fixed position above Galata Tower, scroll-rotates ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={bird1Ref}
                src={`${CDN}/marti-2.webp`}
                alt=""
                aria-hidden="true"
                className="absolute pointer-events-none select-none"
                style={{
                    width: "clamp(58px, 7vw, 100px)",
                    top: "18%",
                    left: "22%",
                    zIndex: 7,
                    opacity: 0,
                    transformOrigin: "center center",
                }}
            />

            {/* ── Seagull 2 — fixed position above Kız Kulesi, scroll-rotates ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={bird2Ref}
                src={`${CDN}/marti-2.webp`}
                alt=""
                aria-hidden="true"
                className="absolute pointer-events-none select-none"
                style={{
                    width: "clamp(36px, 4vw, 62px)",
                    top: "28%",
                    left: "68%",
                    zIndex: 7,
                    opacity: 0,
                    transformOrigin: "center center",
                    transform: "scaleX(-1)",
                }}
            />
        </div>
    );
}
