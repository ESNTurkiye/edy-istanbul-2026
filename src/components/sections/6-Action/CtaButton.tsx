"use client";

import Link from "next/link";

interface CtaButtonProps {
    href?: string;
    label?: string;
}

export default function CtaButton({ href = "#vote", label = "VOTE FOR ISTANBUL" }: CtaButtonProps) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-brand font-bold tracking-wider text-[clamp(1rem,2vw,1.3rem)] text-[#ec008c] bg-white select-none"
            style={{
                boxShadow: "0 0 0 0 rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.25)",
                transition: "box-shadow 0.4s ease, transform 0.3s ease",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 0 12px rgba(255,255,255,0.12), 0 16px 48px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 0 0 rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.25)";
            }}
        >
            <span className="relative z-10">{label}</span>
            {/* Arrow */}
            <svg className="relative z-10 w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="#ec008c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </Link>
    );
}
