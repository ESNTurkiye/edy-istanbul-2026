"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CDN = "https://cdn.jsdelivr.net/gh/ESNTurkiye/esn-assets@main/istanbul";

const MONUMENTS = [
    {
        src: "ayasofya.webp",
        alt: "Blue Mosque",
        x: "50%",
        w: "72%",
        maxW: 860,
        zIndex: 2,
        bottom: "0%",
        yEntry: 160,
        yScroll: 18,
        delay: 0.12,
        floatAmp: 5,
    },
    {
        src: "galata-kulesi.webp",
        alt: "Galata Tower",
        x: "25%",
        w: "45%",
        maxW: 520,
        zIndex: 4,
        bottom: "-11%",
        yEntry: 280,
        yScroll: 260,
        delay: 0,
        floatAmp: 11,
    },
    {
        src: "kiz-kulesi-2.webp",
        alt: "Maiden's Tower",
        x: "78%",
        w: "38%",
        maxW: 460,
        zIndex: 3,
        bottom: "-9%",
        yEntry: 245,
        yScroll: 220,
        delay: 0.2,
        floatAmp: 9,
    },
] as const;

const TOWER_START_RAISE = 300;

export default function SkylineReveal() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
    const bird1Ref = useRef<HTMLImageElement>(null);
    const bird2Ref = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;
        parallaxRefs.current.filter(Boolean).forEach((el) => {
            gsap.set(el, { xPercent: -50 });
        });

        const revealTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=60%",
            scrub: 0.5,
        };

        const towerScrollTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=480%",
            scrub: 0.6,
        };

        entryRefs.current.filter(Boolean).forEach((el, i) => {
            const m = MONUMENTS[i];
            gsap.fromTo(
                el,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: revealTrigger,
                },
            );

            gsap.to(el, {
                y: `-=${m.floatAmp}`,
                x: i % 2 === 0 ? "+=4" : "-=4",
                rotate: i % 2 === 0 ? 1.6 : -1.6,
                duration: 4.5 + i * 0.65,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        parallaxRefs.current.filter(Boolean).forEach((el, i) => {
            if (i === 1 || i === 2) {
                gsap.fromTo(el,
                    { y: MONUMENTS[i].yEntry - TOWER_START_RAISE },
                    {
                        y: -400,
                        ease: "none",
                        scrollTrigger: towerScrollTrigger,
                    },
                );
                return;
            }

            gsap.to(el, {
                y: -MONUMENTS[i].yScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.8,
                },
            });
        });

        const galataImg = entryRefs.current[1]?.querySelector<HTMLImageElement>("img");
        if (galataImg) {
            gsap.fromTo(
                galataImg,
                { filter: "brightness(1) drop-shadow(0 24px 48px rgba(0,0,0,0.6))" },
                {
                    filter: "brightness(1.16) drop-shadow(0 24px 48px rgba(0,0,0,0.6))",
                    duration: 5.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: 2,
                },
            );
        }
        const birdScrollTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=480%",
            scrub: 0.6,
        };

        if (bird1Ref.current) {
            gsap.fromTo(bird1Ref.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 0.9, scale: 1, ease: "none", scrollTrigger: revealTrigger },
            );
            gsap.fromTo(bird1Ref.current,
                { rotation: -18 },
                { rotation: 22, ease: "none", scrollTrigger: birdScrollTrigger },
            );

            gsap.fromTo(bird1Ref.current, {
                x: -260,
                y: 8,
            }, {
                x: 400,
                y: -24,
                ease: "none",
                scrollTrigger: birdScrollTrigger,
            });

            gsap.to(bird1Ref.current, {
                xPercent: 6,
                yPercent: -6,
                rotate: 2.2,
                duration: 4.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

        if (bird2Ref.current) {
            gsap.fromTo(bird2Ref.current,
                { opacity: 0, scaleX: -0.9, scaleY: 0.9 },
                { opacity: 0.7, scaleX: -1, scaleY: 1, ease: "none", scrollTrigger: revealTrigger },
            );
            gsap.fromTo(bird2Ref.current,
                { rotation: 15 },
                { rotation: -20, ease: "none", scrollTrigger: birdScrollTrigger },
            );

            gsap.fromTo(bird2Ref.current, {
                x: 260,
                y: -8,
            }, {
                x: -400,
                y: 18,
                ease: "none",
                scrollTrigger: birdScrollTrigger,
            });

            gsap.to(bird2Ref.current, {
                xPercent: -6,
                yPercent: 6,
                rotate: -2.2,
                duration: 5.3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

    }, { scope: wrapRef });

    return (
        <div
            ref={wrapRef}
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(520px, 72vw, 900px)" }}
        >
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "70%",
                    background:
                        "radial-gradient(ellipse 110% 75% at 50% 105%, rgba(244,123,32,0.28) 0%, rgba(180,60,0,0.14) 38%, transparent 68%)",
                    zIndex: 1,
                }}
            />
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                    bottom: "8%",
                    height: "35%",
                    background:
                        "radial-gradient(ellipse 80% 55% at 50% 100%, rgba(255,140,30,0.12) 0%, transparent 70%)",
                    filter: "blur(32px)",
                    zIndex: 1,
                }}
            />
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "30%",
                    background: "linear-gradient(to top, rgba(42,18,0,0.9) 0%, transparent 100%)",
                    zIndex: 9,
                }}
            />
            <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                    height: "22%",
                    background: "linear-gradient(to bottom, rgba(42,18,0,0.55) 0%, transparent 100%)",
                    zIndex: 9,
                }}
            />
            {MONUMENTS.map((m, i) => (
                <div
                    key={m.alt}
                    ref={el => { parallaxRefs.current[i] = el; }}
                    className="absolute bottom-0 pointer-events-none"
                    style={{
                        left: m.x,
                        width: m.w,
                        maxWidth: m.maxW,
                        zIndex: m.zIndex,
                        bottom: m.bottom,
                        willChange: "transform",
                    }}
                >
                    <div
                        ref={el => { entryRefs.current[i] = el; }}
                        className="opacity-0"
                        style={{ willChange: "transform, opacity" }}
                    >
                        <div
                            className="absolute inset-x-0 bottom-0 pointer-events-none"
                            style={{
                                height: "45%",
                                background:
                                    "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(244,123,32,0.38) 0%, transparent 70%)",
                                filter: "blur(18px)",
                                zIndex: -1,
                            }}
                        />
                        <Image
                            src={`${CDN}/${m.src}`}
                            alt={m.alt}
                            width={860}
                            height={520}
                            className="relative w-full h-auto"
                            style={{
                                filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.65))",
                            }}
                            sizes="(max-width: 768px) 72vw, 860px"
                        />
                    </div>
                </div>
            ))}
            <Image
                ref={bird1Ref}
                src={`${CDN}/marti-2.webp`}
                alt=""
                aria-hidden
                width={100}
                height={75}
                className="absolute pointer-events-none select-none h-auto"
                style={{
                    width: "clamp(58px, 7vw, 100px)",
                    top: "18%",
                    left: "22%",
                    zIndex: 7,
                    opacity: 0,
                    transformOrigin: "center center",
                }}
            />
            <Image
                ref={bird2Ref}
                src={`${CDN}/marti-2.webp`}
                alt=""
                aria-hidden
                width={62}
                height={47}
                className="absolute pointer-events-none select-none h-auto"
                style={{
                    width: "clamp(36px, 4vw, 62px)",
                    top: "28%",
                    left: "68%",
                    zIndex: 7,
                    opacity: 0,
                    transformOrigin: "center center",
                    transform: "scaleX(-1)",
                }}
            />
        </div>
    );
}
