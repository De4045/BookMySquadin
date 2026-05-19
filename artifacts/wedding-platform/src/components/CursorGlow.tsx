import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const pos      = useRef({ x: -200, y: -200 });
  const ringPos  = useRef({ x: -200, y: -200 });
  const raf      = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
      }
      if (trailRef.current) {
        trailRef.current.style.left = e.clientX + "px";
        trailRef.current.style.top  = e.clientY + "px";
      }
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    const INTERACTIVE = 'a,button,input,select,label,textarea,[role="button"],[data-cursor]';
    const onOver = (e: Event) => {
      if ((e.target as Element).closest(INTERACTIVE)) setHovering(true);
    };
    const onOut = (e: Event) => {
      if ((e.target as Element).closest(INTERACTIVE)) setHovering(false);
    };

    const tick = () => {
      const ease = 0.095;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * ease;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px,${ringPos.current.y}px,0) translate(-50%,-50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={trailRef}
        aria-hidden="true"
        className="cursor-trail hidden lg:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={[
          "cursor-ring hidden lg:block",
          hovering ? "cursor-ring--hover" : "",
          clicking ? "cursor-ring--click" : "",
        ].join(" ")}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className={[
          "cursor-dot hidden lg:block",
          hovering ? "cursor-dot--hover" : "",
        ].join(" ")}
      />
    </>
  );
}
