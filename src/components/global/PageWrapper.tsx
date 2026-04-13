"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const IntroSplash = dynamic(() => import("./IntroSplash"), { ssr: false });

const INTRO_ENABLED = process.env.NEXT_PUBLIC_INTRO_SPLASH !== "false";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const [introComplete, setIntroComplete] = useState(!INTRO_ENABLED);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!introComplete) return;
        requestAnimationFrame(() => {
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                ScrollTrigger.refresh();
            });
        });
    }, [introComplete]);

    return (
        <>
            <div
                style={{
                    visibility: introComplete ? "visible" : "hidden",
                    pointerEvents: introComplete ? "auto" : "none",
                }}
            >
                {children}
            </div>

            {INTRO_ENABLED && mounted && !introComplete && (
                <IntroSplash onComplete={() => setIntroComplete(true)} />
            )}
        </>
    );
}
