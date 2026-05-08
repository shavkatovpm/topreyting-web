import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
};

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showNumber = true,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: { star: 14, text: "text-xs" },
    md: { star: 16, text: "text-sm" },
    lg: { star: 20, text: "text-base" },
  } as const;

  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const filled = hasHalf ? full + 0.5 : Math.round(rating);

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={sizes[size].star}
            className={cn(
              "transition-colors",
              i <= filled
                ? "fill-gold text-gold"
                : "fill-transparent text-gold/30"
            )}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showNumber && (
        <span className={cn("font-semibold tabular-nums", sizes[size].text)}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground tabular-nums", sizes[size].text)}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
