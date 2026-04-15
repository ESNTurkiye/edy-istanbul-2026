"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useHeroParallax } from "@/hooks/useScrollAnimation";
import "./Hero.css";

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);

    const cloudOneRef = useRef<HTMLDivElement>(null);
    const cloudTwoRef = useRef<HTMLDivElement>(null);
    const leftCloudRef = useRef<HTMLDivElement>(null);
    const rightCloudRef = useRef<HTMLDivElement>(null);
    const flowerLeftRef = useRef<HTMLDivElement>(null);
    const flowerRightRef = useRef<HTMLDivElement>(null);
    const centerFrameRef = useRef<HTMLDivElement>(null);

    useHeroParallax(sectionRef, [
        { ref: cloudOneRef, speed: 0.5, direction: -1 },
        { ref: cloudTwoRef, speed: 0.5, direction: 1 },
        { ref: leftCloudRef, speed: 0.7, direction: -1 },
        { ref: rightCloudRef, speed: 0.7, direction: 1 },
        { ref: flowerLeftRef, speed: 1.1, direction: -1 },
        { ref: flowerRightRef, speed: 1.1, direction: 1 },
        { ref: centerFrameRef, speed: 0.2, direction: -1 },
    ]);

    const innerCloudOneRef = useRef<HTMLDivElement>(null);
    const innerCloudTwoRef = useRef<HTMLDivElement>(null);
    const innerLCRef = useRef<HTMLDivElement>(null);
    const innerRCRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const clouds = [innerCloudOneRef, innerCloudTwoRef, innerLCRef, innerRCRef];
        clouds.forEach((ref, i) => {
            if (!ref.current) return;
            gsap.to(ref.current, {
                y: i % 2 === 0 ? "+=10" : "-=10",
                duration: 3.5 + i * 0.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.4,
            });
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="hero-section">
            <div ref={cloudOneRef} className="absolute cloud-one z-20 pointer-events-none">
                <div ref={innerCloudOneRef} className="sway-a w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/cloud-one.png" alt="" className="w-full h-full object-contain" />
                </div>
            </div>

            <div ref={cloudTwoRef} className="absolute cloud-two z-20 pointer-events-none">
                <div ref={innerCloudTwoRef} className="sway-c w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/cloud-one.png" alt="" className="w-full h-full object-contain" />
                </div>
            </div>

            <div ref={leftCloudRef} className="absolute left-cloud-bottom z-20 pointer-events-none">
                <div ref={innerLCRef} className="sway-b w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/cloud-two.png" alt="" className="w-full h-full object-contain" />
                </div>
            </div>

            <div ref={rightCloudRef} className="absolute right-cloud-bottom z-20 pointer-events-none">
                <div ref={innerRCRef} className="sway-d w-full h-full">
                    <img src="/images/cloud-two.png" alt="" className="w-full h-full object-contain -scale-x-100" />
                </div>
            </div>

            <div ref={flowerLeftRef} className="absolute flower-left z-20 pointer-events-none">
                <div className="sway-b w-full h-full">
                    <img src="/images/flower-bouquet.png" alt="" className="w-full h-full object-contain" />
                </div>
            </div>

            <div ref={flowerRightRef} className="absolute flower-right z-20 pointer-events-none">
                <div className="sway-d w-full h-full">
                    <img src="/images/flower-bouquet.png" alt="" className="w-full h-full object-contain" />
                </div>
            </div>

            <div ref={centerFrameRef} className="absolute center-frame z-0 pointer-events-none flex items-center justify-center">
                <video
                    className="absolute z-0 w-full h-full object-cover object-center"
                    style={{ clipPath: "inset(12.1% 12.1% 12.1% 12.1% round 600px)" }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                >
                    <source src="/videos/hero-video.mp4#t=2" type="video/mp4" />
                </video>
                <div className="sway-a w-full h-full z-10">
                    <img
                        src="/images/frame.png"
                        alt="Hero frame Bosphorus view"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div className="z-20 relative hero-text-content text-center pointer-events-none p-4">
                <p
                    className="text-white tracking-[0.25em] uppercase font-semibold mb-2"
                    style={{
                        fontSize: "clamp(0.72rem, 1.6vw, 0.9rem)",
                        textShadow: "0 1px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)",
                    }}
                >
                    Finalist · Erasmus Destination of the Year 2026
                </p>
                <h1
                    className="font-bold tracking-tighter leading-tight text-white"
                    style={{
                        fontFamily: "var(--font-kelson-sans), Arial, sans-serif",
                        fontSize: "clamp(3rem, 9vw, 7rem)",
                        textShadow: "0 4px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)",
                    }}
                >
                    Istanbul
                </h1>
                <p
                    className="text-white mt-2 font-medium"
                    style={{
                        fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                        letterSpacing: "0.12em",
                        textShadow: "0 1px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)",
                    }}
                >
                    Two continents. One welcome.
                </p>
            </div>
        </section>
    );
}
