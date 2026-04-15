"use client";

const ESN_SECTIONS = [
    "ESN ALTINBAS",
    "ESN Arel",
    "ESN Bahcesehir",
    "ESN Bogazici",
    "ESN Cerrahpasa",
    "ESN Existanbul",
    "ESN ISIK",
    "ESN ITU",
    "ESN Kadir Has",
    "ESN Marmara",
    "ESN MU",
    "ESN NİSANTASİ",
    "ESN Ozyegin",
    "ESN Yeditepe",
    "ESN YILDIZ",
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
                        className="flex items-center gap-2 px-4 py-[6px] rounded-full whitespace-nowrap text-sm font-semibold"
                        style={{
                            border: "1.5px solid rgba(122,193,67,0.4)",
                            color: "rgba(255,255,255,0.80)",
                            background: "rgba(122,193,67,0.10)",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "#7ac143",
                                flexShrink: 0,
                            }}
                            aria-hidden="true"
                        />
                        {section}
                    </div>
                ))}
            </div>
        </div>
    );
}
