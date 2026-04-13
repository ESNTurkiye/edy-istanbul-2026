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
        gsap.fromTo(laleRef.current,     { opacity: 0, x: -40 },{ opacity: 0.35, x: 0, duration: 1, ease: "power2.out", scrollTrigger: st });

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
                <img src={`${CDN}/boga-heykeli.webp`} alt="Kadıköy Bull Statue" className="w-full h-auto" />
            </div>

            {/* Lale cutout — bottom left */}
            <div
                ref={laleRef}
                className="absolute left-0 bottom-0 w-[16%] max-w-[200px] pointer-events-none"
                style={{ zIndex: 2, opacity: 0 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-1.webp`} alt="" className="w-full h-auto" />
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

                <div
                    ref={dividerRef}
                    className="mx-auto mb-8 h-px w-[60%] max-w-[400px]"
                    style={{ background: "linear-gradient(to right, transparent, rgba(122,193,67,0.45), transparent)", transformOrigin: "left center" }}
                />

                {/* Ticker rows */}
                <div className="flex flex-col gap-3 mb-2">
                    <LogoTicker reverse={false} speed={32} />
                    <LogoTicker reverse={true}  speed={28} />
                </div>

                {/* Stats */}
                <StatsCounter />

                {/* Inclusion promise strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-12 pb-16">
                    {[
                        { icon: "♿", text: "Accessible city tours every week — step-free routes, audio guides", accent: "#00aeef" },
                        { icon: "🥗", text: "Dietary inclusion — halal, kosher, vegan buddies who know where", accent: "#ec008c" },
                        { icon: "🏳️‍🌈", text: "LGBTQ+ welcome — Beyoğlu & Kadıköy have been home for decades", accent: "#7ac143" },
                        { icon: "💬", text: "Mental-health peer support — in English, Turkish, and on demand", accent: "#f47b20" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="rounded-xl p-4"
                            style={{
                                background: `${item.accent}12`,
                                border: `1px solid ${item.accent}30`,
                            }}
                        >
                            <div className="text-xl mb-2" aria-hidden="true">{item.icon}</div>
                            <p className="text-white/70 leading-snug" style={{ fontSize: "clamp(0.7rem, 1vw, 0.82rem)" }}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
