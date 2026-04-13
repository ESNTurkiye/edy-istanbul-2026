export default function Footer() {
    return (
        <footer
            className="relative w-full overflow-hidden"
            style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
            <div className="max-w-[1100px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

                {/* Brand */}
                <div className="text-center md:text-left">
                    <p className="font-brand font-bold text-white text-lg tracking-wide">
                        ESN <span style={{ color: "#00aeef" }}>İstanbul</span>
                    </p>
                    <p className="mt-1 text-white/35 text-[0.7rem] tracking-widest uppercase">
                        Erasmus Destination of the Year 2026
                    </p>
                </div>

                {/* Voting window */}
                <div className="text-center">
                    <p className="text-white/35 text-[0.68rem] tracking-widest uppercase mb-1">Voting period</p>
                    <p className="font-brand font-bold text-white text-sm">16 – 19 April 2026</p>
                    <p className="text-white/35 text-[0.68rem] mt-1">EGM Split, Croatia</p>
                </div>

                {/* ESN colours strip + attribution */}
                <div className="text-center md:text-right">
                    <div className="flex justify-center md:justify-end gap-1.5 mb-3">
                        {["#00aeef", "#ec008c", "#7ac143", "#f47b20", "#2e3192"].map(c => (
                            <span key={c} className="inline-block w-4 h-4 rounded-full" style={{ background: c }} />
                        ))}
                    </div>
                    <p className="text-white/30 text-[0.65rem] leading-relaxed">
                        Made with ♥ by the{" "}
                        <span className="text-white/55 font-medium">WebTeam of ESN Türkiye</span>
                    </p>
                </div>
            </div>

            {/* Bottom line */}
            <div
                className="w-full h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(0,174,239,0.3) 30%, rgba(236,0,140,0.3) 70%, transparent)" }}
            />
            <p className="text-center text-white/20 text-[0.6rem] py-3 tracking-wide">
                © 2026 ESN Türkiye · Students Helping Students
            </p>
        </footer>
    );
}
