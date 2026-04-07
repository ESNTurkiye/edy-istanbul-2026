import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lato } from "next/font/google";
import "./globals.css";
import Footer from "@/components/global/Footer";
import SmoothScroll from "@/context/SmoothScroll";

const kelsonSans = localFont({
    src: [
        {
            path: "../../public/fonts/KelsonSans-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/fonts/KelsonSans-Normal.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/KelsonSans-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-kelson-sans",
    display: "swap",
});

const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "Istanbul EDY 2026",
    description: "Erasmus Destination Year Istanbul",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${kelsonSans.variable} ${lato.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black font-sans">
                <SmoothScroll>
                    {children}
                    <Footer />
                </SmoothScroll>
            </body>
        </html>
    );
}
