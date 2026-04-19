import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("mbb-skeleton border border-bone/10 bg-ink/30", className)}
    />
  );
}
