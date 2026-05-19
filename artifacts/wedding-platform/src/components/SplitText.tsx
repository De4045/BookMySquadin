import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SplitMode = "chars" | "words";
type AnimMode  = "scroll" | "load";

interface SplitTextProps {
  text: string;
  className?: string;
  mode?: SplitMode;
  anim?: AnimMode;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  /** y distance in % units */
  distance?: number;
  once?: boolean;
}

export function SplitText({
  text,
  className = "",
  mode = "chars",
  anim = "scroll",
  delay = 0,
  stagger = 0.022,
  duration = 0.75,
  start = "top 92%",
  distance = 110,
  once = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const tokens: string[] = mode === "words"
    ? text.split(/(\s+)/)
    : text.split("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-split-unit]"));
    if (spans.length === 0) return;

    const ctx = gsap.context(() => {
      const st = anim === "scroll"
        ? { trigger: el, start, toggleActions: once ? "play none none none" : "play reverse play reverse" }
        : undefined;

      gsap.fromTo(
        spans,
        { y: `${distance}%`, opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration,
          delay: anim === "load" ? delay : 0,
          stagger,
          ease: "power4.out",
          scrollTrigger: st,
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={i} style={{ display: "inline-block", width: mode === "words" ? "0.3em" : undefined }}>&nbsp;</span>;
        }
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", lineHeight: "1.15", verticalAlign: "bottom" }}
          >
            <span data-split-unit style={{ display: "inline-block" }}>
              {token}
            </span>
          </span>
        );
      })}
    </span>
  );
}
