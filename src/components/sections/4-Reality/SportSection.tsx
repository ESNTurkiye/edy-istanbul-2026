"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const SPORTS = [
    { label: "Running", detail: "The Bosphorus shore paths stretch for miles. Sunrise jogs with seagulls as pace-setters.", accent: "#7ac143" },
    { label: "Football", detail: "Galatasaray, Fenerbahçe, Beşiktaş the city has three top-flight clubs and a legendary derby.", accent: "#f47b20" },
    { label: "Hiking", detail: "Belgrad Forest and the Princes' Islands offer trails within 30 minutes of the city centre.", accent: "#00aeef" },
    { label: "Swimming", detail: "Black Sea beaches to the north, Marmara coves to the south the city is surrounded by water.", accent: "#2e3192" },
    { label: "Cycling", detail: "Dedicated bike lanes on Kadıköy's waterfront and the newly opened cycling routes along the Bosphorus.", accent: "#ec008c" },
];

export default function SportSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const makeReveal = (el: Element | null, delay = 0) => {
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0 },
                {
                    opacity: 1, duration: 0.85, ease: "power2.out", delay,
                    scrollTrigger: { trigger: el, start: "top 80%", once: true },
                },
            );
        };

        makeReveal(headRef.current);
        itemRefs.current.forEach((el, i) => makeReveal(el, i * 0.07));
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-10 px-6 py-20 max-w-[1100px] mx-auto">
            {/* Decorative kept in margins so cards stay readable (no backdrop blur) */}
            <div
                className="pointer-events-none absolute top-0 right-6 w-[26%] max-w-[168px] opacity-90 z-0 hidden sm:block"
                aria-hidden
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/taksim-tramvay.webp`} alt="" className="w-full h-auto drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)]" loading="lazy" decoding="async" />
            </div>
            <div
                className="pointer-events-none absolute top-30 left-0 w-[16%] max-w-[88px] opacity-90 z-0 md:block hidden"
                aria-hidden
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/kedi-2.webp`} alt="" className="w-full h-auto drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]" loading="lazy" decoding="async" />
            </div>

            <div ref={headRef} className="text-center mb-12 opacity-0 relative z-10">
                <h2
                    className="font-bold text-white leading-tight"
                    style={{
                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                        fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    }}
                >
                    Sport in Istanbul
                </h2>
                <p className="mt-3 text-white/45 max-w-[480px] mx-auto leading-relaxed" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.92rem)" }}>
                    A city of 15 million that never stops moving. Find your pace.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {SPORTS.map((s, i) => (
                    <div
                        key={s.label}
                        ref={el => { itemRefs.current[i] = el; }}
                        className="opacity-0 rounded-xl p-5 flex gap-4 items-start transition-colors duration-300 hover:border-[rgba(0,174,239,0.45)]"
                        style={{
                            background: "rgba(14, 26, 58, 0.94)",
                            border: "1.5px solid rgba(46,49,146,0.55)",
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
    );
}
