"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const QUIZ_QUESTIONS = [
    {
        q: "Your ideal Saturday morning?",
        options: [
            { label: "Old mosque, fresh simit, total silence.", districts: ["Sultanahmet"] },
            { label: "Vinyl record hunting and a flat white.", districts: ["Karaköy", "Cihangir"] },
            { label: "Waterfront run, then the farmer's market.", districts: ["Kadıköy"] },
            { label: "Sleep until noon, then brunch with the whole crew.", districts: ["Beşiktaş", "Nişantaşı"] },
        ],
    },
    {
        q: "Pick your vibe after midnight.",
        options: [
            { label: "Rakı and live mey music at a meyhane.", districts: ["Beyoğlu"] },
            { label: "Bar-hopping on a street that never closes.", districts: ["Kadıköy"] },
            { label: "Underground club with a Bosphorus view.", districts: ["Karaköy"] },
            { label: "Tea and backgammon at a gecekondu café.", districts: ["Üsküdar", "Sultanahmet"] },
        ],
    },
    {
        q: "Your university crowd?",
        options: [
            { label: "Historians and architects.", districts: ["Sultanahmet", "Fatih"] },
            { label: "Artists, musicians and self-described bohemians.", districts: ["Cihangir", "Beyoğlu"] },
            { label: "Startup founders and digital nomads.", districts: ["Beşiktaş", "Nişantaşı"] },
            { label: "Local activists and food critics.", districts: ["Kadıköy"] },
        ],
    },
];

const DISTRICT_PROFILES: Record<string, { label: string; tagline: string; accent: string }> = {
    Sultanahmet: { label: "Sultanahmet", tagline: "History is your home. You feel the weight of centuries and find it comforting.", accent: "#f47b20" },
    Kadıköy: { label: "Kadıköy", tagline: "You are the Asian soul of this city creative, restless and fiercely local.", accent: "#7ac143" },
    Beyoğlu: { label: "Beyoğlu", tagline: "Midnight is your timezone. You belong to the neon and the meyhane tables.", accent: "#ec008c" },
    Beşiktaş: { label: "Beşiktaş", tagline: "You want modern comfort with a view. Ambitious, social and well-dressed.", accent: "#2e3192" },
    Karaköy: { label: "Karaköy", tagline: "Art, design and a good espresso are non-negotiable for you.", accent: "#00aeef" },
    Cihangir: { label: "Cihangir", tagline: "Literary, slightly melancholic, in love with cat-filled courtyards.", accent: "#00aeef" },
    Nişantaşı: { label: "Nişantaşı", tagline: "Chic, cosmopolitan Istanbul's European heartbeat.", accent: "#7ac143" },
    Üsküdar: { label: "Üsküdar", tagline: "Contemplative and traditional. You feel most at home by the water at dusk.", accent: "#f47b20" },
    Fatih: { label: "Fatih", tagline: "You seek authenticity above all. The unvarnished city is where you belong.", accent: "#f47b20" },
};

export default function DistrictQuiz() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const [quizStep, setQuizStep] = useState(0);
    const [votes, setVotes] = useState<Record<string, number>>({});
    const [quizDone, setQuizDone] = useState(false);

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
        if (!wrapRef.current) return;
        gsap.fromTo(wrapRef.current,
            { opacity: 0, y: 35 },
            {
                opacity: 1, y: 0, duration: 0.85, ease: "power2.out",
                scrollTrigger: { trigger: wrapRef.current, start: "top 80%", once: true },
            },
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-10 px-6 py-20 max-w-[700px] mx-auto">
            <div className="pointer-events-none absolute -top-2 left-0 sm:left-2 w-[26%] max-w-[120px] z-0 opacity-90" aria-hidden>
                <Image src={`${CDN}/kedi-1.webp`} alt="" width={240} height={180} className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]" sizes="120px" />
            </div>
            <div className="pointer-events-none absolute bottom-16 right-0 sm:right-4 w-[24%] max-w-[115px] z-0 opacity-90 hidden sm:block" aria-hidden>
                <Image src={`${CDN}/turk-kahvesi-1.webp`} alt="" width={230} height={230} className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] rounded-full" sizes="115px" />
            </div>
            <div ref={wrapRef} className="opacity-0 relative z-10">
                <div className="text-center mb-10">
                    <h2
                        className="font-bold text-white leading-tight"
                        style={{
                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                            fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                        }}
                    >
                        Which Istanbul District<br />Are You?
                    </h2>
                </div>
                {!quizDone ? (
                    <div
                        className="rounded-2xl p-8 flex flex-col box-border min-h-106 sm:min-h-112 md:min-h-120"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(236,0,140,0.2)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <div className="flex gap-2 mb-6 justify-center shrink-0">
                            {QUIZ_QUESTIONS.map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 rounded-full transition-all duration-300"
                                    style={{ background: i <= quizStep ? "#ec008c" : "rgba(255,255,255,0.15)" }}
                                />
                            ))}
                        </div>

                        <p className="text-white font-semibold text-center mb-6 shrink-0" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
                            {QUIZ_QUESTIONS[quizStep].q}
                        </p>

                        <div className="flex flex-col gap-3 flex-1">
                            {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt.districts)}
                                    className="text-left rounded-xl px-5 py-4 text-white/70 transition-all duration-200 hover:text-white"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        fontSize: "0.85rem",
                                        lineHeight: "1.4",
                                        cursor: "pointer",
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
                    <div
                        className="rounded-2xl p-8 text-center flex flex-col justify-center box-border min-h-106 sm:min-h-112 md:min-h-120"
                        style={{
                            background: `linear-gradient(135deg, ${DISTRICT_PROFILES[topDistrict].accent}18 0%, rgba(0,0,0,0.4) 100%)`,
                            border: `1px solid ${DISTRICT_PROFILES[topDistrict].accent}40`,
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <h3
                            className="font-bold text-white mb-4"
                            style={{
                                fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                color: DISTRICT_PROFILES[topDistrict].accent,
                            }}
                        >
                            {DISTRICT_PROFILES[topDistrict].label}
                        </h3>
                        <p className="text-white/70 leading-relaxed mb-6 max-w-[420px] mx-auto" style={{ fontSize: "0.88rem" }}>
                            {DISTRICT_PROFILES[topDistrict].tagline}
                        </p>
                        <button
                            type="button"
                            onClick={() => { setQuizStep(0); setVotes({}); setQuizDone(false); }}
                            className="mx-auto inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-[0.72rem] font-medium tracking-[0.2em] uppercase text-white/90 transition-[color,background-color,border-color,box-shadow] duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                            style={{
                                borderColor: `${DISTRICT_PROFILES[topDistrict].accent}55`,
                                backgroundColor: "rgba(255,255,255,0.06)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
                            }}
                            onMouseEnter={e => {
                                const a = DISTRICT_PROFILES[topDistrict].accent;
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${a}14`;
                                (e.currentTarget as HTMLButtonElement).style.borderColor = `${a}80`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = `${DISTRICT_PROFILES[topDistrict].accent}55`;
                            }}
                        >
                            Try again
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
