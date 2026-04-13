export default function Stars() {
    const stars: { x: number; y: number; r: number; o: number }[] = [];
    let seed = 0x8f3a;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0x100000000;
    };
    for (let i = 0; i < 80; i++) {
        stars.push({ x: rand() * 100, y: rand() * 100, r: rand() * 1.2 + 0.4, o: rand() * 0.5 + 0.15 });
    }
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            {stars.map((s, i) => (
                <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o} />
            ))}
        </svg>
    );
}
