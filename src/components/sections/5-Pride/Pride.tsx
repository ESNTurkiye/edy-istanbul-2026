"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SkylineReveal from "./SkylineReveal";
import LiteratureStrip from "./LiteratureStrip";
import { CDN, INFO_CARDS } from "./prideData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Pride() {
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const cardsWrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const st = { trigger: sectionRef.current, start: "top 70%", once: true };

        gsap.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: st });

        gsap.fromTo(
            cardsRef.current.filter(Boolean),
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 55%", once: true },
            },
        );

        const sideCardsTrigger = {
            trigger: cardsWrapRef.current,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 1,
            invalidateOnRefresh: true,
        };

        const sideStartX = Math.round(window.innerWidth * 0.45);

        if (cardsRef.current[0]) {
            gsap.fromTo(cardsRef.current[0], { x: -sideStartX }, { x: 0, ease: "none", scrollTrigger: sideCardsTrigger });
        }

        if (cardsRef.current[2]) {
            gsap.fromTo(cardsRef.current[2], { x: sideStartX }, { x: 0, ease: "none", scrollTrigger: sideCardsTrigger });
        }
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden"
            style={{ background: "#2a1200" }}
        >
            {/* Ambient warm glow from top */}
            <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "40%",
                    background: "radial-gradient(ellipse at 50% -20%, rgba(244,123,32,0.28) 0%, transparent 70%)",
                }}
            />

            {/* Cistern background */}
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: `url(${CDN}/yerebatan-sarnici-yatay.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(42,18,0,0.88) 0%, rgba(42,18,0,0.65) 40%, rgba(42,18,0,0.82) 100%)" }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full px-6 pt-16 pb-0">

                {/* Headline */}
                <div ref={headlineRef} className="text-center max-w-[700px] mb-12 opacity-0">
                    <h2 className="font-brand font-bold leading-tight text-white text-[clamp(2rem,5vw,3.8rem)]">
                        Istanbul Isn&apos;t Just a City —<br />
                        <span style={{ color: "#f47b20" }}>It&apos;s a Civilisation</span>
                    </h2>
                    <p className="mt-4 text-[clamp(0.8rem,1.3vw,1rem)] leading-relaxed" style={{ color: "#d4c0ae" }}>
                        Three empires called it home. One generation of Erasmus students is about to discover why.
                    </p>
                </div>

                {/* Info cards */}
                <div ref={cardsWrapRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[1120px] mb-10 place-items-center">
                    {INFO_CARDS.map((card, i) => (
                        <div
                            key={card.title}
                            ref={el => { cardsRef.current[i] = el; }}
                            className="relative rounded-2xl p-6 overflow-hidden opacity-0 w-full max-w-[340px] text-center"
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: `1px solid ${card.accent}4d`,
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div
                                className="absolute top-0 left-0 right-0 h-px"
                                style={{ background: `linear-gradient(to right, transparent, ${card.accent}60, transparent)` }}
                            />
                            <h3 className="font-brand font-bold text-[clamp(1.2rem,2.2vw,1.6rem)] leading-tight mb-2" style={{ color: "#f2e5d8" }}>
                                {card.headline}
                            </h3>
                            <p className="text-[clamp(0.75rem,1.1vw,0.9rem)] leading-relaxed" style={{ color: "#d8c7ba" }}>
                                {card.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Istanbul in Literature */}
            <LiteratureStrip />

            {/* Rising skyline */}
            <div className="relative z-10 w-full">
                <SkylineReveal />
            </div>
        </section>
    );
}
