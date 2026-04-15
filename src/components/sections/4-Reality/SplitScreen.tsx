import Image from "next/image";

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

/* ── Data panels ───────────────────────────────── */
const DAY_STATS = [
    { label: "Avg. Monthly Cost", value: "€ 400", note: "among Europe's most affordable" },
    { label: "World University Rank", value: "Top 500", note: "4 universities in global rankings" },
    { label: "Erasmus Host Rating", value: "4.8 / 5", note: "student-rated destination" },
];

const NIGHT_STATS = [
    { label: "Student Districts", value: "7+", note: "Kadıköy, Beyoğlu, Beşiktaş…" },
    { label: "Cultural Events / yr", value: "1,200+", note: "festivals, concerts & exhibitions" },
    { label: "Nights to Remember", value: "∞", note: "Istanbul never sleeps" },
];

export default function SplitScreen() {
    return (
        <div
            className="relative w-full flex flex-col md:flex-row min-h-[70vh] overflow-hidden"
            style={{ background: "#121d4a" }}
        >
            <div
                className="relative w-full md:w-[35%] flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[35vh] md:min-h-[70vh]"
                style={{ background: "transparent" }}
            >
                <div
                    className="absolute -inset-px pointer-events-none"
                    style={{ background: "linear-gradient(145deg, #1a2f66 0%, #1c3f7b 58%, #182a58 100%)" }}
                />

                <div className="relative z-10 w-full max-w-[430px]">
                    <div className="mb-8">
                        <h3 className="font-brand font-bold text-[#ecf6ff] text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                            Where Knowledge<br />Meets Culture
                        </h3>
                    </div>
                    <div className="flex flex-col gap-4 mb-6 w-full max-w-[360px]">
                        {DAY_STATS.map(s => (
                            <div key={s.label} className="flex items-baseline gap-3">
                                <span className="font-brand font-bold text-[clamp(1.4rem,2.8vw,2rem)] leading-none" style={{ color: "#7ac143" }}>
                                    {s.value}
                                </span>
                                <div>
                                    <div className="text-[#d8ecff] text-[0.8rem] font-semibold">{s.label}</div>
                                    <div className="text-[#9fc2e6] text-[0.7rem]">{s.note}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div
                className="hidden md:block absolute top-0 left-[35%] -translate-x-1/2 w-px h-full z-20"
                style={{
                    background: "linear-gradient(to bottom, transparent, rgba(0,174,239,0.32), rgba(244,123,32,0.2), transparent)",
                    transformOrigin: "top center",
                }}
            />
            <div
                className="relative w-full md:w-[65%] flex flex-col justify-center items-start px-8 md:px-12 lg:px-16 py-16 min-h-[52vh] md:min-h-[70vh] overflow-hidden"
                style={{ background: "transparent" }}
            >
                <div className="absolute -inset-px" style={{ background: "#191f52" }} />
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={`${CDN}/bogaz-koprusu-2.webp`}
                        alt=""
                        fill
                        className="pointer-events-none select-none object-cover opacity-[0.82]"
                        style={{
                            filter: "contrast(1.18) saturate(1.12) brightness(0.72)",
                        }}
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(138deg, rgba(15,26,62,0.22) 0%, rgba(8,14,38,0.55) 100%)" }} />
                </div>

                <div className="relative z-10 w-full max-w-[430px] ml-[4%]">
                    <div className="relative z-10 mb-8">
                        <h3 className="font-brand font-bold text-[#f3f7ff] text-[clamp(1.6rem,3.5vw,2.8rem)] mt-3 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                            Where Friendships<br />Begin
                        </h3>
                    </div>
                    <div className="relative z-10 flex flex-col gap-4 mb-6 w-full max-w-[360px]">
                        {NIGHT_STATS.map(s => (
                            <div key={s.label} className="flex items-baseline gap-3">
                                <span className="font-brand font-bold text-[clamp(1.4rem,2.8vw,2rem)] leading-none" style={{ color: "#f47b20" }}>
                                    {s.value}
                                </span>
                                <div>
                                    <div className="text-[#dde9ff] text-[0.8rem] font-semibold">{s.label}</div>
                                    <div className="text-[#a6bbdf] text-[0.7rem]">{s.note}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
