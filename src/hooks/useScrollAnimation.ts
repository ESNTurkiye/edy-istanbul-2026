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
    speed: number;

    direction?: 1 | -1;
}

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

                const depthMul = isMobile ? 0.35 : 1;
                const scrubVal = isMobile ? 1.8 : 1.2;

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
                            start: "top top",
                            end: "bottom top",
                            scrub: scrubVal,
                            invalidateOnRefresh: true,
                        },
                    });
                });
            },
        );

        return () => mm.revert();
    }, { scope: containerRef });
}