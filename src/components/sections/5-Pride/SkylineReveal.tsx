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
        alt: "Hagia Sophia",
        x: "50%", w: "72%", maxW: 860,
        zIndex: 2, bottom: "0%",
        yScroll: 18, delay: 0.12, floatAmp: 5,
    },
    {
        src: "galata-kulesi.webp",
        alt: "Galata Tower",
        x: "25%", w: "45%", maxW: 520,
        zIndex: 4, bottom: "-11%",
        yEntry: 280, yScroll: 260, delay: 0, floatAmp: 11,
    },
    {
        src: "kiz-kulesi-2.webp",
        alt: "Maiden's Tower",
        x: "78%", w: "38%", maxW: 460,
        zIndex: 3, bottom: "-9%",
        yEntry: 245, yScroll: 220, delay: 0.2, floatAmp: 9,
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

        // Tüm animasyonlu elementlere will-change ver — erken, layout hesabından önce
        const allAnimated = [
            ...parallaxRefs.current,
            ...entryRefs.current,
            bird1Ref.current,
            bird2Ref.current,
        ].filter(Boolean) as HTMLElement[];

        gsap.set(allAnimated, { willChange: "transform, opacity" });

        // Parallax wrapper'ları hizala
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

        // ---- Entry fade-in ----
        entryRefs.current.filter(Boolean).forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0 },
                { opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: revealTrigger },
            );
        });

        // ---- Float animasyonları — SADECE translate, rotate yok ----
        // Rotate her frame'de composite layer'ı invalide ediyor
        entryRefs.current.filter(Boolean).forEach((el, i) => {
            const amp = MONUMENTS[i].floatAmp;
            gsap.to(el, {
                y: `-=${amp}`,
                // rotate kaldırıldı — çok pahalı, görsel fark minimal
                duration: 4.5 + i * 0.65,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        // ---- Parallax scroll ----
        parallaxRefs.current.filter(Boolean).forEach((el, i) => {
            if (i === 1 || i === 2) {
                gsap.fromTo(el,
                    { y: MONUMENTS[i].yEntry! - TOWER_START_RAISE },
                    { y: -400, ease: "none", scrollTrigger: towerScrollTrigger },
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

        // ---- Kuşlar — x/y tek tween'e toplandı ----
        const birdScrollTrigger = {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=480%",
            scrub: 0.6,
        };

        if (bird1Ref.current) {
            gsap.fromTo(bird1Ref.current,
                { opacity: 0 },
                { opacity: 0.9, ease: "none", scrollTrigger: revealTrigger },
            );
            // x + y + rotation tek tween — GSAP bunları tek matris işlemine indirger
            gsap.fromTo(bird1Ref.current,
                { x: -260, y: 8, rotation: -18 },
                { x: 400, y: -24, rotation: 22, ease: "none", scrollTrigger: birdScrollTrigger },
            );
            // Float — yalnızca y
            gsap.to(bird1Ref.current, {
                y: "-=6", duration: 4.8, repeat: -1, yoyo: true, ease: "sine.inOut",
            });
        }

        if (bird2Ref.current) {
            gsap.fromTo(bird2Ref.current,
                { opacity: 0, scaleX: -1 },
                { opacity: 0.7, scaleX: -1, ease: "none", scrollTrigger: revealTrigger },
            );
            gsap.fromTo(bird2Ref.current,
                { x: 260, y: -8, rotation: 15 },
                { x: -400, y: 18, rotation: -20, ease: "none", scrollTrigger: birdScrollTrigger },
            );
            gsap.to(bird2Ref.current, {
                y: "+=6", duration: 5.3, repeat: -1, yoyo: true, ease: "sine.inOut",
            });
        }

        // Cleanup: will-change sıfırla (animasyon bittikten sonra memory'de tutmasın)
        return () => {
            gsap.set(allAnimated, { willChange: "auto" });
        };

    }, { scope: wrapRef });

    return (
        <div
            ref={wrapRef}
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(520px, 72vw, 900px)" }}
        >
            {/* Gradientler — değişmedi */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "70%", background: "radial-gradient(ellipse 110% 75% at 50% 105%, rgba(244,123,32,0.28) 0%, rgba(180,60,0,0.14) 38%, transparent 68%)", zIndex: 1 }} />
            <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: "8%", height: "35%", background: "radial-gradient(ellipse 80% 55% at 50% 100%, rgba(255,140,30,0.12) 0%, transparent 70%)", filter: "blur(32px)", zIndex: 1 }} />
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "30%", background: "linear-gradient(to top, rgba(42,18,0,0.9) 0%, transparent 100%)", zIndex: 9 }} />
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "22%", background: "linear-gradient(to bottom, rgba(42,18,0,0.55) 0%, transparent 100%)", zIndex: 9 }} />

            {MONUMENTS.map((m, i) => (
                <div
                    key={m.alt}
                    ref={el => { parallaxRefs.current[i] = el; }}
                    className="absolute pointer-events-none"
                    style={{
                        left: m.x,
                        width: m.w,
                        maxWidth: m.maxW,
                        zIndex: m.zIndex,
                        bottom: m.bottom,
                    }}
                >
                    <div
                        ref={el => { entryRefs.current[i] = el; }}
                        className="opacity-0"
                    >
                        {/* drop-shadow static kaldı — animasyondan çıkarıldı */}
                        <div
                            className="absolute inset-x-0 bottom-0 pointer-events-none"
                            style={{
                                height: "45%",
                                background: "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(244,123,32,0.38) 0%, transparent 70%)",
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
                            style={{ filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.65))" }}
                            sizes="(max-width: 768px) 72vw, 860px"
                            // Görünür alanda olan ilk monument'i eager yükle
                            priority={i === 0}
                        />
                    </div>
                </div>
            ))}

            <Image
                ref={bird1Ref}
                src={`${CDN}/marti-2.webp`}
                alt="" aria-hidden
                width={100} height={75}
                className="absolute pointer-events-none select-none h-auto"
                style={{ width: "clamp(58px, 7vw, 100px)", top: "18%", left: "22%", zIndex: 7, opacity: 0 }}
            />
            <Image
                ref={bird2Ref}
                src={`${CDN}/marti-2.webp`}
                alt="" aria-hidden
                width={62} height={47}
                className="absolute pointer-events-none select-none h-auto"
                style={{ width: "clamp(36px, 4vw, 62px)", top: "28%", left: "68%", zIndex: 7, opacity: 0, transform: "scaleX(-1)" }}
            />
        </div>
    );
}