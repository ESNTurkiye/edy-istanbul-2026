"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface StatItem {
    value: number;
    suffix: string;
    label: string;
    color: string;
}

const STATS: StatItem[] = [
    { value: 39, suffix: "", label: "Sections in one city", color: "#f47b20" },
    { value: 1500, suffix: "+", label: "Volunteers on call", color: "#00aeef" },
    { value: 30, suffix: "", label: "Languages spoken", color: "#7ac143" },
    { value: 2000, suffix: "+", label: "Students hosted last year", color: "#ec008c" },
];

export default function StatsCounter() {
    const containerRef = useRef<HTMLDivElement>(null);
    const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.fromTo(
            cardRefs.current.filter(Boolean),
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    once: true,
                },
            },
        );

        STATS.forEach((stat, i) => {
            const el = numRefs.current[i];
            if (!el) return;

            const counter = { val: 0 };
            gsap.to(counter, {
                val: stat.value,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    once: true,
                },
                onUpdate() {
                    if (el) el.textContent = Math.round(counter.val).toLocaleString();
                },
            });
        });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-12 py-14"
        >
            {STATS.map((stat, i) => (
                <div
                    key={stat.label}
                    ref={el => { cardRefs.current[i] = el; }}
                    className="text-center opacity-0"
                    style={{ opacity: 0 }}
                >
                    <div
                        className="font-brand font-bold leading-none text-[clamp(2.8rem,7vw,5rem)]"
                        style={{ color: stat.color }}
                    >
                        <span ref={el => { numRefs.current[i] = el; }}>0</span>
                        <span>{stat.suffix}</span>
                    </div>
                    <div className="mt-2 text-[clamp(0.7rem,1.1vw,0.85rem)] tracking-widest uppercase" style={{ color: "#b0d68a" }}>
               
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
