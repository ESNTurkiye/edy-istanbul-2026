"use client";

import SportSection from "./SportSection";
import OneDayTimeline from "./OneDayTimeline";
import ThreeDaysGrid from "./ThreeDaysGrid";
import DistrictQuiz from "./DistrictQuiz";

export default function RealityExtras() {
    return (
        <div
            className="relative w-full"
            style={{
                background: "linear-gradient(180deg, #122366 0%, #1a1d5c 46%, #11164b 100%)",
            }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 100% 68% at 50% 100%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 72%)",
                    zIndex: 0,
                }}
            />

            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[94%] max-w-[1500px] pointer-events-none"
                style={{ zIndex: 1, opacity: 0.95 }}
            >
                {/* <img
                    src="https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul/balat-yatay.jpg"
                    alt=""
                    className="w-full h-auto"
                    style={{
                        filter: "drop-shadow(0 -12px 40px rgba(0,0,0,0.5))",
                    }}
                /> */}
            </div>

            <SportSection />
            <OneDayTimeline />
            <ThreeDaysGrid />
            <DistrictQuiz />
        </div>
    );
}
