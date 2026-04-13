"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const MONUMENTS = [
    { src: "galata-kulesi.webp",     alt: "Galata Tower",        delay: 0,    zIndex: 3, x: "15%",  w: "22%", maxW: 280 },
    { src: "ayasofya.webp",          alt: "Hagia Sophia",         delay: 0.15, zIndex: 2, x: "38%",  w: "28%", maxW: 340 },
    { src: "kiz-kulesi-2.webp",      alt: "Maiden's Tower",       delay: 0.3,  zIndex: 4, x: "65%",  w: "22%", maxW: 280 },
] as const;

export default function SkylineReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const monRefs      = useRef<(HTMLDivElement | null)[]>([]);
    const glowRefs     = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Monuments rise from below
        gsap.fromTo(
            monRefs.current.filter(Boolean),
            { y: 120, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1.2,
                stagger: 0.18,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start:   "top 80%",
                    once:    true,
                },
            },
        );

        // Glow flare on each monument after rise
        glowRefs.current.filter(Boolean).forEach((el, i) => {
            gsap.fromTo(
                el,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 0.5, scale: 1.1,
                    duration: 0.7,
                    delay: 0.6 + i * 0.18,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start:   "top 80%",
                        once:    true,
                    },
                },
            );
        });

        // Idle subtle float on monuments
        monRefs.current.filter(Boolean).forEach((el, i) => {
            gsap.to(el, {
                y: i % 2 === 0 ? "+=8" : "-=6",
                duration: 4 + i * 0.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.6,
            });
        });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: "clamp(280px, 45vw, 560px)" }}
        >
            {MONUMENTS.map((m, i) => (
                <div
                    key={m.alt}
                    ref={el => { monRefs.current[i] = el; }}
                    className="absolute bottom-0 opacity-0 pointer-events-none"
                    style={{
                        left:     m.x,
                        width:    m.w,
                        maxWidth: m.maxW,
                        zIndex:   m.zIndex,
                        transform: "translate(-50%, 0)",
                    }}
                >
                    {/* Glow halo behind monument */}
                    <div
                        ref={el => { glowRefs.current[i] = el; }}
                        className="absolute inset-0 rounded-full blur-2xl opacity-0"
                        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(244,123,32,0.45) 0%, transparent 70%)" }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/${m.src}`} alt={m.alt} className="relative w-full h-auto z-10 drop-shadow-2xl" />
                </div>
            ))}
        </div>
    );
}
