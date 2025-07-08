import { Card } from "@/components/ui/card";

interface MovieSkeletonProps {
  viewMode: string;
  count?: number;
}

function SingleMovieSkeleton({ viewMode }: { viewMode: string }) {
  if (viewMode === "landscape") {
    return (
      <Card className="overflow-hidden">
        <div className="flex animate-pulse">
          <div className="w-32 h-48 bg-muted flex-shrink-0" />
          <div className="p-4 flex-1 space-y-3">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <div className="aspect-[3/4] bg-muted" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    </Card>
  );
}

export function MovieSkeleton({ viewMode, count = 12 }: MovieSkeletonProps) {
  return (
    <div className={`grid gap-4 ${
      viewMode === "grid" 
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    }`}>
      {Array.from({ length: count }, (_, i) => (
        <SingleMovieSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
} 