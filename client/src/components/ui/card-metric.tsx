import { Card, CardContent } from "@/components/ui/card";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardMetricProps extends ComponentProps<typeof Card> {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  changeValue?: string | number;
  changeDirection?: "up" | "down" | "neutral";
  className?: string;
}


export function CardMetric({
  title,
  value,
  icon,
  iconBgColor = "bg-primary-50",
  changeValue,
  changeDirection = "neutral",
  className,
  ...props
}: CardMetricProps) {
  const directionColorMap = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-neutral-600",
  };
  
  const directionIconMap = {
    up: "arrow_upward",
    down: "arrow_downward",
    neutral: "trending_flat",
  };
  
  return (
    <Card className={cn("shadow-sm border border-neutral-200", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-neutral-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{value}</h3>
          </div>
          <div className={cn("p-2 rounded-md", iconBgColor)}>
            {icon}
          </div>
        </div>
        {changeValue && (
          <div className="flex items-center">
            <span className={cn("font-medium text-sm flex items-center", directionColorMap[changeDirection])}>
              <span className="i-material-icons text-sm mr-1">{directionIconMap[changeDirection]}</span>
              {changeValue}
            </span>
            <span className="text-neutral-500 text-sm ml-2">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
