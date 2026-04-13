"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const PLAYLIST = [
    { genre: "Bosphorus Jazz", mood: "Slow morning", tracks: "12 tracks · 52 min", color: "#00aeef" },
    { genre: "Indie İstanbul", mood: "Afternoon wander", tracks: "18 tracks · 1h 10m", color: "#7ac143" },
    { genre: "Arabesk Nights", mood: "Late night Beyoğlu", tracks: "14 tracks · 58 min", color: "#f47b20" },
    { genre: "Electronic Karaköy", mood: "Club energy", tracks: "10 tracks · 1h 2m", color: "#ec008c" },
];

export default function PlaylistSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

        makeReveal(headRef.current);
        itemRefs.current.forEach((el, i) => makeReveal(el, i * 0.1));
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative px-6 py-16"
            style={{ background: "linear-gradient(to bottom, #1a1d5c, #13165a, #1a1d5c)" }}
        >
            <div className="max-w-[1100px] mx-auto">
                <div ref={headRef} className="text-center mb-10 opacity-0">
                    <h2
                        className="font-bold text-white leading-tight"
                        style={{
                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
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
                            ref={el => { itemRefs.current[i] = el; }}
                            className="opacity-0 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                            style={{
                                background: `linear-gradient(135deg, ${p.color}18 0%, rgba(0,0,0,0.3) 100%)`,
                                border: `1px solid ${p.color}30`,
                                minHeight: "140px",
                            }}
                        >
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
    );
}
