"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ONE_DAY = [
    { time: "07:30", label: "Sunrise simit", note: "Grab a simit from a street cart and walk to Galata Bridge." },
    { time: "09:00", label: "Hagia Sophia", note: "Beat the crowds. The morning light through the windows is otherworldly." },
    { time: "11:30", label: "Grand Bazaar wander", note: "60 covered streets — get lost on purpose." },
    { time: "13:30", label: "Çay break", note: "Find a rooftop terrace with views of the Golden Horn." },
    { time: "15:00", label: "Bosphorus ferry", note: "Cross to the Asian side. Window seat mandatory." },
    { time: "17:00", label: "Kadıköy market", note: "Fresh figs, olives and the city's best street food." },
    { time: "19:30", label: "Sunset at Kız Kulesi", note: "The Maiden's Tower at dusk — photograph it from the waterfront." },
    { time: "21:00", label: "Beyoğlu dinner", note: "Meyhane meze, rakı and strangers who become friends." },
];

export default function OneDayTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;
        gsap.fromTo(wrapRef.current,
            { opacity: 0, y: 35 },
            {
                opacity: 1, y: 0, duration: 0.85, ease: "power2.out",
                scrollTrigger: { trigger: wrapRef.current, start: "top 80%", once: true },
            },
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-10 px-6 py-20 max-w-[900px] mx-auto">
            <div ref={wrapRef} className="opacity-0">
                <div className="text-center mb-12">
                    <h2
                        className="font-bold text-white leading-tight"
                        style={{
                            fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
                        }}
                    >
                        One Day in Istanbul
                    </h2>
                </div>

                <div className="relative">
                    <div
                        className="absolute left-[52px] sm:left-[64px] top-0 bottom-0 w-px"
                        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,174,239,0.3) 10%, rgba(0,174,239,0.3) 90%, transparent)" }}
                    />

                    <div className="flex flex-col gap-6">
                        {ONE_DAY.map((item, i) => (
                            <div key={i} className="flex gap-4 sm:gap-6 items-start">
                                <div
                                    className="shrink-0 font-bold text-right"
                                    style={{ width: "44px", color: "#00aeef", fontSize: "0.68rem", paddingTop: "2px" }}
                                >
                                    {item.time}
                                </div>
                                <div
                                    className="shrink-0 w-3 h-3 rounded-full mt-[3px]"
                                    style={{ background: "#00aeef", boxShadow: "0 0 8px 3px rgba(0,174,239,0.4)" }}
                                />
                                <div>
                                    <div
                                        className="text-white font-semibold mb-0.5"
                                        style={{ fontFamily: "var(--font-kelson-sans), Arial, sans-serif", fontSize: "0.95rem" }}
                                    >
                                        {item.label}
                                    </div>
                                    <div className="text-white/45 leading-snug" style={{ fontSize: "0.78rem" }}>
                                        {item.note}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
