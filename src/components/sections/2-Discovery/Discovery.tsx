export default function Discovery() {
    return (
        <section className="relative w-full max-w-[1440px] min-h-100dvh lg:h-[1024px] mx-auto text-white overflow-hidden flex  justify-center">

            <h1
                className="absolute top-[-0%] left-1/2 w-[58%] -translate-x-1/2 text-center text-[clamp(2rem,4.7vw,2.5rem)] font-extrabold tracking-[0.05em] text-white"
                style={{ fontFamily: "Lato, var(--font-geist-sans), Arial, sans-serif" }}
            >
                DIVE INTO ISTANBUL
            </h1>
            <p
                className="absolute top-[10%] left-1/2 w-[38%] -translate-x-1/2 text-center text-[clamp(0.86rem,1.45vw,1rem)] font-semibold italic leading-relaxed tracking-[0.01em] text-white"
                style={{ fontFamily: "Lato, var(--font-geist-sans), Arial, sans-serif" }}
            >
                Every street in Istanbul holds a secret, and the next chapter is yours. When we look through the centuries of history, we see a vibrant life waiting to be lived. Take the leap and let the city guide you.
            </p>
        </section>
    );
}
