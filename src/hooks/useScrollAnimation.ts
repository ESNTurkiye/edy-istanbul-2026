"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject } from "react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export interface ParallaxItem {
    ref: RefObject<HTMLDivElement | null>;
    /**
     * Horizontal drift speed multiplier.
     * Higher value = faster drift = appears closer to the viewer.
     */
    speed: number;
    /**
     * Direction of horizontal drift.
     *  1 = drift right,  -1 = drift left.
     * Default: alternates based on index (elements alternate direction for depth).
     */
    direction?: 1 | -1;
}

/**
 * Scroll-driven HORIZONTAL parallax (X-axis only).
 *
 * Per the animation rules:
 *   - Elements drift LEFT or RIGHT at different speeds to suggest depth.
 *   - NO vertical (Y-axis) translation during scroll.
 *   - The continuous idle rotation (-3°→+3°) is handled via CSS `.sway-*` classes,
 *     so it runs independently even while scrolling.
 *   - `scrub: true` makes every animation bidirectional scrolling back replays it.
 */
export function useHeroParallax(
    containerRef: RefObject<HTMLElement | null>,
    items: ParallaxItem[],
) {
    useGSAP(() => {
        if (!containerRef.current) return;

        const mm = gsap.matchMedia();

        mm.add(
            { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
            (context) => {
                const { isMobile } = context.conditions as { isMobile: boolean };

                const depthMul  = isMobile ? 0.35 : 1;
                const scrubVal  = isMobile ? 1.8 : 1.2;

                const BASE_VW = 0.12;

                items.forEach((item, idx) => {
                    if (!item.ref.current) return;

                    const dir = item.direction ?? (idx % 2 === 0 ? -1 : 1);
                    const travel = window.innerWidth * BASE_VW * item.speed * depthMul * dir;

                    gsap.to(item.ref.current, {
                        x: travel,
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start:   "top top",
                            end:     "bottom top",
                            scrub:   scrubVal,
                            invalidateOnRefresh: true,
                        },
                    });
                });
            },
        );

        return () => mm.revert();
    }, { scope: containerRef });
}
