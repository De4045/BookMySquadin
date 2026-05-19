import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  speed?: number;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  axis?: "y" | "x";
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      speed = -0.25,
      scrub = 1.8,
      start = "top bottom",
      end   = "bottom top",
      axis  = "y",
    } = options;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        [axis === "y" ? "yPercent" : "xPercent"]: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
