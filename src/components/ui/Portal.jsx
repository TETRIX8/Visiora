import React from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  const [container] = React.useState(() => {
    // Create a div element that will be mounted at the end of the document body
    const div = document.createElement('div');
    div.setAttribute('data-portal-container', '');
    return div;
  });

  React.useEffect(() => {
    // Append the container to body when the component mounts
    document.body.appendChild(container);
    
    // Remove the container from body when the component unmounts
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  // Create a portal to render children into the container
  return createPortal(children, container);
}
