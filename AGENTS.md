<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Istanbul EDY 2026 Project Guidelines
- **GSAP & Next.js Entegrasyonu:** Always use `@gsap/react` `useGSAP()` hook over standard `useEffect` to avoid strict-mode double-hydration rendering issues with GSAP and properly manage scope and cleanup. 
- **SSR vs CSR:** Component using GSAP scroll triggers should generally have `"use client";` at the top. Use Dynamic Imports where server-rendering canvas/GSAP fails heavily.
- **Asset Optimization:** Use preload for the Bosphorus video sequence. Store in `/public/videos/`. Max file size 5MB.
- **SVG Map:** Treat SVGs as React components, keeping `<path>` editable using refs/IDs to be bound with ScrollTriggers.
- **Layers & Z-Index:** Implement complex hero/parallax layers using structured CSS classes or tailwind to keep the DOM z-indexes completely under control (e.g., `-z-10`, `z-50`).
- **Responsive Parallax:** Always use percentages (`w-[50%]`, `top-[10%]`), `vh/vw`, or `aspect-ratio` for positioning layers instead of fixed pixel `left/top` values. This ensures elements stay framed on all devices.
- **GSAP MatchMedia for Mobile:** Use GSAP `matchMedia()` to dampen or reduce the animation travel distances (`yPercent` or `y` pixels) on mobile viewports. Reduce `scrub` responsiveness (e.g., `scrub: 1.5`) on small screens to avoid aggressive jumping.
- **Z-Depth Velocity:** Assign slower parallax speeds to background elements (clouds) and higher speeds to foreground elements (flowers/frames) to create deep spatial volume.
