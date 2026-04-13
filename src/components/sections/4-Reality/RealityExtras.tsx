"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ── Sport in Istanbul ─────────────────────────────────────────────────── */
const SPORTS = [
    { label: "Running",    detail: "The Bosphorus shore paths stretch for miles. Sunrise jogs with seagulls as pace-setters.",           icon: "RUN",  accent: "#7ac143" },
    { label: "Football",   detail: "Galatasaray, Fenerbahçe, Beşiktaş — the city has three top-flight clubs and a legendary derby.",      icon: "FOOT", accent: "#f47b20" },
    { label: "Hiking",     detail: "Belgrad Forest and the Princes' Islands offer trails within 30 minutes of the city centre.",           icon: "HIKE", accent: "#00aeef" },
    { label: "Swimming",   detail: "Black Sea beaches to the north, Marmara coves to the south — the city is surrounded by water.",       icon: "SWIM", accent: "#2e3192" },
    { label: "Cycling",    detail: "Dedicated bike lanes on Kadıköy's waterfront and the newly opened cycling routes along the Bosphorus.", icon: "BIKE", accent: "#ec008c" },
];

/* ── Istanbul Playlist ─────────────────────────────────────────────────── */
const PLAYLIST = [
    { genre: "Bosphorus Jazz",   mood: "Slow morning",     tracks: "12 tracks · 52 min",  color: "#00aeef" },
    { genre: "Indie İstanbul",   mood: "Afternoon wander",  tracks: "18 tracks · 1h 10m", color: "#7ac143" },
    { genre: "Arabesk Nights",   mood: "Late night Beyoğlu",tracks: "14 tracks · 58 min",  color: "#f47b20" },
    { genre: "Electronic Karaköy", mood: "Club energy",    tracks: "10 tracks · 1h 2m",  color: "#ec008c" },
];

/* ── 1 Day in Istanbul ─────────────────────────────────────────────────── */
const ONE_DAY = [
    { time: "07:30", label: "Sunrise simit",         note: "Grab a simit from a street cart and walk to Galata Bridge." },
    { time: "09:00", label: "Hagia Sophia",           note: "Beat the crowds. The morning light through the windows is otherworldly." },
    { time: "11:30", label: "Grand Bazaar wander",    note: "60 covered streets — get lost on purpose." },
    { time: "13:30", label: "Çay break",              note: "Find a rooftop terrace with views of the Golden Horn." },
    { time: "15:00", label: "Bosphorus ferry",        note: "Cross to the Asian side. Window seat mandatory." },
    { time: "17:00", label: "Kadıköy market",         note: "Fresh figs, olives and the city's best street food." },
    { time: "19:30", label: "Sunset at Kız Kulesi",   note: "The Maiden's Tower at dusk — photograph it from the waterfront." },
    { time: "21:00", label: "Beyoğlu dinner",         note: "Meyhane meze, rakı and strangers who become friends." },
];

/* ── 3 Days in Istanbul ─────────────────────────────────────────────────── */
const THREE_DAYS = [
    {
        day: "Day 1",
        title: "The Historic Peninsula",
        items: ["Topkapı Palace", "Sultanahmet Mosque", "Basilica Cistern", "Egyptian Bazaar", "Bosphorus sunset cruise"],
        accent: "#f47b20",
    },
    {
        day: "Day 2",
        title: "Beyoğlu & Modern İstanbul",
        items: ["İstiklal Avenue", "Galata Tower", "Pera Museum", "Çukurcuma antiques", "Karaköy bars & galleries"],
        accent: "#00aeef",
    },
    {
        day: "Day 3",
        title: "Asian Soul",
        items: ["Kadıköy breakfast", "Moda waterfront", "Haydarpaşa Station", "Princes' Island ferry", "Return via Bosphorus at dusk"],
        accent: "#ec008c",
    },
];

/* ── District Quiz ─────────────────────────────────────────────────────── */
const QUIZ_QUESTIONS = [
    {
        q: "Your ideal Saturday morning?",
        options: [
            { label: "Old mosque, fresh simit, total silence.",          districts: ["Sultanahmet"] },
            { label: "Vinyl record hunting and a flat white.",            districts: ["Karaköy", "Cihangir"] },
            { label: "Waterfront run, then the farmer's market.",         districts: ["Kadıköy"] },
            { label: "Sleep until noon, then brunch with the whole crew.", districts: ["Beşiktaş", "Nişantaşı"] },
        ],
    },
    {
        q: "Pick your vibe after midnight.",
        options: [
            { label: "Rakı and live mey music at a meyhane.",             districts: ["Beyoğlu"] },
            { label: "Bar-hopping on a street that never closes.",        districts: ["Kadıköy"] },
            { label: "Underground club with a Bosphorus view.",           districts: ["Karaköy"] },
            { label: "Tea and backgammon at a gecekondu café.",           districts: ["Üsküdar", "Sultanahmet"] },
        ],
    },
    {
        q: "Your university crowd?",
        options: [
            { label: "Historians and architects.",                         districts: ["Sultanahmet", "Fatih"] },
            { label: "Artists, musicians and self-described bohemians.",   districts: ["Cihangir", "Beyoğlu"] },
            { label: "Startup founders and digital nomads.",               districts: ["Beşiktaş", "Nişantaşı"] },
            { label: "Local activists and food critics.",                  districts: ["Kadıköy"] },
        ],
    },
];

const DISTRICT_PROFILES: Record<string, { label: string; tagline: string; accent: string }> = {
    Sultanahmet:  { label: "Sultanahmet",  tagline: "History is your home. You feel the weight of centuries and find it comforting.", accent: "#f47b20" },
    Kadıköy:      { label: "Kadıköy",      tagline: "You are the Asian soul of this city — creative, restless and fiercely local.",   accent: "#7ac143" },
    Beyoğlu:      { label: "Beyoğlu",      tagline: "Midnight is your timezone. You belong to the neon and the meyhane tables.",       accent: "#ec008c" },
    Beşiktaş:     { label: "Beşiktaş",     tagline: "You want modern comfort with a view. Ambitious, social and well-dressed.",        accent: "#2e3192" },
    Karaköy:      { label: "Karaköy",      tagline: "Art, design and a good espresso are non-negotiable for you.",                    accent: "#00aeef" },
    Cihangir:     { label: "Cihangir",     tagline: "Literary, slightly melancholic, in love with cat-filled courtyards.",             accent: "#00aeef" },
    Nişantaşı:    { label: "Nişantaşı",    tagline: "Chic, cosmopolitan — Istanbul's European heartbeat.",                            accent: "#7ac143" },
    Üsküdar:      { label: "Üsküdar",      tagline: "Contemplative and traditional. You feel most at home by the water at dusk.",     accent: "#f47b20" },
    Fatih:        { label: "Fatih",        tagline: "You seek authenticity above all. The unvarnished city is where you belong.",     accent: "#f47b20" },
};

export default function RealityExtras() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sportHeadRef = useRef<HTMLDivElement>(null);
    const sportItemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const playHeadRef  = useRef<HTMLDivElement>(null);
    const playItemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const oneDayRef    = useRef<HTMLDivElement>(null);
    const threeDayRef  = useRef<HTMLDivElement>(null);
    const quizRef      = useRef<HTMLDivElement>(null);

    // Quiz state
    const [quizStep, setQuizStep]       = useState(0);
    const [votes, setVotes]             = useState<Record<string, number>>({});
    const [quizDone, setQuizDone]       = useState(false);

    const handleAnswer = (districts: string[]) => {
        const next = { ...votes };
        districts.forEach(d => { next[d] = (next[d] ?? 0) + 1; });
        setVotes(next);
        if (quizStep + 1 >= QUIZ_QUESTIONS.length) {
            setQuizDone(true);
        } else {
            setQuizStep(quizStep + 1);
        }
    };

    const topDistrict = quizDone
        ? Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Kadıköy"
        : null;

    useGSAP(() => {
        const makeReveal = (el: Element | null, delay = 0) => {
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0, y: 35 },
                {
                    opacity: 1, y: 0, duration: 0.85, ease: "power2.out", delay,
                    scrollTrigger: { trigger: el, start: "top 80%", once: true },
                },
            );
        };

        makeReveal(sportHeadRef.current);
        sportItemRefs.current.forEach((el, i) => makeReveal(el, i * 0.07));
        makeReveal(playHeadRef.current);
        playItemRefs.current.forEach((el, i) => makeReveal(el, i * 0.1));
        makeReveal(oneDayRef.current);
        makeReveal(threeDayRef.current, 0.1);
        makeReveal(quizRef.current);
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ background: "#1a1d5c" }}
        >
            {/* ── Kahve cutout — bottom right decoration ─────────────────── */}
            <div className="absolute bottom-0 right-[4%] w-[14%] max-w-[220px] pointer-events-none" style={{ zIndex: 1, opacity: 0.65 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul/turk-kahvesi-2.webp`}
                    alt="Turkish coffee"
                    className="w-full h-auto"
                    style={{ filter: "drop-shadow(0 -8px 24px rgba(0,0,0,0.45))" }}
                />
            </div>

            {/* ── SPORT IN ISTANBUL ─────────────────────────────────────── */}
            <div className="relative z-10 px-6 py-20 max-w-[1100px] mx-auto">
                <div ref={sportHeadRef} className="text-center mb-12 opacity-0">
                    <h2
                        className="font-bold text-white leading-tight"
                        style={{
                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                            fontSize:   "clamp(1.8rem, 4vw, 3rem)",
                        }}
                    >
                        Sport in Istanbul
                    </h2>
                    <p className="mt-3 text-white/45 max-w-[480px] mx-auto leading-relaxed" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.92rem)" }}>
                        A city of 15 million that never stops moving. Find your pace.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SPORTS.map((s, i) => (
                        <div
                            key={s.label}
                            ref={el => { sportItemRefs.current[i] = el; }}
                            className="opacity-0 rounded-xl p-5 flex gap-4 items-start transition-all duration-300 hover:-translate-y-1"
                            style={{
                                background:     "rgba(255,255,255,0.05)",
                                border:         "1.5px solid rgba(46,49,146,0.5)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div>
                                <h3
                                    className="text-white font-bold mb-1"
                                    style={{ fontFamily: "var(--font-kelson-sans), Arial, sans-serif", fontSize: "1rem" }}
                                >
                                    {s.label}
                                </h3>
                                <p className="text-white/50 leading-snug" style={{ fontSize: "0.78rem" }}>
                                    {s.detail}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── ISTANBUL PLAYLIST ─────────────────────────────────────── */}
            <div
                className="relative px-6 py-16"
                style={{ background: "linear-gradient(to bottom, #1a1d5c, #13165a, #1a1d5c)" }}
            >
                <div className="max-w-[1100px] mx-auto">
                    <div ref={playHeadRef} className="text-center mb-10 opacity-0">
                        <h2
                            className="font-bold text-white leading-tight"
                            style={{
                                fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                fontSize:   "clamp(1.8rem, 4vw, 3rem)",
                            }}
                        >
                            Istanbul Playlist
                        </h2>
                        <p className="mt-3 text-white/45 max-w-[440px] mx-auto leading-relaxed" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.92rem)" }}>
                            Every district has its own soundtrack. What will yours be?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PLAYLIST.map((p, i) => (
                            <div
                                key={p.genre}
                                ref={el => { playItemRefs.current[i] = el; }}
                                className="opacity-0 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    background:  `linear-gradient(135deg, ${p.color}18 0%, rgba(0,0,0,0.3) 100%)`,
                                    border:      `1px solid ${p.color}30`,
                                    minHeight:   "140px",
                                }}
                            >
                                {/* Play symbol */}
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
                                    style={{ background: `${p.color}22`, border: `1px solid ${p.color}40` }}
                                >
                                    <svg width="10" height="12" viewBox="0 0 10 12" fill={p.color}>
                                        <path d="M0 0L10 6L0 12V0Z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-white font-bold mb-0.5" style={{ fontFamily: "var(--font-kelson-sans), Arial, sans-serif", fontSize: "0.95rem" }}>
                                        {p.genre}
                                    </div>
                                    <div className="text-white/45 mb-1" style={{ fontSize: "0.68rem" }}>{p.mood}</div>
                                    <div style={{ color: p.color, fontSize: "0.62rem", letterSpacing: "0.05em" }}>{p.tracks}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-white/20 mt-4" style={{ fontSize: "0.62rem", letterSpacing: "0.12em" }}>
                        Full playlists available on Spotify and Apple Music
                    </p>
                </div>
            </div>

            {/* ── 1 DAY IN ISTANBUL ─────────────────────────────────────── */}
            <div className="relative z-10 px-6 py-20 max-w-[900px] mx-auto">
                <div ref={oneDayRef} className="opacity-0">
                    <div className="text-center mb-12">
                        <h2
                            className="font-bold text-white leading-tight"
                            style={{
                                fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                fontSize:   "clamp(1.8rem, 4vw, 3rem)",
                            }}
                        >
                            One Day in Istanbul
                        </h2>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div
                            className="absolute left-[52px] sm:left-[64px] top-0 bottom-0 w-px"
                            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,174,239,0.3) 10%, rgba(0,174,239,0.3) 90%, transparent)" }}
                        />

                        <div className="flex flex-col gap-6">
                            {ONE_DAY.map((item, i) => (
                                <div key={i} className="flex gap-4 sm:gap-6 items-start">
                                    <div
                                        className="shrink-0 font-bold text-right"
                                        style={{ width: "44px", color: "#00aeef", fontSize: "0.68rem", paddingTop: "2px" }}
                                    >
                                        {item.time}
                                    </div>
                                    {/* Dot on timeline */}
                                    <div
                                        className="shrink-0 w-3 h-3 rounded-full mt-[3px]"
                                        style={{ background: "#00aeef", boxShadow: "0 0 8px 3px rgba(0,174,239,0.4)" }}
                                    />
                                    <div>
                                        <div
                                            className="text-white font-semibold mb-0.5"
                                            style={{ fontFamily: "var(--font-kelson-sans), Arial, sans-serif", fontSize: "0.95rem" }}
                                        >
                                            {item.label}
                                        </div>
                                        <div className="text-white/45 leading-snug" style={{ fontSize: "0.78rem" }}>
                                            {item.note}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3 DAYS IN ISTANBUL ────────────────────────────────────── */}
            <div
                className="relative px-6 py-16"
                style={{ background: "linear-gradient(to bottom, #1a1d5c, #12154a)" }}
            >
                <div ref={threeDayRef} className="max-w-[1100px] mx-auto opacity-0">
                    <div className="text-center mb-12">
                        <h2
                            className="font-bold text-white leading-tight"
                            style={{
                                fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                fontSize:   "clamp(1.8rem, 4vw, 3rem)",
                            }}
                        >
                            3 Days in Istanbul
                        </h2>
                        <p className="mt-3 text-white/45 max-w-[440px] mx-auto" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.92rem)" }}>
                            Three days. Three personalities. One city that still won&apos;t feel finished.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {THREE_DAYS.map((day) => (
                            <div
                                key={day.day}
                                className="rounded-2xl p-6"
                                style={{
                                    background:     "rgba(255,255,255,0.05)",
                                    border:         `1px solid ${day.accent}30`,
                                    backdropFilter: "blur(6px)",
                                }}
                            >
                                <div
                                    className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase mb-2"
                                    style={{ color: day.accent }}
                                >
                                    {day.day}
                                </div>
                                <h3
                                    className="text-white font-bold mb-4 leading-tight"
                                    style={{
                                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                        fontSize:   "1.05rem",
                                    }}
                                >
                                    {day.title}
                                </h3>
                                <ul className="flex flex-col gap-2">
                                    {day.items.map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-white/55" style={{ fontSize: "0.8rem" }}>
                                            <span
                                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{ background: day.accent }}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── DISTRICT QUIZ ─────────────────────────────────────────── */}
            <div className="relative z-10 px-6 py-20 max-w-[700px] mx-auto">
                <div ref={quizRef} className="opacity-0">
                    <div className="text-center mb-10">
                        <h2
                            className="font-bold text-white leading-tight"
                            style={{
                                fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                fontSize:   "clamp(1.6rem, 3.5vw, 2.6rem)",
                            }}
                        >
                            Which Istanbul District<br />Are You?
                        </h2>
                    </div>

                    {!quizDone ? (
                        <div
                            className="rounded-2xl p-8"
                            style={{
                                background:     "rgba(255,255,255,0.04)",
                                border:         "1px solid rgba(236,0,140,0.2)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            {/* Progress dots */}
                            <div className="flex gap-2 mb-6 justify-center">
                                {QUIZ_QUESTIONS.map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full transition-all duration-300"
                                        style={{ background: i <= quizStep ? "#ec008c" : "rgba(255,255,255,0.15)" }}
                                    />
                                ))}
                            </div>

                            <p className="text-white font-semibold text-center mb-6" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
                                {QUIZ_QUESTIONS[quizStep].q}
                            </p>

                            <div className="flex flex-col gap-3">
                                {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt.districts)}
                                        className="text-left rounded-xl px-5 py-4 text-white/70 transition-all duration-200 hover:text-white"
                                        style={{
                                            background:   "rgba(255,255,255,0.05)",
                                            border:       "1px solid rgba(255,255,255,0.1)",
                                            fontSize:     "0.85rem",
                                            lineHeight:   "1.4",
                                            cursor:       "pointer",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(236,0,140,0.12)";
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(236,0,140,0.35)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : topDistrict && DISTRICT_PROFILES[topDistrict] ? (
                        /* Result card */
                        <div
                            className="rounded-2xl p-8 text-center"
                            style={{
                                background:     `linear-gradient(135deg, ${DISTRICT_PROFILES[topDistrict].accent}18 0%, rgba(0,0,0,0.4) 100%)`,
                                border:         `1px solid ${DISTRICT_PROFILES[topDistrict].accent}40`,
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <p className="text-white/50 tracking-[0.2em] uppercase mb-3" style={{ fontSize: "0.65rem" }}>
                                Your Istanbul district
                            </p>
                            <h3
                                className="font-bold text-white mb-4"
                                style={{
                                    fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                    fontSize:   "clamp(2rem, 5vw, 3rem)",
                                    color:      DISTRICT_PROFILES[topDistrict].accent,
                                }}
                            >
                                {DISTRICT_PROFILES[topDistrict].label}
                            </h3>
                            <p className="text-white/70 leading-relaxed mb-6 max-w-[420px] mx-auto" style={{ fontSize: "0.88rem" }}>
                                {DISTRICT_PROFILES[topDistrict].tagline}
                            </p>
                            <button
                                onClick={() => { setQuizStep(0); setVotes({}); setQuizDone(false); }}
                                className="text-white/50 hover:text-white transition-colors text-[0.7rem] tracking-widest uppercase"
                            >
                                Try again
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
