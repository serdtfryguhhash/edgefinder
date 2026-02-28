import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent/10 text-accent",
        secondary: "border-transparent bg-secondary/10 text-secondary-400",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        outline: "border-white/10 text-muted-foreground",
        success: "border-transparent bg-accent/10 text-accent",
        warning: "border-transparent bg-yellow-500/10 text-yellow-500",
        premium: "border-transparent bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-500",
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
