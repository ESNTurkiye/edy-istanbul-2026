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
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const bullRef = useRef<HTMLDivElement>(null);
    const laleRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const st = { trigger: sectionRef.current, start: "top 70%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(bullRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(laleRef.current, { opacity: 0, x: -40 }, { opacity: 0.35, x: 0, duration: 1, ease: "power2.out", scrollTrigger: st });

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
            style={{ background: "#1a3a0a" }}
        >
            {/* Green ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(122,193,67,0.20) 0%, transparent 70%)",
                }}
            />

            {/* Bull cutout — bottom right */}
            <div
                ref={bullRef}
                className="absolute right-0 bottom-0 w-[35%] sm:w-[28%] max-w-[400px] opacity-0 pointer-events-none"
                style={{ zIndex: 2 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/boga-heykeli.webp`} alt="Kadıköy Bull Statue" className="w-full h-auto" loading="lazy" width={400} height={480} />
            </div>

            {/* Lale cutout — bottom left */}
            <div
                ref={laleRef}
                className="absolute left-0 bottom-0 w-[16%] max-w-[200px] pointer-events-none"
                style={{ zIndex: 2, opacity: 0 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-1.webp`} alt="" className="w-full h-auto" loading="lazy" width={400} height={600} />
            </div>

            <div className="relative z-10 flex flex-col w-full">
                <div ref={headlineRef} className="text-center px-6 pt-14 pb-8 opacity-0">
                    <h2 className="font-brand font-bold leading-tight text-white text-[clamp(2rem,5vw,3.8rem)]">
                        15 Sections.{" "}
                        <span style={{ color: "#7ac143" }}>One Welcome.</span>
                    </h2>
                    <p className="mt-4 text-white/60 text-[clamp(0.8rem,1.3vw,1rem)] max-w-[520px] mx-auto leading-relaxed">
                        From your first bus ride to your last goodbye, 500+ volunteers in 18 languages have your back — in your language, at your pace, on your terms.
                    </p>
                </div>


                {/* Ticker rows */}
                <div className="flex flex-col gap-3 mb-2">
                    <LogoTicker reverse={false} speed={32} />
                    <LogoTicker reverse={true} speed={28} />
                </div>

                {/* Stats */}
                <StatsCounter />

                {/* Inclusion promise — compact text list */}
                <div className="px-6 md:px-12 pb-16">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-10 gap-y-3 max-w-[860px]">
                        {[
                            { label: "Accessible", detail: "step-free city tours, audio guides every week", accent: "#00aeef" },
                            { label: "Every diet", detail: "halal, kosher, vegan — your buddy knows where", accent: "#ec008c" },
                            { label: "LGBTQ+ home", detail: "Beyoğlu & Kadıköy have been home for decades", accent: "#7ac143" },
                            { label: "Mental health", detail: "peer support in English, Turkish, on demand", accent: "#f47b20" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-baseline gap-2">
                                <span
                                    className="shrink-0 font-bold"
                                    style={{ color: item.accent, fontSize: "0.72rem", letterSpacing: "0.04em" }}
                                >
                                    {item.label}
                                </span>
                                <span className="text-white/40" style={{ fontSize: "0.72rem" }}>
                                    {item.detail}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
