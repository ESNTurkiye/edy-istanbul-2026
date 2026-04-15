export default function Footer() {
    return (
        <footer
            className="relative w-full overflow-hidden"
            style={{ background: "#0a0a0a" }}
        >
            <div className="w-full flex flex-col items-center justify-center px-4 pt-10 pb-4 gap-3">
                <p
                    className="text-white font-semibold uppercase text-center tracking-[0.28em] select-none"
                    style={{
                        fontSize: "clamp(0.72rem, 2.2vw, 1rem)",
                        textShadow: "0 1px 12px rgba(0,0,0,0.5)",
                    }}
                >
                    More than a destination
                </p>
                <span
                    className="text-white font-black uppercase leading-none w-full text-center select-none"
                    style={{
                        fontSize: "clamp(3rem, 18vw, 14rem)",
                        letterSpacing: "-0.02em",
                    }}
                >
                    ISTANBUL
                </span>
            </div>

            <div style={{ background: "#141414" }}>
                <div className="max-w-[1100px] mx-auto w-full px-6 py-3 flex flex-row items-center justify-between gap-4 flex-wrap">
                    <p className="text-white/30 text-[0.65rem] tracking-widest uppercase flex items-center gap-1.5">
                        Built by{" "}
                        <span
                            className="font-semibold tracking-widest uppercase"
                            style={{ color: "#00aeef" }}
                        >
                            WebTeam of ESN Türkiye
                        </span>
                    </p>

                    <p className="text-white/20 text-[0.6rem] tracking-wide">
                        © 2026 ESN Türkiye · Students Helping Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
