import { Skeleton } from "@/components/ui/skeleton";

export const FormsSkeleton = () => {
  const items = Array.from({ length: 20 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((_, index) => (
        <div key={index} className="flex flex-col gap-1">
          <Skeleton className="w-[100px] h-4" />
          <Skeleton
            className={`w-full rounded-md ${
              index >= items.length - 1 ? "h-24" : "h-10"
            }`}
          />
        </div>
      ))}
    </div>
  );
};
