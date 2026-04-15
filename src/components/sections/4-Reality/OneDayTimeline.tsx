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

const ONE_DAY = [
    { time: "07:30", label: "Sunrise simit", note: "Grab a simit from a street cart and walk to Galata Bridge." },
    { time: "09:00", label: "Hagia Sophia", note: "Beat the crowds. The morning light through the windows is otherworldly." },
    { time: "11:30", label: "Grand Bazaar wander", note: "60 covered streets get lost on purpose." },
    { time: "13:30", label: "Çay break", note: "Find a rooftop terrace with views of the Golden Horn." },
    { time: "15:00", label: "Bosphorus ferry", note: "Cross to the Asian side. Window seat mandatory." },
    { time: "17:00", label: "Kadıköy market", note: "Fresh figs, olives and the city's best street food." },
    { time: "19:30", label: "Sunset at Kız Kulesi", note: "The Maiden's Tower at dusk photograph it from the waterfront." },
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
            <div
                className="pointer-events-none absolute top-6 right-2 sm:right-6 w-[22%] max-w-[130px] z-0 opacity-95 lg:top-10 lg:right-[5%] lg:max-w-[118px]"
                aria-hidden
            >
                <Image src={`${CDN}/Simit-1.webp`} alt="" width={260} height={195} className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]" sizes="130px" />
            </div>
            <div
                className="pointer-events-none absolute bottom-24 left-0 sm:left-4 w-[20%] max-w-[120px] z-0 opacity-90 hidden sm:block lg:left-auto lg:right-[4%] lg:bottom-auto lg:top-[46%] lg:max-w-[128px]"
                aria-hidden
            >
                <Image src={`${CDN}/kiz-kulesi-1.webp`} alt="" width={240} height={180} className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]" sizes="120px" />
            </div>
            <div
                className="pointer-events-none absolute top-[48%] -right-1 sm:right-0 w-[16%] max-w-[88px] z-0 opacity-92 lg:top-[24%] lg:right-[14%] lg:max-w-[96px]"
                aria-hidden
            >
                <Image src={`${CDN}/cay-2.webp`} alt="" width={176} height={176} className="w-full h-auto drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)] rounded-full" sizes="88px" />
            </div>
            <div
                className="pointer-events-none absolute bottom-8 right-[12%] w-[24%] max-w-[140px] z-0 opacity-88 hidden md:block lg:bottom-[6%] lg:right-[26%] lg:max-w-[132px]"
                aria-hidden
            >
                <Image src={`${CDN}/islak-hamburger.webp`} alt="" width={280} height={210} className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]" sizes="140px" />
            </div>

            <div ref={wrapRef} className="opacity-0 relative z-10">
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
