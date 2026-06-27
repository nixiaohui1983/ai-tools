import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  count?: number;
}

export default function Skeleton({
  className,
  variant = "text",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

  const variantClass = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl",
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={twMerge(baseClass, variantClass[variant], className)}
      style={{ width, height }}
    />
  ));

  return <>{items}</>;
}

// Pre-built skeleton layouts
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 space-y-4">
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton count={2} />
      <Skeleton width="60%" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" />
            <Skeleton width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center">
      <Skeleton
        variant="circular"
        width={300}
        height={300}
        className="!animate-pulse opacity-30"
      />
    </div>
  );
}
