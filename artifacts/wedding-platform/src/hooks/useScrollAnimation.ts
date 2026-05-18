import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationType = "fadeUp" | "fadeIn" | "imageReveal" | "textMask" | "slideLeft" | "slideRight" | "scaleIn";

interface ScrollAnimationOptions {
  type?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      type = "fadeUp",
      delay = 0,
      duration = 0.9,
      distance = 48,
      stagger = 0,
      start = "top 88%",
      once = true,
    } = options;

    let ctx: gsap.Context;

    ctx = gsap.context(() => {
      const targets = stagger > 0 ? Array.from(el.children) : [el];

      const fromVars: gsap.TweenVars = { immediateRender: true };
      const toVars: gsap.TweenVars = {
        duration,
        delay,
        ease: "power3.out",
        stagger: stagger || undefined,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      };

      switch (type) {
        case "fadeUp":
          fromVars.opacity = 0;
          fromVars.y = distance;
          toVars.opacity = 1;
          toVars.y = 0;
          break;

        case "fadeIn":
          fromVars.opacity = 0;
          toVars.opacity = 1;
          break;

        case "slideLeft":
          fromVars.opacity = 0;
          fromVars.x = distance;
          toVars.opacity = 1;
          toVars.x = 0;
          break;

        case "slideRight":
          fromVars.opacity = 0;
          fromVars.x = -distance;
          toVars.opacity = 1;
          toVars.x = 0;
          break;

        case "scaleIn":
          fromVars.opacity = 0;
          fromVars.scale = 0.88;
          toVars.opacity = 1;
          toVars.scale = 1;
          break;

        case "imageReveal": {
          const clipEl = el as HTMLElement;
          gsap.set(clipEl, {
            clipPath: "inset(100% 0% 0% 0%)",
            webkitClipPath: "inset(100% 0% 0% 0%)",
          });
          toVars.clipPath = "inset(0% 0% 0% 0%)";
          toVars.webkitClipPath = "inset(0% 0% 0% 0%)";
          toVars.ease = "power4.inOut";
          toVars.duration = duration * 1.2;
          gsap.fromTo(clipEl, {}, toVars);
          return;
        }

        case "textMask": {
          const lines = Array.from(el.querySelectorAll<HTMLElement>("[data-line]"));
          const animTargets = lines.length > 0 ? lines : [el];
          animTargets.forEach((line, i) => {
            gsap.set(line, { overflow: "hidden" });
            const inner = line.querySelector<HTMLElement>("[data-line-inner]") ?? line;
            gsap.fromTo(
              inner,
              { y: "110%", opacity: 0 },
              {
                y: "0%",
                opacity: 1,
                duration: duration * 0.85,
                delay: delay + i * 0.1,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: el,
                  start,
                  toggleActions: once ? "play none none none" : "play reverse play reverse",
                },
              }
            );
          });
          return;
        }
      }

      gsap.fromTo(targets, fromVars, toVars);
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions & { childSelector?: string } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      type = "fadeUp",
      delay = 0,
      duration = 0.7,
      distance = 36,
      stagger = 0.12,
      start = "top 85%",
      once = true,
      childSelector,
    } = options;

    const ctx = gsap.context(() => {
      const children = childSelector
        ? Array.from(el.querySelectorAll<HTMLElement>(childSelector))
        : Array.from(el.children as HTMLCollectionOf<HTMLElement>);

      if (children.length === 0) return;

      const fromVars: gsap.TweenVars = { immediateRender: true };
      const toVars: gsap.TweenVars = {
        duration,
        delay,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      };

      if (type === "fadeUp") {
        fromVars.opacity = 0; fromVars.y = distance;
        toVars.opacity = 1;   toVars.y = 0;
      } else if (type === "scaleIn") {
        fromVars.opacity = 0; fromVars.scale = 0.9;
        toVars.opacity = 1;   toVars.scale = 1;
      } else {
        fromVars.opacity = 0;
        toVars.opacity = 1;
      }

      gsap.fromTo(children, fromVars, toVars);
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
