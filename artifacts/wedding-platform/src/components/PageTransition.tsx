import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import gsap from "gsap";

/** Apple-style dark wipe overlay between route changes */
export function PageTransition() {
  const [location] = useLocation();
  const overlayRef  = useRef<HTMLDivElement>(null);
  const isFirst     = useRef(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (isFirst.current) {
      /* On first mount: just do a gentle fade-in entrance */
      isFirst.current = false;
      gsap.fromTo(overlay,
        { opacity: 1 },
        { opacity: 0, duration: 0.55, ease: "power2.out", delay: 0.05,
          onComplete: () => { overlay.style.pointerEvents = "none"; } }
      );
      return;
    }

    /* On subsequent navigations: flash in → flash out */
    overlay.style.pointerEvents = "auto";
    gsap.timeline()
      .fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: "power2.in" }
      )
      .to(overlay,
        { opacity: 0, duration: 0.38, ease: "power2.out", delay: 0.05,
          onComplete: () => { overlay.style.pointerEvents = "none"; } }
      );
  }, [location]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     8500,
        background: "#080604",
        opacity:    1,
        pointerEvents: "auto",
      }}
    />
  );
}
