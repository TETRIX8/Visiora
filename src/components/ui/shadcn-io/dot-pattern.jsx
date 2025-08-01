import React from 'react';
import { cn } from '../../../lib/utils';

export const DotPattern = ({ 
  className, 
  cx = 1, 
  cy = 1, 
  cr = 1,
  ...props 
}) => {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80 dark:fill-neutral-600/50",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x="0"
          y="0"
        >
          <circle
            id="pattern-circle"
            cx={cx}
            cy={cy}
            r={cr}
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
    </svg>
  );
};
