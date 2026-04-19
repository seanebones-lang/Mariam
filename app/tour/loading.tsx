import { Skeleton } from "@/components/ui/skeleton";

export default function TourLoading() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <div className="h-3 w-20 mbb-skeleton" />
      <div className="mt-3 h-9 w-56 mbb-skeleton" />
      <ul className="mt-10 space-y-3 sm:space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-24 w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
