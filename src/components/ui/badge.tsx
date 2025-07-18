import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info:
          "border-transparent bg-info text-info-foreground hover:bg-info/80",
        nigerian:
          "border-transparent bg-nigerian-green text-nigerian-white hover:bg-nigerian-green/80",
        nollywood:
          "border-transparent bg-nollywood-gold text-foreground hover:bg-nollywood-gold/80",
        genre:
          "border-border bg-muted text-muted-foreground hover:bg-muted/80",
        rating:
          "border-transparent bg-gradient-to-r from-primary to-nollywood-gold text-white font-bold",
        gradient:
          "border-transparent bg-gradient-to-r from-primary via-nollywood-gold to-primary text-white font-medium",
        "gradient-gold":
          "border-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 