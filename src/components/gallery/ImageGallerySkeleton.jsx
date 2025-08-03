import React from 'react';
import { cn } from '../../utils/cn';

const ImageSkeletonCard = ({ className }) => (
  <div className={cn("break-inside-avoid mb-4 rounded-xl overflow-hidden", className)}>
    <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 animate-pulse" />
    <div className="p-3 bg-white dark:bg-slate-900 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md w-1/2" />
    </div>
  </div>
);

const ImageGallerySkeleton = ({ count = 8 }) => {
  // Distribute skeleton cards across columns
  const itemsPerColumn = Math.ceil(count / 4);
  const columns = [
    Array(itemsPerColumn).fill(0).map((_, i) => i),
    Array(itemsPerColumn).fill(0).map((_, i) => i + itemsPerColumn),
    Array(itemsPerColumn).fill(0).map((_, i) => i + itemsPerColumn * 2),
    Array(itemsPerColumn).fill(0).map((_, i) => i + itemsPerColumn * 3)
  ];

  return (
    <div className="flex w-auto -ml-4">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="pl-4 bg-clip-padding flex-1">
          {column.map((idx) => {
            if (idx < count) {
              return (
                <ImageSkeletonCard 
                  key={idx} 
                  className={idx % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"} 
                />
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default ImageGallerySkeleton;
