interface StatItem {
    value: number;
    suffix: string;
    label: string;
    color: string;
}

const STATS: StatItem[] = [
    { value: 39, suffix: "", label: "Sections in one city", color: "#f47b20" },
    { value: 1500, suffix: "+", label: "Volunteers on call", color: "#00aeef" },
    { value: 30, suffix: "", label: "Languages spoken", color: "#7ac143" },
    { value: 2000, suffix: "+", label: "Students hosted last year", color: "#ec008c" },
];

export default function StatsCounter() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-12 py-14">
            {STATS.map(stat => (
                <div key={stat.label} className="text-center">
                    <div
                        className="font-brand font-bold leading-none text-[clamp(2.8rem,7vw,5rem)]"
                        style={{ color: stat.color }}
                    >
                        {stat.value.toLocaleString()}
                        {stat.suffix}
                    </div>
                    <div
                        className="mt-2 text-[clamp(0.7rem,1.1vw,0.85rem)] tracking-widest uppercase"
                        style={{ color: "#b0d68a" }}
                    >
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
