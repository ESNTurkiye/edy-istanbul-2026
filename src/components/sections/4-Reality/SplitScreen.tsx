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
        gsap.set(rightPhotoFrameRef.current, { top: "-1px", bottom: "-1px" });
        gsap.set(rightPhotoRef.current, { scale: 1.06, transformOrigin: "center center" });
        gsap.set([simitRef.current, catDayRef.current, cay1Ref.current, burgerRef.current, catNightRef.current, coffeeRef.current], { opacity: 1, y: 0 });

        gsap.to(catDayRef.current, { y: "-=8", x: "+=4", rotate: -8, duration: 3.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(simitRef.current, { y: "+=9", x: "-=5", rotate: 7, duration: 4.0, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.25 });
        gsap.to(cay1Ref.current, { y: "-=7", x: "+=4", rotate: -6.2, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.15 });
        gsap.to(burgerRef.current, { y: "+=10", x: "-=6", rotate: 9, scale: 1.08, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.1 });
        gsap.to(catNightRef.current, { y: "-=9", x: "+=4", rotate: -8.4, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.08 });
        gsap.to(coffeeRef.current, { y: "+=8", x: "-=4", rotate: 6.5, scale: 1.06, duration: 3.9, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full flex flex-col md:flex-row min-h-[70vh] overflow-hidden"
            style={{ background: "#121d4a" }}
        >

            {/* ── LEFT: Day / Academic ───────────────────────────── */}
            <div
                ref={leftRef}
                className="relative w-full md:w-[35%] flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[35vh] md:min-h-[70vh]"
                style={{ background: "transparent" }}
            >
                {/* Left block frame: same vertical bounds as right image frame */}
                <div
                    className="absolute -inset-px pointer-events-none"
                    style={{ background: "linear-gradient(145deg, #1a2f66 0%, #1c3f7b 58%, #182a58 100%)" }}
                />

                <div ref={leftContentRef} className="relative z-10 w-full max-w-[430px] opacity-100">
                {/* Day label */}
                <div ref={leftTagRef} className="mb-8 opacity-100">
                    <h3 className="font-brand font-bold text-[#ecf6ff] text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
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
                                <div className="text-[#d8ecff] text-[0.8rem] font-semibold">{s.label}</div>
                                <div className="text-[#9fc2e6] text-[0.7rem]">{s.note}</div>
                            </div>
                        </div>
                    ))}
                    <p className="text-[#9fc2e6] text-[0.72rem] leading-snug mt-2">
                        Accessible for every body, every budget, every background.
                    </p>
                </div>
                </div>

                {/* Floating assets */}
                <div ref={catDayRef} className="absolute top-[2%] right-[14%] w-[12%] max-w-[110px] opacity-0 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/kedi-1.webp`} alt="Istanbul cat" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={coffeeRef} className="absolute bottom-[2%] left-[3%] w-[15%] max-w-[135px] opacity-0 pointer-events-none z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/turk-kahvesi-1.webp`} alt="Turkish coffee" className="w-full h-auto drop-shadow-2xl rounded-full" />
                </div>
                <div ref={burgerRef} className="absolute top-[40%] right-[8%] w-[22%] max-w-[185px] opacity-0 pointer-events-none z-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/islak-hamburger.webp`} alt="Islak hamburger" className="w-full h-auto drop-shadow-2xl" />
                </div>
            </div>

            {/* ── CENTER DIVIDER ── */}
            <div
                ref={dividerRef}
                className="hidden md:block absolute top-0 left-[35%] -translate-x-1/2 w-px h-full z-20"
                style={{
                    background: "linear-gradient(to bottom, transparent, rgba(0,174,239,0.32), rgba(244,123,32,0.2), transparent)",
                    transformOrigin: "top center",
                }}
            />

            {/* ── RIGHT: Night / Social ──────────────────────────── */}
            <div
                ref={rightRef}
                className="relative w-full md:w-[65%] flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[35vh] md:min-h-[70vh] overflow-hidden"
                style={{ background: "transparent" }}
            >
                {/* Right block frame: exactly same height as image frame */}
                <div className="absolute -inset-px" style={{ background: "#191f52" }} />

                {/* Bridge night photo as background */}
                <div ref={rightPhotoFrameRef} className="absolute -inset-px overflow-hidden">
                    <div
                        ref={rightPhotoRef}
                        className="absolute inset-0"
                        style={{
                            opacity: 0.74,
                            backgroundImage:    `url(${CDN}/bogaz-koprusu-2.webp)`,
                            backgroundSize:     "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            filter: "contrast(1.2) saturate(1.16) brightness(0.68)",
                        }}
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(138deg, rgba(15,26,62,0.22) 0%, rgba(8,14,38,0.55) 100%)" }} />
                </div>

                {/* Night label */}
                <div
                    ref={rightContentRef}
                    className="relative z-10 w-full max-w-[430px] ml-[4%] opacity-100"
                >
                <div ref={rightTagRef} className="relative z-10 mb-8 opacity-100">
                    <h3 className="font-brand font-bold text-[#f3f7ff] text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
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
                                <div className="text-[#dde9ff] text-[0.8rem] font-semibold">{s.label}</div>
                                <div className="text-[#a6bbdf] text-[0.7rem]">{s.note}</div>
                            </div>
                        </div>
                    ))}
                    <p className="text-[#b9cae7] text-[0.72rem] leading-snug mt-2">
                        Safe streets, safe friends, safe spaces — our volunteers see you home.
                    </p>
                </div>
                </div>

                {/* Floating assets */}
                <div ref={catNightRef} className="absolute top-[3%] right-[15%] w-[12%] max-w-[110px] opacity-0 pointer-events-none z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/kedi-2.webp`} alt="Istanbul cat" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={simitRef} className="absolute bottom-[8%] right-[22%] w-[18%] max-w-[150px] opacity-0 pointer-events-none z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/Simit-1.webp`} alt="Simit" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div ref={cay1Ref} className="absolute bottom-[14%] right-[37%] w-[8%] max-w-[72px] opacity-0 pointer-events-none z-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/cay-1.webp`} alt="Turkish tea" className="w-full h-auto drop-shadow-2xl rounded-full" />
                </div>
            </div>
        </div>
    );
}
