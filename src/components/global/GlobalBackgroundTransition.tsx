"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Derived from design requirements (Cyan -> Sunset Orange)
const START_COLOR = "#00A6EF";
const END_COLOR = "#F47B20";
const FLUSH_COLOR = "#F9A33A"; // Intermediate warm mid-tone glow

export default function GlobalBackgroundTransition() {
    const surfaceRef = useRef<HTMLDivElement>(null);
    const washRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const surface = surfaceRef.current;
        const wash = washRef.current;

        if (!surface || !wash) return;

        // Initial paint bounds
        gsap.set(surface, { backgroundColor: START_COLOR });
        gsap.set(wash, {
            opacity: 0,
            background: `radial-gradient(120% 95% at 50% 0%, ${FLUSH_COLOR} 0%, ${START_COLOR} 46%, ${START_COLOR} 100%)`,
        });

        // Global page flush: animates colors dynamically linked to the scroll position
        ScrollTrigger.create({
            trigger: document.body,
            start: () => `top+=${Math.round(window.innerHeight * 0.08)} top`,
            end: () => {
                const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
                return `+=${totalScrollable * 0.35}`; // Transition dominates the first 35% of page space
            },
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // The mathematical interpolation of hex shades as defined by user design
                const progress = gsap.utils.clamp(0, 1, self.progress);
                const base = gsap.utils.interpolate(START_COLOR, END_COLOR, progress) as string;
                const mid = gsap.utils.interpolate(FLUSH_COLOR, END_COLOR, progress) as string;

                const focus = gsap.utils.interpolate(0, 34, progress);
                const depth = gsap.utils.interpolate(46, 74, progress);
                const opacity = gsap.utils.interpolate(0, 0.92, progress);

                gsap.set(surface, { backgroundColor: base });
                gsap.set(wash, {
                    opacity,
                    background: `radial-gradient(130% 112% at 50% ${focus}%, ${END_COLOR} 0%, ${mid} ${depth}%, ${base} 100%)`,
                });
            },
        });
    });

    return (
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
            <div ref={surfaceRef} className="absolute inset-0" />
            <div ref={washRef} className="absolute inset-0" />
        </div>
    );
}
