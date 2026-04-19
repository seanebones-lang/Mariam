import { Skeleton } from "@/components/ui/skeleton";

export default function FlashLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <div className="h-3 w-16 mbb-skeleton" />
      <div className="mt-3 h-9 w-48 mbb-skeleton" />
      <div className="mt-4 h-3 w-3/4 max-w-md mbb-skeleton" />
      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-bone/10 bg-char">
            <Skeleton className="aspect-square" />
            <div className="space-y-3 p-4 sm:p-5">
              <div className="h-5 w-2/3 mbb-skeleton" />
              <div className="h-3 w-1/2 mbb-skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
