"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CtaButton from "./CtaButton";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

export default function Action() {
    const sectionRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const galataRef = useRef<HTMLDivElement>(null);
    const lale1Ref = useRef<HTMLDivElement>(null);
    const lale2Ref = useRef<HTMLDivElement>(null);
    const kiz1Ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !bgRef.current) return;

        // Magenta wash sweeps in
        gsap.fromTo(
            bgRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.2,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                    once: true,
                },
            },
        );

        const st = { trigger: sectionRef.current, start: "top 60%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(galataRef.current, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: "power3.out", scrollTrigger: st });
        gsap.fromTo(kiz1Ref.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.25, ease: "power3.out", scrollTrigger: st });
        gsap.fromTo(lale1Ref.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.5, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(lale2Ref.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.6, ease: "power2.out", scrollTrigger: st });

        // Idle float on Galata
        gsap.to(galataRef.current, { y: "+=10", duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(kiz1Ref.current, { y: "-=8", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.2 });

        // Tulips gentle sway
        gsap.to(lale1Ref.current, { rotation: "+=5", y: "+=6", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(lale2Ref.current, { rotation: "-=5", y: "+=6", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
            style={{ background: "#5c0038" }}
        >
            {/* ── Magenta wash ── */}
            <div
                ref={bgRef}
                className="absolute inset-0 opacity-0"
                style={{
                    background:
                        "radial-gradient(ellipse 100% 100% at 50% 100%, #ec008c 0%, #b30066 40%, #6B003A 70%, #1A0010 100%)",
                }}
            />

            {/* ── Subtle texture grain ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "200px",
                }}
            />

            {/* ── Galata Tower silhouette (right) ── */}
            <div
                ref={galataRef}
                className="absolute bottom-0 right-[2%] w-[28%] sm:w-[22%] max-w-[320px] opacity-0 pointer-events-none"
                style={{ zIndex: 3 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/galata-kulesi.webp`} alt="Galata Tower" className="w-full h-auto" style={{ filter: "brightness(0.35) sepia(0) saturate(0)" }} />
            </div>

            {/* ── Maiden's Tower silhouette (left) ── */}
            <div
                ref={kiz1Ref}
                className="absolute bottom-0 left-[1%] w-[18%] sm:w-[14%] max-w-[200px] opacity-0 pointer-events-none"
                style={{ zIndex: 3 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/kiz-kulesi-1.webp`} alt="" className="w-full h-auto" style={{ filter: "brightness(0.3) saturate(0)" }} />
            </div>

            <div
                ref={lale1Ref}
                className="absolute bottom-[4%] left-[8%] sm:left-[16%] w-[12%] max-w-[150px] opacity-0 pointer-events-none"
                style={{ zIndex: 5 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-1.webp`} alt="" className="w-full h-auto" />
            </div>
            <div
                ref={lale2Ref}
                className="absolute bottom-[4%] right-[8%] sm:right-[16%] w-[12%] max-w-[150px] opacity-0 pointer-events-none"
                style={{ zIndex: 5 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${CDN}/lale-2.webp`} alt="" className="w-full h-auto" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 py-20">
                <div ref={headlineRef} className="opacity-0 mb-10">
                    <p className="text-white/60 text-[clamp(0.65rem,1vw,0.8rem)] tracking-[0.3em] uppercase font-medium mb-4">
                        EGM Split · 16–19 April 2026
                    </p>
                    <h2 className="font-brand font-bold text-white leading-tight text-[clamp(2.4rem,7vw,5.5rem)]">
                        One Vote. Ten Thousand<br />Students Finding Home.
                    </h2>
                    <p className="mt-5 text-white/95 text-[clamp(0.85rem,1.5vw,1.1rem)] max-w-[500px] mx-auto leading-relaxed">
                        Every year, one city earns the honour of hosting Europe&apos;s Erasmus community. Make it Istanbul. Make it unforgettable.
                    </p>
                </div>

                <div ref={ctaRef} className="opacity-0 flex flex-col items-center gap-4">
                    <CtaButton label="VOTE FOR ISTANBUL" />
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))" }}
            />
        </section>
    );
}
