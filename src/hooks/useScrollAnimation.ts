"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject } from "react";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export interface ParallaxItem {
    ref: RefObject<HTMLDivElement | null>;
    speed: number; 
    rotation?: number; // Optional scroll-triggered rotation in degrees.
    // Positive speed moves the item UP faster than the scroll (foreground).
    // Negative speed moves the item DOWN/slower relative to scroll (background).
}

export function useHeroParallax(
    containerRef: RefObject<HTMLElement | null>,
    items: ParallaxItem[]
) {
    useGSAP(() => {
        if (!containerRef.current) return;

        // Use matchMedia to handle responsive scroll distances
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isMobile } = context.conditions as { isMobile: boolean };
            
            // Dampen travel distance for mobile so items don't fly off screen
            const depthMultiplier = isMobile ? 0.4 : 1;
            const scrubValue = isMobile ? 1.5 : 1; // Smoother scrub on mobile touch

            items.forEach((item) => {
                if (!item.ref.current) return;
                
                // Animate Y position relative to the window height
                gsap.to(item.ref.current, {
                    y: () => -window.innerHeight * item.speed * depthMultiplier,
                    // If rotation is specified, animate it relatively to start from CSS position
                    rotation: item.rotation ? `+=${item.rotation * depthMultiplier}` : undefined,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom top", // Animates while container scrolls out of view
                        scrub: scrubValue,
                        invalidateOnRefresh: true, // Recalculates speeds if window is resized
                    }
                });
            });
        });

        // Cleanup
        return () => mm.revert();
    }, { scope: containerRef });
}
