import React from 'react';
import AnimatedBackground from './AnimatedBackground';

let renderCount = 0;

const MemoizedBackground = React.memo(() => {
  renderCount++;
  if (import.meta.env.DEV) {
    console.log(`🎨 MemoizedBackground render #${renderCount}`);
  }

  return <AnimatedBackground />;
}, () => {
  // Never re-render this wrapper
  if (import.meta.env.DEV) {
    console.log('🚫 MemoizedBackground re-render blocked');
  }
  return true;
});

MemoizedBackground.displayName = 'MemoizedBackground';

export default MemoizedBackground;