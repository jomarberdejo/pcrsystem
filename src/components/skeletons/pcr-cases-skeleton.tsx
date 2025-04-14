import { Skeleton } from "@/components/ui/skeleton";

export const DataTableSkeleton = () => {
  return (
    <>
      <div className="flex gap-4 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-md" />
        ))}
      </div>
      <div className="border rounded-md p-4 space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded" />
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 items-center">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-6 w-full rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
