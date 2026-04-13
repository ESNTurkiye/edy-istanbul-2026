"use client";

import { ReactNode, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Drives Lenis via GSAP's ticker and keeps ScrollTrigger in sync.
// Must be a child of <ReactLenis> so useLenis() can access the context.
function LenisBridge() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;
        const l = lenis;
        function update(time: number) {
            l.raf(time * 1000);
        }
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);
        l.on("scroll", ScrollTrigger.update);
        return () => {
            gsap.ticker.remove(update);
            l.off("scroll", ScrollTrigger.update);
        };
    }, [lenis]);

    return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, autoRaf: false }}>
            <LenisBridge />
            {children}
        </ReactLenis>
    );
}
