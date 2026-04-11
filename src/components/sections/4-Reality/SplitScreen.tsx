"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

/* ── Data panels ───────────────────────────────── */
const DAY_STATS = [
    { label: "Avg. Monthly Cost",    value: "€ 400",  note: "among Europe's most affordable" },
    { label: "World University Rank",value: "Top 500", note: "4 universities in global rankings" },
    { label: "Erasmus Host Rating",  value: "4.8 / 5", note: "student-rated destination" },
];

const NIGHT_STATS = [
    { label: "Student Districts",    value: "7+",     note: "Kadıköy, Beyoğlu, Beşiktaş…" },
    { label: "Cultural Events / yr", value: "1,200+", note: "festivals, concerts & exhibitions" },
    { label: "Nights to Remember",   value: "∞",      note: "Istanbul never sleeps" },
];

export default function SplitScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRef      = useRef<HTMLDivElement>(null);
    const rightRef     = useRef<HTMLDivElement>(null);
    const dividerRef   = useRef<HTMLDivElement>(null);
    const leftTagRef   = useRef<HTMLDivElement>(null);
    const rightTagRef  = useRef<HTMLDivElement>(null);

    /* Day side image refs */
    const simitRef   = useRef<HTMLDivElement>(null);
    const catDayRef  = useRef<HTMLDivElement>(null);
    const cay1Ref    = useRef<HTMLDivElement>(null);

    /* Night side image refs */
    const burgerRef  = useRef<HTMLDivElement>(null);
    const catNightRef = useRef<HTMLDivElement>(null);
    const coffeeRef  = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const st = {
            trigger: containerRef.current,
            start:   "top 75%",
            once:    true,
        };

        // Panel slides in from sides
        gsap.fromTo(leftRef.current,    { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1,   ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(rightRef.current,   { x:  60, opacity: 0 }, { x: 0, opacity: 1, duration: 1,   ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(dividerRef.current, { scaleY: 0 },           { scaleY: 1, duration: 0.8, delay: 0.2, ease: "power2.out", transformOrigin: "top center", scrollTrigger: st });

        // Labels
        gsap.fromTo(leftTagRef.current,  { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(rightTagRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: "power2.out", scrollTrigger: st });

        // Day-side images: staggered float-up
        const dayItems  = [simitRef.current, catDayRef.current, cay1Ref.current].filter(Boolean);
        const nightItems = [burgerRef.current, catNightRef.current, coffeeRef.current].filter(Boolean);

        gsap.fromTo(dayItems,   { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out", scrollTrigger: { ...st, start: "top 70%" } });
        gsap.fromTo(nightItems, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, delay: 0.2, ease: "power2.out", scrollTrigger: { ...st, start: "top 70%" } });

        // Idle float on food items
        gsap.to(simitRef.current,  { y: "+=8", duration: 3,   repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(catDayRef.current,  { y: "-=6", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
        gsap.to(burgerRef.current, { y: "+=7", duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });
        gsap.to(catNightRef.current,{ y: "-=9", duration: 4,   repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full flex flex-col md:flex-row min-h-screen overflow-hidden">

            {/* ── LEFT: Day / Academic ───────────────────────────── */}
            <div
                ref={leftRef}
                className="relative w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[50vh] md:min-h-screen"
                style={{ background: "linear-gradient(145deg, #0D2240 0%, #112C50 60%, #0A1832 100%)" }}
            >
                {/* Day label */}
                <div ref={leftTagRef} className="mb-8 opacity-0">
                    <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.7rem] tracking-widest uppercase font-semibold"
                        style={{ background: "rgba(0,166,239,0.15)", color: "#00a6ef", border: "1px solid rgba(0,166,239,0.3)" }}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#00a6ef] inline-block" />
                        Daytime Istanbul
                    </span>
                    <h3 className="font-brand font-bold text-white text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight">
                        Where Knowledge<br />Meets Culture
                    </h3>
                </div>

                {/* Day stats */}
                <div className="flex flex-col gap-4 mb-8 w-full max-w-[360px]">
                    {DAY_STATS.map(s => (
                        <div key={s.label} className="flex items-baseline gap-3">
                            <span className="font-brand font-bold text-[clamp(1.4rem,2.8vw,2rem)] leading-none" style={{ color: "#7ac143" }}>
                                {s.value}
                            </span>
                            <div>
                                <div className="text-white/80 text-[0.8rem] font-semibold">{s.label}</div>
                                <div className="text-white/40 text-[0.7rem]">{s.note}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating assets */}
                <div ref={simitRef} className="absolute bottom-[10%] right-[5%] w-[22%] max-w-[180px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/Simit-1.webp`} alt="Simit" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={catDayRef} className="absolute top-[10%] right-[8%] w-[18%] max-w-[140px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/kedi-1.webp`} alt="Istanbul cat" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={cay1Ref} className="absolute bottom-[18%] left-[4%] w-[14%] max-w-[110px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/cay-1.jpg`} alt="Turkish tea" className="w-full h-auto drop-shadow-2xl rounded-full" />
                </div>
            </div>

            {/* ── CENTER DIVIDER ── */}
            <div
                ref={dividerRef}
                className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-20"
                style={{
                    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.12), transparent)",
                    transformOrigin: "top center",
                }}
            />

            {/* ── RIGHT: Night / Social ──────────────────────────── */}
            <div
                ref={rightRef}
                className="relative w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[50vh] md:min-h-screen overflow-hidden"
                style={{ background: "#080608" }}
            >
                {/* Bridge night photo as background */}
                <div
                    className="absolute inset-0 opacity-35"
                    style={{
                        backgroundImage:    `url(${CDN}/bogaz-koprusu-2.webp)`,
                        backgroundSize:     "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,6,8,0.85) 0%, rgba(8,6,8,0.55) 100%)" }} />

                {/* Night label */}
                <div ref={rightTagRef} className="relative z-10 mb-8 opacity-0">
                    <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.7rem] tracking-widest uppercase font-semibold"
                        style={{ background: "rgba(244,123,32,0.15)", color: "#f47b20", border: "1px solid rgba(244,123,32,0.3)" }}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#f47b20] inline-block animate-pulse" />
                        Nightlife &amp; Culture
                    </span>
                    <h3 className="font-brand font-bold text-white text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight">
                        Where Friendships<br />Begin
                    </h3>
                </div>

                {/* Night stats */}
                <div className="relative z-10 flex flex-col gap-4 mb-8 w-full max-w-[360px]">
                    {NIGHT_STATS.map(s => (
                        <div key={s.label} className="flex items-baseline gap-3">
                            <span className="font-brand font-bold text-[clamp(1.4rem,2.8vw,2rem)] leading-none" style={{ color: "#f47b20" }}>
                                {s.value}
                            </span>
                            <div>
                                <div className="text-white/80 text-[0.8rem] font-semibold">{s.label}</div>
                                <div className="text-white/40 text-[0.7rem]">{s.note}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating assets */}
                <div ref={burgerRef} className="absolute bottom-[10%] left-[5%] w-[22%] max-w-[180px] opacity-0 pointer-events-none z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/islak-hamburger.webp`} alt="Islak hamburger" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={catNightRef} className="absolute top-[10%] left-[8%] w-[18%] max-w-[140px] opacity-0 pointer-events-none z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/kedi-2.webp`} alt="Istanbul cat" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={coffeeRef} className="absolute bottom-[18%] right-[4%] w-[14%] max-w-[110px] opacity-0 pointer-events-none z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/turk-kahvesi-1.webp`} alt="Turkish coffee" className="w-full h-auto drop-shadow-2xl rounded-full" />
                </div>
            </div>
        </div>
    );
}
