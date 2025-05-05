import { cn } from "@/lib/utils";

type SentimentType = "positive" | "neutral" | "negative";

interface SentimentBadgeProps {
  sentiment: SentimentType;
  className?: string;
}


const sentimentClasses: Record<SentimentType, string> = {
  positive: "bg-green-100 border-left-green-500 text-green-700",
  neutral: "bg-neutral-100 border-left-neutral-500 text-neutral-700",
  negative: "bg-red-100 border-left-red-500 text-red-700",
};

const sentimentIcons: Record<SentimentType, string> = {
  positive: "sentiment_very_satisfied",
  neutral: "sentiment_neutral",
  negative: "sentiment_very_dissatisfied",
};

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
        sentiment === "positive" && "bg-green-100 text-green-700",
        sentiment === "neutral" && "bg-neutral-100 text-neutral-700",
        sentiment === "negative" && "bg-red-100 text-red-700",
      )}>
        <span className="i-material-icons text-sm">{sentimentIcons[sentiment]}</span>
      </div>
    </div>
  );
}

export function SentimentContainer({ sentiment, className, children }: SentimentBadgeProps & { children: React.ReactNode }) {
  return (
    <div className={cn(
      "p-6",
      sentiment === "positive" && "sentiment-positive",
      sentiment === "neutral" && "sentiment-neutral",
      sentiment === "negative" && "sentiment-negative",
      className
    )}>
      {children}
    </div>
  );
}
