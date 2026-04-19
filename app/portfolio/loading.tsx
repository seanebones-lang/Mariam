import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <div className="h-3 w-16 mbb-skeleton" />
      <div className="mt-3 h-9 w-48 mbb-skeleton" />
      <div className="mt-4 h-3 w-3/4 max-w-md mbb-skeleton" />
      <div className="mt-10 grid grid-cols-2 gap-1.5 sm:mt-12 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}
