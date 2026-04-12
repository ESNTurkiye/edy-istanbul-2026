"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Load IntroSplash only on the client – it uses browser APIs (body.style, GSAP)
const IntroSplash = dynamic(() => import("./IntroSplash"), { ssr: false });

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const [introComplete, setIntroComplete] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Avoid SSR mismatch: don't render the splash at all on the server
    useEffect(() => {
        setMounted(true);
    }, []);

    // After intro ends, force ScrollTrigger to recalculate all pinned sections
    // and other triggers that measured layout while the page was visibility:hidden
    useEffect(() => {
        if (!introComplete) return;
        // Small rAF delay so the browser has painted the now-visible content
        requestAnimationFrame(() => {
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                ScrollTrigger.refresh();
            });
        });
    }, [introComplete]);

    return (
        <>
            {/* Content is always rendered so Lenis / ScrollTrigger mount cleanly.
                visibility:hidden preserves layout so GSAP can measure before reveal. */}
            <div
                style={{
                    visibility:    introComplete ? "visible" : "hidden",
                    pointerEvents: introComplete ? "auto" : "none",
                }}
            >
                {children}
            </div>

            {/* Intro overlay – only on client, once per page load */}
            {mounted && !introComplete && (
                <IntroSplash onComplete={() => setIntroComplete(true)} />
            )}
        </>
    );
}
