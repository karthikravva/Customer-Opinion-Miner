import React from 'react';

export const GoogleSheetsIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#169c56" d="M37,45H11a4,4,0,0,1-4-4V7A4,4,0,0,1,11,3H29l12,12V41A4,4,0,0,1,37,45Z"/>
        <path fill="#fff" d="M41 15L29 3V15z" opacity=".3"/>
        <path fill="#fff" d="M29,15H41l-6,6H23Z" opacity=".3"/>
        <path fill="#fff" d="M22,23h4v12H22Zm-6,6h4v6H16Zm12-3h4v9H28Z"/>
    </svg>
);