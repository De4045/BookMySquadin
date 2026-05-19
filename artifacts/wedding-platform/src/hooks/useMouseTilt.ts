import { useEffect, useRef } from "react";

interface TiltOptions {
  max?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
}

export function useMouseTilt<T extends HTMLElement = HTMLDivElement>(
  options: TiltOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { max = 7, scale = 1.025, speed = 500, glare = true } = options;

    let glareEl: HTMLDivElement | null = null;
    if (glare) {
      glareEl = document.createElement("div");
      glareEl.className = "tilt-glare";
      el.style.position = "relative";
      el.appendChild(glareEl);
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      const rotX = -y * max;
      const rotY =  x * max;
      el.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      el.style.transition = `transform ${speed}ms cubic-bezier(0.03,0.98,0.52,0.99)`;
      if (glareEl) {
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        glareEl.style.background = `linear-gradient(${angle}deg, rgba(212,175,55,0.13) 0%, transparent 70%)`;
        glareEl.style.opacity = "1";
      }
    };

    const onLeave = () => {
      el.style.transform  = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      el.style.transition = `transform 900ms cubic-bezier(0.23,1,0.32,1)`;
      if (glareEl) glareEl.style.opacity = "0";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (glareEl && el.contains(glareEl)) el.removeChild(glareEl);
    };
  }, []);

  return ref;
}
