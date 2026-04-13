"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const NAV_LINKS = [
    { label: "Discover", href: "#discovery"},
    { label: "Network", href: "#support"},
    { label: "Life", href: "#reality"},
    { label: "Pride", href: "#pride"},
    { label: "Vote", href: "#action", highlight: true },
];

export default function Navigation() {
    const navRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!navRef.current) return;
        gsap.to(navRef.current, {
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(0,0,0,0.55)",
            scrollTrigger: {
                trigger: document.body,
                start: "50px top",
                end:   "200px top",
                scrub: true,
            },
        });
    });

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3"
            style={{ backgroundColor: "transparent", transition: "background-color 0.3s ease" }}
        >
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
                <span
                    className="font-brand font-bold text-white text-sm md:text-base tracking-wide"
                >
                    ESN <span style={{ color: "#00aeef", textShadow: "0 1px 6px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.4)" }}>İstanbul</span>{" "}
                    <span className="text-white/50 font-normal">EDY 2026</span>
                </span>
            </div>

            {/* Links (hidden on small mobile) */}
            <ul className="hidden sm:flex items-center gap-1 md:gap-2">
                {NAV_LINKS.map(link => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="relative px-3 py-1.5 text-[0.75rem] md:text-[0.8rem] tracking-wide font-medium rounded-full transition-colors duration-200"
                            style={
                                link.highlight
                                    ? { background: "#ec008c", color: "#fff" }
                                    : { color: "rgba(255,255,255,0.65)" }
                            }
                            onMouseEnter={e => {
                                if (!link.highlight)
                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.95)";
                            }}
                            onMouseLeave={e => {
                                if (!link.highlight)
                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                            }}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Mobile CTA */}
            <Link
                href="#action"
                className="sm:hidden px-4 py-1.5 rounded-full text-[0.75rem] font-bold text-white"
                style={{ background: "#ec008c" }}
            >
                Vote
            </Link>
        </nav>
    );
}
