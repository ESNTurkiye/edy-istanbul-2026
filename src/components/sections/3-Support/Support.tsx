"use client";

import { useRef } from "react";
import Image from "next/image";
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
    const martiRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const st = { trigger: sectionRef.current, start: "top 70%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(bullRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(laleRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(martiRef.current, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.4, ease: "power2.out", delay: 0.4, scrollTrigger: st });

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

        gsap.to(laleRef.current, {
            rotation: 3,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.6,
            transformOrigin: "bottom center",
        });

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
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(122,193,67,0.20) 0%, transparent 70%)",
                }}
            />
            <div
                ref={martiRef}
                className="absolute right-[8%] top-[6%] w-[22%] sm:w-[16%] max-w-[230px] pointer-events-none opacity-0"
                style={{ zIndex: 1 }}
            >
                <Image src={`${CDN}/marti-2.webp`} alt="" width={460} height={345} className="w-full h-auto" sizes="230px" />
            </div>
            <div
                ref={bullRef}
                className="absolute right-0 bottom-0 w-[35%] sm:w-[28%] max-w-[400px] opacity-0 pointer-events-none"
                style={{ zIndex: 2 }}
            >
                <Image src={`${CDN}/boga-heykeli.webp`} alt="Kadıköy Bull Statue" width={800} height={600} className="w-full h-auto" sizes="400px" />
            </div>
            <div
                ref={laleRef}
                className="absolute left-0 bottom-0 w-[26%] sm:w-[18%] max-w-[300px] pointer-events-none"
                style={{ zIndex: 2, opacity: 0 }}
            >
                <Image src={`${CDN}/lale-1.webp`} alt="" width={600} height={450} className="w-full h-auto" sizes="300px" />
            </div>

            <div className="relative z-10 flex flex-col w-full">
                <div ref={headlineRef} className="text-center px-6 pt-14 pb-8 opacity-0">
                    <h2 className="font-brand font-bold leading-tight text-white text-[clamp(2rem,5vw,3.8rem)]">
                        15 Sections.{" "}
                        <span style={{ color: "#7ac143" }}>One Welcome.</span>
                    </h2>
                    <p className="mt-4 text-white/60 text-[clamp(0.8rem,1.3vw,1rem)] max-w-[520px] mx-auto leading-relaxed">
                        From your first bus ride to your last goodbye, 500+ volunteers in 18 languages have your back in your language, at your pace, on your terms.
                    </p>
                </div>
                <div className="flex flex-col gap-3 mb-2">
                    <LogoTicker reverse={false} speed={80} />
                    <LogoTicker reverse={true} speed={70} />
                </div>
                <StatsCounter />
            </div>
        </section>
    );
}
