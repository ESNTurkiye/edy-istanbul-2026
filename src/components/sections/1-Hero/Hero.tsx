"use client";

import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useHeroParallax } from '@/hooks/useScrollAnimation';
import './Hero.css';

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const cloudOneRef = useRef<HTMLDivElement>(null);
    const cloudTwoRef = useRef<HTMLDivElement>(null);
    const leftCloudRef = useRef<HTMLDivElement>(null);
    const rightCloudRef = useRef<HTMLDivElement>(null);
    const flowerLeftRef = useRef<HTMLDivElement>(null);
    const flowerRightRef = useRef<HTMLDivElement>(null);
    const centerFrameRef = useRef<HTMLDivElement>(null);

    // 1. Scroll-bound Parallax for Frame and Flowers
    useHeroParallax(sectionRef, [
        { ref: centerFrameRef, speed: 0.4 },  // Midground frame
        { ref: flowerLeftRef, speed: 0.8, rotation: 60 },   // Foreground: moves up + rotates clockwise
        { ref: flowerRightRef, speed: 0.8, rotation: -60 }, // Foreground: moves up + rotates counter-clockwise
        { ref: leftCloudRef, speed: 0.4 },   // Bottom clouds move up fast with scroll
        { ref: rightCloudRef, speed: 0.4 },
        { ref: cloudOneRef, speed: 0.3 },    // Top clouds move slowly for depth
        { ref: cloudTwoRef, speed: 0.3 },
    ]);

    // 2. Idle Floating Animation for Clouds (Not Scroll-bound)
    // We target the FIRST CHILD of each cloud ref to separate floating from parallax
    useGSAP(() => {
        // Top Clouds: Multi-axis floating (target inner div)
        [cloudOneRef, cloudTwoRef].forEach((ref, i) => {
            if (!ref.current) return;
            const inner = ref.current.firstChild;
            if (!inner) return;

            gsap.to(inner, {
                y: i % 2 === 0 ? "+=15" : "-=20",
                x: i % 2 === 0 ? "-=10" : "+=15",
                duration: 3 + i,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        // Bottom Clouds: Subtle vertical floating (target inner div)
        [leftCloudRef, rightCloudRef].forEach((ref, i) => {
            if (!ref.current) return;
            const inner = ref.current.firstChild;
            if (!inner) return;

            gsap.to(inner, {
                y: i % 2 === 0 ? "-=15" : "+=15",
                duration: 4 + i,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.5
            });
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="hero-section">

            {/* Parallax Layer - Top Left Cloud */}
            <div ref={cloudOneRef} className="absolute cloud-one z-20 pointer-events-none">
                <div className="w-full h-full relative">
                    <Image
                        src="/images/cloud-one.png"
                        alt="Top left cloud"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Parallax Layer - Top Right Cloud */}
            <div ref={cloudTwoRef} className="absolute cloud-two z-20 pointer-events-none">
                <div className="w-full h-full relative">
                    <Image
                        src="/images/cloud-one.png"
                        alt="Top right cloud"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Parallax Layer - Left Cloud Bottom */}
            <div ref={leftCloudRef} className="absolute left-cloud-bottom z-20 pointer-events-none">
                <div className="w-full h-full relative">
                    <Image
                        src="/images/cloud-two.png"
                        alt="Left cloud"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Parallax Layer - Right Cloud Bottom */}
            <div ref={rightCloudRef} className="absolute right-cloud-bottom z-20 pointer-events-none">
                <div className="w-full h-full">
                    <Image
                        src="/images/cloud-two.png"
                        alt="Right cloud"
                        fill
                        priority
                        className="object-contain -scale-x-100"
                    />
                </div>
            </div>

            {/* Parallax Layer - Left Flower Bouquet */}
            <div ref={flowerLeftRef} className="absolute flower-left z-20 pointer-events-none">
                <div className="w-full h-full relative">
                    <Image
                        src="/images/flower-bouquet.png"
                        alt="Left flower bouquet"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Parallax Layer - Right Flower Bouquet */}
            <div ref={flowerRightRef} className="absolute flower-right z-20 pointer-events-none">
                <div className="w-full h-full relative">
                    <Image
                        src="/images/flower-bouquet.png"
                        alt="Right flower bouquet"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Responsive Container Matrix */}
            <div ref={centerFrameRef} className="absolute center-frame z-0 pointer-events-none flex items-center justify-center">

                {/* Embedded Video Background */}
                <video
                    className="absolute z-0 w-full h-full object-cover object-center"
                    style={{
                        // Exact Inset for the Frame cutout
                        clipPath: 'inset(12.1% 12.1% 12.1% 12.1% round 600px)'
                    }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                >
                    <source src="/videos/hero-video.mp4#t=2" type="video/mp4" />
                </video>

                {/* Frame Photo */}
                <Image
                    src="/images/frame.png"
                    alt="Hero Frame"
                    fill
                    priority
                    className="object-contain z-10 relative"
                />
            </div>

            {/* Content Text Overlay */}
            <div className="z-20 relative hero-text-content text-center pointer-events-none drop-shadow-xl p-4">
                <h1 className="text-3xl xs:text-4xl mobileLg:text-5xl sm:text-6xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight">
                    Istanbul
                </h1>
            </div>
        </section>
    );
}
