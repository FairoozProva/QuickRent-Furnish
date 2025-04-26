import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = "bg-primary-600", 
  height = "sm",
  className 
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };
  
  return (
    <div className={cn("w-full bg-neutral-200 rounded-full", heightClasses[height], className)}>
      <div
        className={cn("rounded-full", color, heightClasses[height])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
