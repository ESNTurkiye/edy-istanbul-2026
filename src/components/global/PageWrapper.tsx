"use client";

import { useEffect, type ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
    useEffect(() => {
        requestAnimationFrame(() => {
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                ScrollTrigger.refresh();
            });
        });
    }, []);

    return <>{children}</>;
}
