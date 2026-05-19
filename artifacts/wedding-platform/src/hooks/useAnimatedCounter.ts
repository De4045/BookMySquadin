import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParsedValue {
  value: number;
  prefix: string;
  suffix: string;
  useCommas: boolean;
}

function parse(raw: string): ParsedValue {
  const cleaned = raw.replace(/,/g, "");
  const match   = cleaned.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/);
  if (!match) return { value: 0, prefix: "", suffix: raw, useCommas: false };
  return {
    prefix: match[1],
    value:  parseFloat(match[2]),
    suffix: match[3],
    useCommas: raw.includes(","),
  };
}

function fmt(n: number, parsed: ParsedValue): string {
  const rounded = Math.round(n);
  const numStr  = parsed.useCommas
    ? rounded.toLocaleString("en-IN")
    : String(rounded);
  return parsed.prefix + numStr + parsed.suffix;
}

export function useAnimatedCounter(
  raw: string,
  duration = 2.2,
  ease = "power2.out",
  start = "top 88%"
) {
  const ref     = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState("0" + parse(raw).suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parse(raw);
    const proxy  = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: parsed.value,
        duration,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
        onUpdate() { setDisplay(fmt(proxy.val, parsed)); },
        onComplete() { setDisplay(fmt(parsed.value, parsed)); },
      });
    }, el);

    return () => ctx.revert();
  }, [raw]);

  return { ref, display };
}
