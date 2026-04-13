import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
                pathname: "/gh/ESNTurkiye/**",
            },
        ],
    },
};

export default nextConfig;
