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
    const leftContentRef = useRef<HTMLDivElement>(null);
    const rightContentRef = useRef<HTMLDivElement>(null);
    const rightPhotoFrameRef = useRef<HTMLDivElement>(null);
    const rightPhotoRef = useRef<HTMLDivElement>(null);
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

        // Static layout: no scroll-driven animation/reposition.
        gsap.set([leftRef.current, rightRef.current, leftTagRef.current, rightTagRef.current], { opacity: 1, x: 0, y: 0 });
        gsap.set(dividerRef.current, { opacity: 1, scaleY: 1, transformOrigin: "top center" });
        gsap.set([leftContentRef.current, rightContentRef.current], { x: 0 });
        gsap.set(rightPhotoFrameRef.current, { top: "12%", bottom: "12%" });
        gsap.set(rightPhotoRef.current, { scale: 1.06, transformOrigin: "center center" });
        gsap.set([simitRef.current, catDayRef.current, cay1Ref.current, burgerRef.current, catNightRef.current, coffeeRef.current], { opacity: 1, y: 0 });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full flex flex-col md:flex-row min-h-screen overflow-hidden"
            style={{ background: "#fff8f1" }}
        >

            {/* ── LEFT: Day / Academic ───────────────────────────── */}
            <div
                ref={leftRef}
                className="relative w-full md:w-[35%] flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[50vh] md:min-h-screen"
                style={{ background: "transparent" }}
            >
                {/* Left block frame: same vertical bounds as right image frame */}
                <div
                    className="absolute left-0 right-0 top-[12%] bottom-[12%] pointer-events-none"
                    style={{ background: "linear-gradient(145deg, #f3f9ff 0%, #e8f3ff 60%, #eef7ff 100%)" }}
                />

                <div ref={leftContentRef} className="relative z-10 w-full max-w-[430px] opacity-100">
                {/* Day label */}
                <div ref={leftTagRef} className="mb-8 opacity-100">
                    <h3 className="font-brand font-bold text-[#142844] text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight">
                        Where Knowledge<br />Meets Culture
                    </h3>
                </div>

                {/* Day stats */}
                <div className="flex flex-col gap-4 mb-6 w-full max-w-[360px]">
                    {DAY_STATS.map(s => (
                        <div key={s.label} className="flex items-baseline gap-3">
                            <span className="font-brand font-bold text-[clamp(1.4rem,2.8vw,2rem)] leading-none" style={{ color: "#7ac143" }}>
                                {s.value}
                            </span>
                            <div>
                                <div className="text-[#243b59] text-[0.8rem] font-semibold">{s.label}</div>
                                <div className="text-[#5b7390] text-[0.7rem]">{s.note}</div>
                            </div>
                        </div>
                    ))}
                    <p className="text-white/40 text-[0.72rem] leading-snug mt-2">
                        Accessible for every body, every budget, every background.
                    </p>
                </div>
                </div>

                {/* Floating assets */}
                <div ref={simitRef} className="absolute bottom-[8%] right-[14%] w-[22%] max-w-[180px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/Simit-1.webp`} alt="Simit" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={catDayRef} className="absolute top-[9%] right-[20%] w-[16%] max-w-[130px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/kedi-1.webp`} alt="Istanbul cat" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={cay1Ref} className="absolute bottom-[18%] left-[4%] w-[14%] max-w-[110px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/cay-1.webp`} alt="Turkish tea" className="w-full h-auto drop-shadow-2xl rounded-full" />
                </div>
            </div>

            {/* ── CENTER DIVIDER ── */}
            <div
                ref={dividerRef}
                className="hidden md:block absolute top-0 left-[35%] -translate-x-1/2 w-px h-full z-20"
                style={{
                    background: "linear-gradient(to bottom, transparent, rgba(27,51,82,0.28), rgba(27,51,82,0.18), transparent)",
                    transformOrigin: "top center",
                }}
            />

            {/* ── RIGHT: Night / Social ──────────────────────────── */}
            <div
                ref={rightRef}
                className="relative w-full md:w-[65%] flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[50vh] md:min-h-screen overflow-hidden"
                style={{ background: "transparent" }}
            >
                {/* Right block frame: exactly same height as image frame */}
                <div className="absolute left-0 right-0 top-[12%] bottom-[12%]" style={{ background: "#fff8f1" }} />

                {/* Bridge night photo as background */}
                <div ref={rightPhotoFrameRef} className="absolute left-0 right-0 top-[12%] bottom-[12%] overflow-hidden">
                    <div
                        ref={rightPhotoRef}
                        className="absolute inset-0"
                        style={{
                            opacity: 0.44,
                            backgroundImage:    `url(${CDN}/bogaz-koprusu-2.webp)`,
                            backgroundSize:     "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            filter: "contrast(1.07) saturate(1.08)",
                        }}
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,248,241,0.56) 0%, rgba(255,248,241,0.28) 100%)" }} />
                </div>

                {/* Night label */}
                <div ref={rightContentRef} className="relative z-10 w-full max-w-[430px] ml-[4%] opacity-100">
                <div ref={rightTagRef} className="relative z-10 mb-8 opacity-100">
                    <h3 className="font-brand font-bold text-[#3b2a20] text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight">
                        Where Friendships<br />Begin
                    </h3>
                </div>

                {/* Night stats */}
                <div className="relative z-10 flex flex-col gap-4 mb-6 w-full max-w-[360px]">
                    {NIGHT_STATS.map(s => (
                        <div key={s.label} className="flex items-baseline gap-3">
                            <span className="font-brand font-bold text-[clamp(1.4rem,2.8vw,2rem)] leading-none" style={{ color: "#f47b20" }}>
                                {s.value}
                            </span>
                            <div>
                                <div className="text-[#4b3528] text-[0.8rem] font-semibold">{s.label}</div>
                                <div className="text-[#796251] text-[0.7rem]">{s.note}</div>
                            </div>
                        </div>
                    ))}
                    <p className="text-white/40 text-[0.72rem] leading-snug mt-2">
                        Safe streets, safe friends, safe spaces — our volunteers see you home.
                    </p>
                </div>
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
