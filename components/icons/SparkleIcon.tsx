import React from 'react';

export const SparkleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.75l.93 1.9l1.9.93l-1.9.93l-.93 1.9l-.93-1.9l-1.9-.93l1.9-.93l.93-1.9Z"/>
      <path d="M4.5 9.5l.66 1.34l1.34.66l-1.34.66l-.66 1.34l-.66-1.34L3.5 11.5l1.34-.66L4.5 9.5Z"/>
      <path d="M19.5 9.5l.66 1.34l1.34.66l-1.34.66l-.66 1.34l-.66-1.34l-1.34-.66l1.34-.66l.66-1.34Z"/>
      <path d="M12 15.75l.93 1.9l1.9.93l-1.9.93l-.93 1.9l-.93-1.9l-1.9-.93l1.9-.93l.93-1.9Z"/>
    </svg>
);