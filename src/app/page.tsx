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
            <Navigation />
            <main className="flex flex-col w-full relative overflow-x-hidden">
                <section id="hero"><Hero /></section>
                <section id="discovery"><Discovery /></section>
                <section id="support"><Support /></section>
                <section id="reality"><Reality /></section>
                <section id="pride"><Pride /></section>
                <section id="action"><Action /></section>
            </main>
        </PageWrapper>
    );
}
