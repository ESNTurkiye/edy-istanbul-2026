type GtagFn = (
    command: "event",
    eventName: string,
    params?: Record<string, unknown>,
) => void;

/**
 * Fire a vote_clicked event to GA4 (via gtag or dataLayer).
 * Safe to call even if no analytics is configured all paths are
 * guarded and will silently no-op.
 */
export function trackVote(): void {
    if (typeof window === "undefined") return;
    const w = window as typeof window & {
        gtag?: GtagFn;
        dataLayer?: Record<string, unknown>[];
    };
    if (typeof w.gtag === "function") {
        w.gtag("event", "vote_clicked", {
            event_category: "engagement",
            event_label: "Istanbul EDY 2026",
        });
    }
    if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({
            event: "vote_clicked",
            destination: "Istanbul",
            campaign: "EDY 2026",
        });
    }
}
