export const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

export const PIN_TIMINGS = [1.1, 2.0, 3.0, 4.0, 5.1] as const;

export interface Landmark {
    id: string;
    label: string;
    sublabel: string;
    description: string;
    image: string;
    imageAlt: string;
    accent: string;
    /** Real GPS coordinates used by Leaflet for exact pin placement */
    lat: number;
    lng: number;
    /**
     * Which side the info card appears on relative to the pin.
     * right → card to the right; left → card to the left.
     * Right-of-center (Taksim, Kadıköy) use left so card doesn't overflow screen.
     */
    cardSide: "left" | "right";
}

export const LANDMARKS: Landmark[] = [
    {
        id: "sultanahmet",
        label: "Sultanahmet",
        sublabel: "Historic Heart",
        description: "Six minarets, two millennia of empire. The Blue Mosque and Hagia Sophia face each other across a silence that hums with history.",
        image: `${CDN}/ayasofya.webp`,
        imageAlt: "Hagia Sophia",
        accent: "#f47b20",
        lat: 41.0054, lng: 28.9768,
        cardSide: "right",
    },
    {
        id: "bazaar",
        label: "Kapalıçarşı",
        sublabel: "Grand Bazaar",
        description: "61 covered streets, 4,000 shops and the world's oldest scent of spice. Once you enter, the city will never fully let you leave.",
        image: `${CDN}/kiz-kulesi-1.webp`,
        imageAlt: "Grand Bazaar Istanbul",
        accent: "#7ac143",
        lat: 41.0107, lng: 28.9681,
        cardSide: "right",
    },
    {
        id: "galata",
        label: "Galata",
        sublabel: "Beyoğlu Nights",
        description: "A medieval tower that watches over the city's most bohemian quarter. Coffee in the morning, jazz at midnight.",
        image: `${CDN}/galata-kulesi.webp`,
        imageAlt: "Galata Tower",
        accent: "#00aeef",
        lat: 41.0256, lng: 28.9741,
        cardSide: "right",
    },
    {
        id: "taksim",
        label: "Taksim",
        sublabel: "İstiklal Avenue",
        description: "Three kilometres of bookshops, galleries and street music. The nostalgic red tram still runs through the crowd.",
        image: `${CDN}/taksim-tramvay.webp`,
        imageAlt: "İstiklal tram Taksim",
        accent: "#2e3192",
        lat: 41.0370, lng: 28.9851,
        cardSide: "left",
    },
    {
        id: "kadikoy",
        label: "Kadıköy",
        sublabel: "Asian Soul",
        description: "The Bosphorus crossing takes 20 minutes and delivers you to another world. Markets, murals and the bull that became a symbol.",
        image: `${CDN}/boga-heykeli.webp`,
        imageAlt: "Kadıköy Bull Statue",
        accent: "#ec008c",
        lat: 40.9904, lng: 29.0292,
        cardSide: "left",
    },
];

/** Smooth quadratic-bezier path through pixel-coordinate points */
export function smoothPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${last.y}`;
    return d;
}

/** Card position relative to the section, offset from the pin */
export function cardPos(pinPx: { x: number; y: number }, lm: Landmark) {
    const W = 200; // approx card width in px
    const GAP = 20;
    const Y = -100; // card appears 100px above the pin centre
    const x = lm.cardSide === "right"
        ? pinPx.x + GAP
        : Math.max(8, pinPx.x - W - GAP);
    return { x, y: Math.max(68, pinPx.y + Y) };
}
