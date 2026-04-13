"use client";

import SportSection from "./SportSection";
import PlaylistSection from "./PlaylistSection";
import OneDayTimeline from "./OneDayTimeline";
import ThreeDaysGrid from "./ThreeDaysGrid";
import DistrictQuiz from "./DistrictQuiz";

export default function RealityExtras() {
    return (
        <div
            className="relative w-full"
            style={{ background: "#1a1d5c" }}
        >
            {/* ── Turkish coffee decoration — bottom-right ───────────────── */}
            <div className="absolute bottom-0 right-[4%] w-[14%] max-w-[220px] pointer-events-none" style={{ zIndex: 1, opacity: 0.65 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul/turk-kahvesi-2.webp"
                    alt="Turkish coffee"
                    className="w-full h-auto"
                    style={{ filter: "drop-shadow(0 -8px 24px rgba(0,0,0,0.45))" }}
                />
            </div>

            <SportSection />
            <PlaylistSection />
            <OneDayTimeline />
            <ThreeDaysGrid />
            <DistrictQuiz />
        </div>
    );
}
