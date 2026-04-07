import Navigation from "@/components/global/Navigation";
import Hero from "@/components/sections/1-Hero/Hero";
import Discovery from "@/components/sections/2-Discovery/Discovery";
import Support from "@/components/sections/3-Support/Support";
import Reality from "@/components/sections/4-Reality/Reality";
import Pride from "@/components/sections/5-Pride/Pride";
import Action from "@/components/sections/6-Action/Action";
import GlobalBackgroundTransition from "@/components/global/GlobalBackgroundTransition";

export default function Home() {
    return (
        <>
            <GlobalBackgroundTransition />
            <Navigation />
            <main className="flex flex-col w-full relative overflow-x-hidden">
                <Hero />
                <Discovery />
                <Support />
                <Reality />
                <Pride />
                <Action />
            </main>
        </>
    );
}
