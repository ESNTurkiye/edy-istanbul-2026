"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./Pride.module.css";

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
        yEntry: 220,
        yScroll: 210,  // shoots upward — close foreground
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
        yEntry: 185,
        yScroll: 170,  // fast — mid-foreground
        delay: 0.2,
        floatAmp: 9,
    },
] as const;

export default function SkylineReveal() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap || isVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                setIsVisible(true);
                observer.disconnect();
            },
            { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
        );

        observer.observe(wrap);
        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <div ref={wrapRef} className={styles.skylineWrap}>
            {/* ── Atmospheric deep-ground warm glow ─────────────────────── */}
            <div className={styles.deepGroundGlow} />

            {/* ── Mid-scene ambient orange fog layer ────────────────────── */}
            <div className={styles.midFog} />

            {/* ── Ground fog / section-bottom fade ─────────────────────── */}
            <div className={styles.groundFade} />

            {/* ── Top fade — blends with section above ─────────────────── */}
            <div className={styles.topFade} />

            {/* ── Monuments ─────────────────────────────────────────────── */}
            {MONUMENTS.map((m, i) => (
                <div
                    key={m.alt}
                    className={styles.monumentParallax}
                    style={{
                        left: m.x,
                        width: m.w,
                        maxWidth: m.maxW,
                        zIndex: m.zIndex,
                    }}
                >
                    <div className={styles.monumentAnchor}>
                        <div
                            className={`${styles.monumentEntry} ${isVisible ? styles.monumentEntryVisible : styles.monumentEntryHidden}`}
                            style={{
                                "--entry-offset": `${m.yEntry}px`,
                                "--entry-delay": `${m.delay}s`,
                            } as CSSProperties}
                        >
                            <div
                                className={`${styles.monumentFloat} ${isVisible ? styles.monumentFloatActive : ""}`}
                                style={{
                                    "--float-amp": `${m.floatAmp}px`,
                                    "--float-duration": `${4.5 + i * 0.65}s`,
                                    "--entry-delay": `${m.delay}s`,
                                } as CSSProperties}
                            >
                                {/* Per-monument base glow */}
                                <div className={styles.monumentBaseGlow} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`${CDN}/${m.src}`}
                                    alt={m.alt}
                                    className={`${styles.monumentImage} ${i === 1 && isVisible ? styles.galataPulse : ""}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}


        </div>
    );
}
