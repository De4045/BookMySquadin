import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface Props {
  value: string;
  className?: string;
  duration?: number;
  start?: string;
}

export function AnimatedCounter({ value, className = "", duration = 2.2, start }: Props) {
  const { ref, display } = useAnimatedCounter(value, duration, "power2.out", start);
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className} aria-label={value}>
      {display}
    </span>
  );
}
