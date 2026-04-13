import Navigation from "@/components/global/Navigation";
import Hero from "@/components/sections/1-Hero";
import Discovery from "@/components/sections/2-Discovery";
import Support from "@/components/sections/3-Support";
import Reality from "@/components/sections/4-Reality";
import Pride from "@/components/sections/5-Pride";
import Action from "@/components/sections/6-Action";
import GlobalBackgroundTransition from "@/components/global/GlobalBackgroundTransition";
import PageWrapper from "@/components/global/PageWrapper";

export default function Home() {
    return (
        <PageWrapper>
            <GlobalBackgroundTransition />

            {/* Skip link — keyboard / screen reader fast-path */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-white"
                style={{ background: "#ec008c" }}
            >
                Skip to main content
            </a>

            <Navigation />
            <main id="main-content" className="flex flex-col w-full relative overflow-x-hidden">
                <section id="hero" aria-label="Istanbul — Hero"><Hero /></section>
                <section id="discovery" aria-label="Discover Istanbul"><Discovery /></section>
                <section id="support" aria-label="ESN Network & Support"><Support /></section>
                <section id="reality" aria-label="Life in Istanbul"><Reality /></section>
                <section id="pride" aria-label="Why Istanbul"><Pride /></section>
                <section id="action" aria-label="Vote for Istanbul"><Action /></section>
            </main>
        </PageWrapper>
    );
}
