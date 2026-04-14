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
    const lale2Ref = useRef<HTMLDivElement>(null);
    const martiRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const st = { trigger: sectionRef.current, start: "top 70%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(bullRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(laleRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(lale2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", delay: 0.2, scrollTrigger: st });
        gsap.fromTo(martiRef.current, { opacity: 0, x: 80 }, { opacity: 0.22, x: 0, duration: 1.4, ease: "power2.out", delay: 0.4, scrollTrigger: st });

        /* Bull: float up-down + subtle rocking rotation */
        gsap.to(bullRef.current, {
            y: "+=10",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5,
        });
        gsap.to(bullRef.current, {
            rotation: -4,
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.8,
            transformOrigin: "bottom center",
        });

        /* Lale-1: gentle sway */
        gsap.to(laleRef.current, {
            rotation: 3,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.6,
            transformOrigin: "bottom center",
        });

        /* Lale-2: gentle sway (opposite phase) */
        gsap.to(lale2Ref.current, {
            rotation: -3,
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.2,
            transformOrigin: "bottom center",
        });

        /* Seagull: slow horizontal drift across upper sky */
        gsap.to(martiRef.current, {
            x: "-=30",
            y: "+=8",
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1,
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

            {/* Seagull — upper right, background depth */}
            <div
                ref={martiRef}
                className="absolute right-[8%] top-[6%] w-[18%] sm:w-[13%] max-w-[180px] pointer-events-none opacity-0"
                style={{ zIndex: 1 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/marti-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* Lale-2 (golden tulips) — bottom right, behind bull */}
            <div
                ref={lale2Ref}
                className="absolute right-[26%] sm:right-[24%] bottom-0 w-[18%] sm:w-[14%] max-w-[200px] pointer-events-none opacity-0"
                style={{ zIndex: 1 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-2.webp`} alt="" className="w-full h-auto" />
            </div>

            {/* Bull cutout — bottom right */}
            <div
                ref={bullRef}
                className="absolute right-0 bottom-0 w-[35%] sm:w-[28%] max-w-[400px] opacity-0 pointer-events-none"
                style={{ zIndex: 2 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/boga-heykeli.webp`} alt="Kadıköy Bull Statue" className="w-full h-auto" />
            </div>

            {/* Lale-1 (pink tulips) — bottom left */}
            <div
                ref={laleRef}
                className="absolute left-0 bottom-0 w-[18%] sm:w-[14%] max-w-[220px] pointer-events-none"
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


                {/* Ticker rows */}
                <div className="flex flex-col gap-3 mb-2">
                    <LogoTicker reverse={false} speed={80} />
                    <LogoTicker reverse={true} speed={70} />
                </div>

                {/* Stats */}
                <StatsCounter />
            </div>
        </section>
    );
}
