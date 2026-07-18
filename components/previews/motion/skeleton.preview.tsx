import { Skeleton } from "@/components/motion/skeleton";

export function SkeletonPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
        <Skeleton className="mt-5 h-32 w-full rounded-xl" />
        <div className="mt-5 flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {["alpha", "beta", "gamma"].map((row) => (
          <div key={row} className="flex items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 w-12 shrink-0" shimmer={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
