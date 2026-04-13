export default function Footer() {
    return (
        <footer className="p-8 bg-black text-white">
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">Istanbul EDY 2026</h1>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <p className="text-sm text-gray-400">
                    This platform is made by the{" "}
                    <span className="inline-block bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-md">
                        WebTeam of ESN Türkiye
                    </span>
                </p>
            </div>
        </footer>
    );
}
