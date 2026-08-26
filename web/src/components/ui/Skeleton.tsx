interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', rounded = 'md', style }: SkeletonProps) {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div style={style} className={`skeleton ${roundedMap[rounded]} ${className}`} />
  );
}

// Stats Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Skeleton className="w-8 h-8 sm:w-10 sm:h-10" rounded="lg" />
        <div className="space-y-1.5">
          <Skeleton className="w-16 sm:w-20 h-3" />
          <Skeleton className="w-10 sm:w-14 h-5" />
        </div>
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 p-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

// Card List Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" rounded="lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
        <Skeleton className="w-16 h-6" rounded="full" />
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
      <Skeleton className="w-10 h-10 shrink-0" rounded="lg" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-48 h-3" />
      </div>
      <Skeleton className="w-14 h-6" rounded="full" />
    </div>
  );
}

// Detail Page Skeleton
export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16" rounded="full" />
        <div className="space-y-2">
          <Skeleton className="w-36 h-5" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-28 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <Skeleton className="w-32 h-5 mb-4" />
      <div className="flex items-end gap-1 h-32 sm:h-48">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${30 + Math.random() * 70}%` }} />
        ))}
      </div>
    </div>
  );
}

// Tab Content Skeleton
export function TabContentSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="p-3 sm:p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

// Full Page Skeleton
export function PageSkeleton({ type = 'list' }: { type?: 'list' | 'grid' | 'detail' | 'dashboard' }) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-48 h-3" />
        </div>
        <DashboardStatsSkeleton />
        <ChartSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-4">
        <DetailSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-24 h-8" rounded="lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-48 h-8" rounded="lg" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <TabContentSkeleton rows={5} />
      </div>
    </div>
  );
}
