"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SkylineReveal from "./SkylineReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const INFO_CARDS = [
    {
        symbol: "II",
        title: "History",
        headline: "3\u00d7 World Capital",
        body: "Roman, Byzantine, Ottoman — Istanbul has been the beating heart of civilizations for 2,700 years. Every street is a chapter.",
        accent: "#f47b20",
        tag: "2,700 Years of Legacy",
    },
    {
        symbol: "III",
        title: "Gastronomy",
        headline: "UNESCO Creative City",
        body: "From street simit to Michelin-starred mezes — Istanbul feeds the soul. Budget-friendly or gourmet, every meal is an event.",
        accent: "#7ac143",
        tag: "Affordable & Incredible",
    },
    {
        symbol: "IV",
        title: "Belonging",
        headline: "Home to Everyone",
        body: "From the Syrian poet in Fatih to the Erasmus crew from Helsinki — every accent is already on this street. 80+ nationalities call our universities home.",
        accent: "#ec008c",
        tag: "80+ Nationalities",
    },
    {
        symbol: "I",
        title: "Accessibility",
        headline: "Hub of 3 Continents",
        body: "Direct flights to 300+ cities. The world's 6th busiest airport sits at the crossroads of Europe, Asia and the Middle East.",
        accent: "#00aeef",
        tag: "300+ Direct Connections",
    },
];

export default function Pride() {
    const sectionRef  = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const cardsRef    = useRef<(HTMLDivElement | null)[]>([]);
    const tileRef     = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const st = { trigger: sectionRef.current, start: "top 70%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(tileRef.current,     { opacity: 0 },        { opacity: 1, duration: 1, delay: 0.3, scrollTrigger: st });

        gsap.fromTo(
            cardsRef.current.filter(Boolean),
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 55%", once: true },
            },
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden"
            style={{ background: "#2a1200" }}
        >
            {/* Ambient warm glow from top */}
            <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "40%",
                    background: "radial-gradient(ellipse at 50% -20%, rgba(244,123,32,0.28) 0%, transparent 70%)",
                }}
            />

            {/* ── Cistern background ── */}
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage:    `url(${CDN}/yerebatan-sarnici-yatay.webp)`,
                    backgroundSize:     "cover",
                    backgroundPosition: "center",
                }}
            />
            {/* Dark vignette over cistern */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(42,18,0,0.88) 0%, rgba(42,18,0,0.65) 40%, rgba(42,18,0,0.82) 100%)" }} />

            {/* ── Iznik tile accent (top-right corner) ── */}
            <div
                ref={tileRef}
                className="absolute top-0 right-0 w-[25%] max-w-[300px] opacity-0 pointer-events-none"
                style={{ zIndex: 2, mixBlendMode: "screen" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/mermer-deseni1.webp`} alt="" className="w-full h-auto opacity-30" />
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col items-center w-full px-6 pt-16 pb-0">

                {/* Headline */}
                <div ref={headlineRef} className="text-center max-w-[700px] mb-12 opacity-0">
                    <h2 className="font-brand font-bold leading-tight text-white text-[clamp(2rem,5vw,3.8rem)]">
                        Istanbul Isn&apos;t Just a City —<br />
                        <span style={{ color: "#f47b20" }}>It&apos;s a Civilisation</span>
                    </h2>
                    <p className="mt-4 text-white/50 text-[clamp(0.8rem,1.3vw,1rem)] leading-relaxed">
                        Three empires called it home. One generation of Erasmus students is about to discover why.
                    </p>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-[1200px] mb-10">
                    {INFO_CARDS.map((card, i) => (
                        <div
                            key={card.title}
                            ref={el => { cardsRef.current[i] = el; }}
                            className="relative rounded-2xl p-6 overflow-hidden opacity-0"
                            style={{
                                background:  "rgba(255,255,255,0.04)",
                                border:      `1px solid ${card.accent}30`,
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            {/* Roman numeral accent */}
                            <div
                                className="font-bold mb-3 leading-none"
                                style={{
                                    fontFamily: "var(--font-kelson-sans), Georgia, serif",
                                    fontSize: "1.8rem",
                                    color: `${card.accent}70`,
                                }}
                            >
                                {card.symbol}
                            </div>
                            <div
                                className="inline-block text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full mb-3"
                                style={{ background: `${card.accent}18`, color: card.accent }}
                            >
                                {card.tag}
                            </div>
                            <h3 className="font-brand font-bold text-white text-[clamp(1.2rem,2.2vw,1.6rem)] leading-tight mb-2">
                                {card.headline}
                            </h3>
                            <p className="text-white/55 text-[clamp(0.75rem,1.1vw,0.9rem)] leading-relaxed">
                                {card.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Istanbul in Literature ── */}
            <LiteratureStrip />

            {/* ── Rising skyline ── */}
            <div className="relative z-10 w-full">
                <SkylineReveal />
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   Istanbul in Literature — inline sub-component
   ───────────────────────────────────────────────────────────────────────── */
const QUOTES = [
    {
        quote: "Istanbul does not belong to one civilisation; it is the place where civilisations have always met.",
        author: "Orhan Pamuk",
        work: "Istanbul: Memories and the City",
        accent: "#f47b20",
    },
    {
        quote: "There is not a city in the world where East and West are so strangely blended, where life is at once so Oriental and so European.",
        author: "Pierre Loti",
        work: "Aziyadé",
        accent: "#00aeef",
    },
    {
        quote: "Constantinople is all things to all men — it is impossible to live in it without loving it.",
        author: "Edmondo de Amicis",
        work: "Constantinople",
        accent: "#7ac143",
    },
];

function LiteratureStrip() {
    const stripRef = useRef<HTMLDivElement>(null);
    const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!stripRef.current) return;

        gsap.fromTo(
            quoteRefs.current.filter(Boolean),
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0,
                duration: 0.9,
                stagger: 0.25,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: stripRef.current,
                    start: "top 75%",
                    once: true,
                },
            },
        );
    }, { scope: stripRef });

    return (
        <div
            ref={stripRef}
            className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-12 mb-4"
        >
            <div className="text-center mb-8">
                <span style={{
                    display: "inline-block",
                    background: "rgba(244,123,32,0.14)",
                    color: "#f47b20",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                }}>
                    Istanbul in Literature
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {QUOTES.map((q, i) => (
                    <div
                        key={i}
                        ref={el => { quoteRefs.current[i] = el; }}
                        className="relative opacity-0 rounded-xl p-5"
                        style={{
                            background:     "rgba(255,255,255,0.03)",
                            border:         `1px solid ${q.accent}25`,
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        {/* Opening quote mark */}
                        <div
                            className="absolute top-3 left-4 leading-none select-none"
                            style={{
                                fontFamily: "Georgia, serif",
                                fontSize:   "3.5rem",
                                color:      `${q.accent}30`,
                                lineHeight: 1,
                            }}
                        >
                            &ldquo;
                        </div>
                        <p
                            className="text-white/70 leading-relaxed pt-5 mb-4"
                            style={{ fontSize: "clamp(0.78rem, 1vw, 0.88rem)" }}
                        >
                            {q.quote}
                        </p>
                        <div>
                            <div
                                className="font-semibold text-white"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                            >
                                {q.author}
                            </div>
                            <div
                                className="font-light italic"
                                style={{ fontSize: "0.62rem", color: q.accent, letterSpacing: "0.05em" }}
                            >
                                {q.work}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
