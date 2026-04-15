"use client";

import Link from "next/link";
import { trackVote } from "@/lib/analytics";

const VOTE_URL = process.env.NEXT_PUBLIC_VOTE_URL?.trim();
const hasUrl = Boolean(VOTE_URL && VOTE_URL !== "#");

interface CtaButtonProps {
    label?: string;
}

export default function CtaButton({ label = "VOTE FOR ISTANBUL" }: CtaButtonProps) {
    if (!hasUrl) {
        return (
            <button
                disabled
                className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-brand font-bold tracking-wider text-[clamp(1rem,2vw,1.3rem)] select-none opacity-60 cursor-default"
                style={{ color: "#ec008c", background: "white" }}
                aria-label={`${label} vote link coming soon`}
            >
                <span
                    className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_linear_infinite]"
                    style={{
                        background: "linear-gradient(105deg, transparent 40%, rgba(236,0,140,0.12) 50%, transparent 60%)",
                    }}
                />
                <span className="relative z-10">{label}</span>
                <Arrow />
            </button>
        );
    }

    return (
        <Link
            href={VOTE_URL!}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackVote}
            className="cta-button group relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-brand font-bold tracking-wider text-[clamp(1rem,2vw,1.3rem)] text-[#ec008c] bg-white select-none transition-all duration-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(236,0,140,0.45)] active:scale-95"
        >
            <span
                className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_linear_infinite]"
                style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(236,0,140,0.1) 50%, transparent 60%)",
                }}
            />
            <span className="relative z-10">{label}</span>
            <Arrow />
        </Link>
    );
}

function Arrow() {
    return (
        <svg className="relative z-10 w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="#ec008c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}