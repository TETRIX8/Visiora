import React from 'react';
import AnimatedBackground from './AnimatedBackground';

const MemoizedBackground = React.memo(() => {
  return <AnimatedBackground />;
});

export default MemoizedBackground;