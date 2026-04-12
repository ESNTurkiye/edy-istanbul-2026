"use client";

import SplitScreen from "./SplitScreen";
import RealityExtras from "./RealityExtras";

export default function Reality() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Day / Night split */}
            <SplitScreen />
            {/* Long-form content: Sport, Playlist, Itineraries, Quiz */}
            <RealityExtras />
        </section>
    );
}
