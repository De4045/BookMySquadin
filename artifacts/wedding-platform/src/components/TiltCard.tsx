import { useMouseTilt } from "@/hooks/useMouseTilt";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
  speed?: number;
}

export function TiltCard({
  children,
  className = "",
  max = 6,
  scale = 1.02,
  glare = true,
  speed = 500,
}: TiltCardProps) {
  const ref = useMouseTilt<HTMLDivElement>({ max, scale, glare, speed });
  return (
    <div ref={ref} className={`tilt-card-wrap ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
