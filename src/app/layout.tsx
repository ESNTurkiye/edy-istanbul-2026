import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Footer from "@/components/global/Footer";
import SmoothScroll from "@/context/SmoothScroll";

const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbul.esnturkiye.org"),
    title: "Istanbul · Erasmus Destination of the Year 2026",
    description: "ESN Türkiye invites Europe to Istanbul. Two continents, one welcome — vote for Istanbul at EGM Split.",
    openGraph: {
        title: "Istanbul · Erasmus Destination of the Year 2026",
        description: "ESN Türkiye invites Europe to Istanbul. Two continents, one welcome — vote for Istanbul at EGM Split.",
        images: [{ url: "/og.png", width: 1200, height: 630, alt: "Istanbul — Erasmus Destination of the Year 2026" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Istanbul · Erasmus Destination of the Year 2026",
        description: "ESN Türkiye invites Europe to Istanbul. Two continents, one welcome — vote for Istanbul at EGM Split.",
        images: ["/og.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${lato.variable} h-full antialiased`}
        >
            <head>
                {/* Preconnect to external asset origins */}
                <link rel="preconnect" href="https://cdn.jsdelivr.net" />
                <link rel="preconnect" href="https://unpkg.com" />
                <link rel="preconnect" href="https://basemaps.cartocdn.com" />
                {/* DNS prefetch for tile subdomains */}
                <link rel="dns-prefetch" href="https://a.basemaps.cartocdn.com" />
                <link rel="dns-prefetch" href="https://b.basemaps.cartocdn.com" />
                <link rel="dns-prefetch" href="https://c.basemaps.cartocdn.com" />
            </head>
            <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black font-sans">
                <SmoothScroll>
                    {children}
                    <Footer />
                </SmoothScroll>
            </body>
        </html>
    );
}
