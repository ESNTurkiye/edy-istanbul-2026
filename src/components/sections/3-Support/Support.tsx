"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoTicker from "./LogoTicker";
import StatsCounter from "./StatsCounter";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

export default function Support() {
    const sectionRef  = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const bullRef     = useRef<HTMLDivElement>(null);
    const laleRef     = useRef<HTMLDivElement>(null);
    const dividerRef  = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const st = { trigger: sectionRef.current, start: "top 70%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(dividerRef.current,  { scaleX: 0 },         { scaleX: 1, duration: 1, ease: "power2.out", transformOrigin: "left center", scrollTrigger: st });
        gsap.fromTo(bullRef.current,     { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(laleRef.current,     { opacity: 0, x: -40 },{ opacity: 1, x: 0, duration: 1,   ease: "power2.out", scrollTrigger: st });

        gsap.to(bullRef.current, {
            y: "+=10",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5,
        });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center"
            style={{ background: "linear-gradient(180deg, #f7fbff 0%, #eef5ff 55%, #fdf9f2 100%)" }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(244,123,32,0.14) 0%, transparent 72%)",
                }}
            />

            <div
                ref={bullRef}
                className="absolute right-0 bottom-0 w-[35%] sm:w-[28%] max-w-[400px] opacity-0 pointer-events-none"
                style={{ zIndex: 2 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/boga-heykeli.webp`} alt="Kadıköy Bull Statue" className="w-full h-auto" />
            </div>

            <div
                ref={laleRef}
                className="absolute left-[1%] top-[12%] w-[10%] max-w-[120px] opacity-0 pointer-events-none"
                style={{ zIndex: 2 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-1.webp`} alt="" className="w-full h-auto" />
            </div>

            <div className="relative z-10 flex flex-col w-full">
                <div ref={headlineRef} className="text-center px-6 pt-14 pb-8 opacity-0">
                    <p className="text-[#f47b20] text-[clamp(0.65rem,1vw,0.8rem)] tracking-[0.3em] uppercase font-medium mb-3">
                        Unity in Diversity
                    </p>
                    <h2 className="font-brand font-bold leading-tight text-[#112643] text-[clamp(2rem,5vw,3.8rem)]">
                        15 Sections.{" "}
                        <span style={{ color: "#00a6ef" }}>One City.</span>
                    </h2>
                    <p className="mt-4 text-[clamp(0.8rem,1.3vw,1rem)] max-w-[520px] mx-auto leading-relaxed" style={{ color: "#3d5572" }}>
                        The largest ESN network density in Turkey — all under Istanbul&apos;s skyline.
                    </p>
                </div>

                <div
                    ref={dividerRef}
                    className="mx-auto mb-8 h-px w-[60%] max-w-[400px]"
                    style={{ background: "linear-gradient(to right, transparent, rgba(244,123,32,0.4), transparent)", transformOrigin: "left center" }}
                />

                {/* Ticker rows */}
                <div className="flex flex-col gap-3 mb-2">
                    <LogoTicker reverse={false} speed={32} />
                    <LogoTicker reverse={true}  speed={28} />
                </div>

                {/* Stats */}
                <StatsCounter />
            </div>
        </section>
    );
}
