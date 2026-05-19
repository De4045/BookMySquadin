import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      aria-hidden="true"
    />
  );
}
