"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { QUOTES } from "./prideData";
import styles from "./Pride.module.css";

export default function LiteratureStrip() {
    const stripRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const strip = stripRef.current;
        if (!strip || isVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                setIsVisible(true);
                observer.disconnect();
            },
            { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
        );

        observer.observe(strip);
        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <div ref={stripRef} className={styles.literatureStrip}>
            <div className="text-center mb-8">
                <span className={styles.literatureBadge}>
                    Istanbul in Literature
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {QUOTES.map((q, i) => (
                    <div
                        key={i}
                        className={`${styles.quoteCard} ${styles.revealSide} ${isVisible ? styles.revealVisible : ""}`}
                        style={{
                            "--quote-accent": q.accent,
                            "--quote-accent-25": `${q.accent}25`,
                            "--quote-accent-30": `${q.accent}30`,
                            "--reveal-delay": `${0.08 + i * 0.14}s`,
                        } as CSSProperties}
                    >
                        <div className={styles.quoteMark}>
                            &ldquo;
                        </div>
                        <p className={styles.quoteText}>
                            {q.quote}
                        </p>
                        <div>
                            <div className={styles.quoteAuthor}>
                                {q.author}
                            </div>
                            <div className={styles.quoteWork}>
                                {q.work}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
