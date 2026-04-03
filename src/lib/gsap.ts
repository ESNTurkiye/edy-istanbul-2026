import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure this only runs on the client side to avoid SSR issues
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export * from "gsap";
export * from "@gsap/react";
export { ScrollTrigger };
