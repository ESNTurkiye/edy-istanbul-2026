"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const THREE_DAYS = [
    {
        day: "Day 1",
        title: "The Historic Peninsula",
        items: ["Topkapı Palace", "Sultanahmet Mosque", "Basilica Cistern", "Egyptian Bazaar", "Bosphorus sunset cruise"],
        accent: "#f47b20",
        image: "ayasofya.webp",
        imageObjectPosition: "center 42%",
        mediaAspectClass: "aspect-[16/10]",
    },
    {
        day: "Day 2",
        title: "Beyoğlu & Modern İstanbul",
        items: ["İstiklal Avenue", "Galata Tower", "Pera Museum", "Çukurcuma antiques", "Karaköy bars & galleries"],
        accent: "#00aeef",
        image: "galata-kulesi.webp",
        imageObjectPosition: "center 40%",
        mediaAspectClass: "aspect-[16/10]",
    },
    {
        day: "Day 3",
        title: "Asian Soul",
        items: ["Kadıköy breakfast", "Moda waterfront", "Haydarpaşa Station", "Princes' Island ferry", "Return via Bosphorus at dusk"],
        accent: "#ec008c",
        image: "boga-heykeli.webp",
        /*9:16 asset in a wide slot: taller frame + anchor to lower third so the bull stays in frame */
        imageObjectPosition: "center 92%",
        mediaAspectClass: "aspect-[10/12] md:aspect-[9/11]",
    },
] as const;

export default function ThreeDaysGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;
        gsap.fromTo(wrapRef.current,
            { opacity: 0, y: 35 },
            {
                opacity: 1, y: 0, duration: 0.85, ease: "power2.out", delay: 0.1,
                scrollTrigger: { trigger: wrapRef.current, start: "top 80%", once: true },
            },
        );
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative px-6 py-16"
            style={{ background: "linear-gradient(to bottom, #1a1d5c, #12154a)" }}
        >
            <div ref={wrapRef} className="max-w-[1100px] mx-auto opacity-0">
                <div className="text-center mb-12">
                    <h2
                        className="font-bold text-white leading-tight"
                        style={{
                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
                        }}
                    >
                        3 Days in Istanbul
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {THREE_DAYS.map((day) => (
                        <div
                            key={day.day}
                            className="rounded-2xl p-6 overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: `1px solid ${day.accent}30`,
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            <div className={`-mx-6 -mt-6 relative mb-4 overflow-hidden ${day.mediaAspectClass}`}>
                                <Image
                                    src={`${CDN}/${day.image}`}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    style={{ objectPosition: day.imageObjectPosition }}
                                    sizes="(max-width: 768px) 100vw, 360px"
                                />
                            </div>
                            <div
                                className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase mb-2"
                                style={{ color: day.accent }}
                            >
                                {day.day}
                            </div>
                            <h3
                                className="text-white font-bold mb-4 leading-tight"
                                style={{
                                    fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                                    fontSize: "1.05rem",
                                }}
                            >
                                {day.title}
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {day.items.map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-white/55" style={{ fontSize: "0.8rem" }}>
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{ background: day.accent }}
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}