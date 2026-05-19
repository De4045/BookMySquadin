import { useEffect, useRef, createElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
  duration?: number;
  stagger?: number;
  mode?: "chars" | "words";
  trigger?: string;
}

export function AnimatedText({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  duration = 0.75,
  stagger = 0.03,
  mode = "words",
  trigger = "top 88%",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const units = mode === "chars" ? children.split("") : children.split(" ");
    const sep   = mode === "chars" ? "" : " ";

    el.innerHTML = units
      .map(
        (u) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15em"><span class="at-inner" style="display:inline-block">${
            u === " " ? "&nbsp;" : u
          }</span></span>`
      )
      .join(sep);

    const inners = el.querySelectorAll<HTMLElement>(".at-inner");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { y: "115%", opacity: 0, rotateZ: 2 },
        {
          y: "0%",
          opacity: 1,
          rotateZ: 0,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: trigger,
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children]);

  return createElement(Tag, { ref, className });
}
