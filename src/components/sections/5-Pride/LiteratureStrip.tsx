"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QUOTES } from "./prideData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LiteratureStrip() {
    const stripRef = useRef<HTMLDivElement>(null);
    const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!stripRef.current) return;
        gsap.fromTo(
            quoteRefs.current.filter(Boolean),
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.9,
                stagger: 0.25,
                ease: "power2.out",
                scrollTrigger: { trigger: stripRef.current, start: "top 75%", once: true },
            },
        );
    }, { scope: stripRef });

    return (
        <div
            ref={stripRef}
            className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-12 mb-4"
        >
            <div className="text-center mb-8">
                <span style={{
                    display: "inline-block",
                    background: "rgba(244,123,32,0.14)",
                    color: "#f47b20",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                }}>
                    Istanbul in Literature
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {QUOTES.map((q, i) => (
                    <div
                        key={i}
                        ref={el => { quoteRefs.current[i] = el; }}
                        className="relative opacity-0 rounded-xl p-5"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: `1px solid ${q.accent}25`,
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        <div
                            className="absolute top-3 left-4 leading-none select-none"
                            style={{
                                fontFamily: "Georgia, serif",
                                fontSize: "3.5rem",
                                color: `${q.accent}30`,
                                lineHeight: 1,
                            }}
                        >
                            &ldquo;
                        </div>
                        <p
                            className="text-white/70 leading-relaxed pt-5 mb-4"
                            style={{ fontSize: "clamp(0.78rem, 1vw, 0.88rem)" }}
                        >
                            {q.quote}
                        </p>
                        <div>
                            <div
                                className="font-semibold text-white"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
                            >
                                {q.author}
                            </div>
                            <div
                                className="font-light italic"
                                style={{ fontSize: "0.62rem", color: q.accent, letterSpacing: "0.05em" }}
                            >
                                {q.work}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
