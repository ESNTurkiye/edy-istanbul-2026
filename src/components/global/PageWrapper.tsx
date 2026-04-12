"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const IntroSplash = dynamic(() => import("./IntroSplash"), { ssr: false });

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const [introComplete, setIntroComplete] = useState(false);
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
                    visibility:    introComplete ? "visible" : "hidden",
                    pointerEvents: introComplete ? "auto" : "none",
                }}
            >
                {children}
            </div>

            {mounted && !introComplete && (
                <IntroSplash onComplete={() => setIntroComplete(true)} />
            )}
        </>
    );
}
