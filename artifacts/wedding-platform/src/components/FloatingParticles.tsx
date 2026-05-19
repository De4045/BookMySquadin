import { useMemo } from "react";

interface Particle {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     `${5 + ((i * 37 + 13) % 90)}%`,
      size:     1 + (i % 3),
      delay:    `${(i * 1.3) % 12}s`,
      duration: `${14 + (i % 10)}s`,
      opacity:  0.15 + (i % 5) * 0.07,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-primary particle-float"
          style={{
            left:            p.left,
            bottom:          "-10px",
            width:           `${p.size}px`,
            height:          `${p.size}px`,
            opacity:         p.opacity,
            animationDelay:  p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
