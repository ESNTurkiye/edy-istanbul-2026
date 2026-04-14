"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiteratureStrip from "./LiteratureStrip";
import { CDN, INFO_CARDS } from "./prideData";
import styles from "./Pride.module.css";

const SKYLINE_CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const MONUMENTS = [
    { src: "ayasofya.webp",      alt: "Blue Mosque",     x: "50%", w: "72%", maxW: 860, zIndex: 2, yEntry: 160, delay: 0.12 },
    { src: "galata-kulesi.webp", alt: "Galata Tower",    x: "25%", w: "45%", maxW: 520, zIndex: 4, yEntry: 220, delay: 0 },
    { src: "kiz-kulesi-2.webp",  alt: "Maiden's Tower",  x: "78%", w: "38%", maxW: 460, zIndex: 3, yEntry: 185, delay: 0.2 },
] as const;

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Pride() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const skylineRef = useRef<HTMLDivElement>(null);
    const [skylineVisible, setSkylineVisible] = useState(false);
    const birdOneFrameRef = useRef<HTMLDivElement>(null);
    const birdTwoFrameRef = useRef<HTMLDivElement>(null);
    const birdOneImageRef = useRef<HTMLImageElement>(null);
    const birdTwoImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || isVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                setIsVisible(true);
                observer.disconnect();
            },
            { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        const wrap = skylineRef.current;
        if (!wrap || skylineVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                setSkylineVisible(true);
                observer.disconnect();
            },
            { threshold: 0.1 },
        );

        observer.observe(wrap);
        return () => observer.disconnect();
    }, [skylineVisible]);

    useGSAP(() => {
        if (!sectionRef.current || !birdOneFrameRef.current || !birdTwoFrameRef.current || !birdOneImageRef.current || !birdTwoImageRef.current) {
            return;
        }

        const hardEntryPortion = 0.15;

        gsap.set([birdOneFrameRef.current, birdTwoFrameRef.current], { autoAlpha: 0 });
        gsap.set(birdOneFrameRef.current, { xPercent: -460, y: 40 });
        gsap.set(birdTwoFrameRef.current, { xPercent: 460, y: 20 });

        gsap.set(birdOneImageRef.current, { scale: 0.62, rotation: -52 });
        gsap.set(birdTwoImageRef.current, { scaleX: -1, scale: 0.62, rotation: 48 });

        const entryTl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 90%",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
            },
        });

        entryTl
            .to(
                birdOneFrameRef.current,
                { autoAlpha: 1, xPercent: 0, y: 0, duration: hardEntryPortion, ease: "none" },
                0,
            )
            .to(
                birdTwoFrameRef.current,
                { autoAlpha: 1, xPercent: 200, y: 0, duration: hardEntryPortion, ease: "none" },
                0,
            )
            .to(
                birdOneImageRef.current,
                { scale: 1, rotation: 18, duration: hardEntryPortion, ease: "none" },
                0,
            )
            .to(
                birdTwoImageRef.current,
                { scale: 1, rotation: -18, duration: hardEntryPortion, ease: "none" },
                0,
            )
            .to(
                birdOneFrameRef.current,
                { xPercent: 140, y: -120, duration: 1 - hardEntryPortion, ease: "none" },
                hardEntryPortion,
            )
            .to(
                birdTwoFrameRef.current,
                { xPercent: -190, y: 195, duration: 1 - hardEntryPortion, ease: "none" },
                hardEntryPortion,
            )
            .to(
                birdOneImageRef.current,
                { scale: 1.08, rotation: 44, duration: 1 - hardEntryPortion, ease: "none" },
                hardEntryPortion,
            )
            .to(
                birdTwoImageRef.current,
                { scale: 1.05, rotation: -42, duration: 1 - hardEntryPortion, ease: "none" },
                hardEntryPortion,
            );

        const onImageLoad = () => ScrollTrigger.refresh();
        const birdImages = [birdOneImageRef.current, birdTwoImageRef.current];
        birdImages.forEach((img) => {
            if (img.complete) return;
            img.addEventListener("load", onImageLoad);
        });

        const refreshHandle = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
            birdImages.forEach((img) => {
                img.removeEventListener("load", onImageLoad);
            });
            cancelAnimationFrame(refreshHandle);
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Ambient warm glow from top */}
            <div className={styles.topGlow} />

            {/* Cistern background */}
            <div
                className={styles.cisternBackground}
                style={{ backgroundImage: `url(${CDN}/yerebatan-sarnici-yatay.webp)` }}
            />
            <div className={styles.cisternOverlay} />

            {/* Iznik tile accent — top-right corner */}
            {/* <div
                className={`${styles.tileAccent} ${styles.revealFade} ${isVisible ? styles.revealVisible : ""}`}
                style={{ "--reveal-delay": "0.3s" } as CSSProperties}
            >
                
                <img src={`${CDN}/mermer-deseni1.webp`} alt="" className={styles.tileImage} />
            </div> */}

            {/* Content */}
            <div className={styles.content}>

                {/* Headline */}
                <div
                    className={`${styles.headline} ${styles.revealUp} ${isVisible ? styles.revealVisible : ""}`}
                    style={{ "--reveal-delay": "0s" } as CSSProperties}
                >
                    <h2 className="font-brand font-bold leading-tight text-white text-[clamp(2rem,5vw,3.8rem)]">
                        Istanbul Isn&apos;t Just a City —<br />
                        <span className={styles.accentOrange}>It&apos;s a Civilisation</span>
                    </h2>
                    <p className={`${styles.subtitle} text-[clamp(0.8rem,1.3vw,1rem)] leading-relaxed`}>
                        Three empires called it home. One generation of Erasmus students is about to discover why.
                    </p>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-[1200px] mb-10">
                    {INFO_CARDS.map((card, i) => (
                        <div
                            key={card.title}
                            className={`${styles.infoCard} ${styles.revealCard} ${isVisible ? styles.revealVisible : ""}`}
                            style={{
                                "--card-accent": card.accent,
                                "--card-accent-18": `${card.accent}18`,
                                "--card-accent-30": `${card.accent}30`,
                                "--card-accent-60": `${card.accent}60`,
                                "--card-accent-70": `${card.accent}70`,
                                "--reveal-delay": `${0.12 + i * 0.13}s`,
                            } as CSSProperties}
                        >
                            <div className={styles.infoCardTopLine} />
                            <div className={styles.infoCardSymbol}>
                                {card.symbol}
                            </div>
                            <div className={styles.infoCardTag}>
                                {card.tag}
                            </div>
                            <h3 className="font-brand font-bold text-[#ffffff] text-[clamp(1.2rem,2.2vw,1.6rem)] leading-tight mb-2">
                       
                                {card.headline}
                            </h3>
                            <p className="text-[clamp(0.75rem,1.1vw,0.9rem)] leading-relaxed" style={{ color: "#e2e1db" }}>
                       
                       
                                {card.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

                {/* ── Seagull 1 — fixed position above Galata Tower, scroll-rotates ── */}
            <div ref={birdOneFrameRef} className={styles.birdOneFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={birdOneImageRef}
                    src={`${CDN}/marti-2.webp`}
                    alt=""
                    aria-hidden="true"
                    className={styles.birdImage}
                />
            </div>

            {/* ── Seagull 2 — fixed position above Kız Kulesi, scroll-rotates ── */}
            <div ref={birdTwoFrameRef} className={styles.birdTwoFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={birdTwoImageRef}
                    src={`${CDN}/marti-2.webp`}
                    alt=""
                    aria-hidden="true"
                    className={styles.birdImage}
                />
            </div>

            {/* Istanbul in Literature */}
            <LiteratureStrip />

            {/* Skyline */}
            <div ref={skylineRef}>
                <div className={styles.deepGroundGlow} />
                <div className={styles.midFog} />
                <div className={styles.groundFade} />
                <div className={styles.topFade} />
                {MONUMENTS.map((m) => (
                    <div
                        key={m.alt}
                        className={styles.monumentParallax}
                        style={{ left: m.x, width: m.w, maxWidth: m.maxW, zIndex: m.zIndex }}
                    >
                        <div className={styles.monumentAnchor}>
                            <div
                                className={`${styles.monumentEntry} ${skylineVisible ? styles.monumentEntryVisible : styles.monumentEntryHidden}`}
                                style={{
                                    "--entry-offset": `${m.yEntry}px`,
                                    "--entry-delay": `${m.delay}s`,
                                } as CSSProperties}
                            >
                                <div className={styles.monumentBaseGlow} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`${SKYLINE_CDN}/${m.src}`}
                                    alt={m.alt}
                                    className={styles.monumentImage}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
