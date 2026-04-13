"use client";

const ESN_SECTIONS = [
    "ESN ODTÜ",
    "ESN Boğaziçi",
    "ESN İTÜ",
    "ESN Bilkent",
    "ESN Koç University",
    "ESN Sabancı",
    "ESN Marmara",
    "ESN Yeditepe",
    "ESN Galatasaray",
    "ESN İstanbul",
    "ESN Bahçeşehir",
    "ESN MEF",
    "ESN Özyeğin",
    "ESN Kadir Has",
    "ESN Beykent",
];

interface LogoTickerProps {
    reverse?: boolean;
    speed?: number;
}

export default function LogoTicker({ reverse = false, speed = 30 }: LogoTickerProps) {
    const items = [...ESN_SECTIONS, ...ESN_SECTIONS];

    return (
        <div className="overflow-hidden w-full py-1">
            <div
                className="flex gap-4 select-none"
                style={{
                    width: "max-content",
                    animation: `${reverse ? "ticker-reverse" : "ticker"} ${speed}s linear infinite`,
                    willChange: "transform",
                }}
            >
                {items.map((section, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-[6px] rounded-full whitespace-nowrap text-sm font-medium"
                        style={{
                            border: "1.5px solid rgba(122,193,67,0.4)",
                            color: "rgba(255,255,255,0.80)",
                            background: "rgba(122,193,67,0.10)",
                        }}
                    >
                        <span style={{ color: "#7ac143", fontSize: "0.7rem" }}>✦</span>
                        {section}
                    </div>
                ))}
            </div>
        </div>
    );
}
