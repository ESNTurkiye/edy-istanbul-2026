export default function Footer() {
    return (
        <footer
            className="relative w-full overflow-hidden"
            style={{ background: "#0a0a0a" }}
        >
            {/* ISTANBUL full-bleed text */}
            <div className="w-full flex items-center justify-center px-4 py-4">
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
                <div className="max-w-[1100px] mx-auto w-full px-6 py-3 flex flex-col gap-1.5">
                    {/* WebTeam credit */}
                    <p className="text-white/30 text-[0.65rem] tracking-wide flex items-center gap-2 flex-wrap">
                        This platform is made by the{" "}
                        <span className="inline-block border border-white/20 text-white/50 text-[0.6rem] tracking-widest uppercase px-2 py-0.5">
                            WebTeam of ESN Türkiye
                        </span>
                    </p>

                    {/* Copyright */}
                    <p className="text-white/20 text-[0.6rem] tracking-wide">
                        © 2026 ESN Türkiye · Students Helping Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
