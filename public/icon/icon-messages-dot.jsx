import React from 'react';

const IconMessagesDot = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M3 3H21V21H3V3Z" fill="currentColor" />
            <path d="M3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15Z" fill="currentColor" opacity="0.5" />
            <path d="M5 19H11V17H5V19ZM13 19H19V17H13V19Z" fill="currentColor" />
        </svg>
    );
};

export default IconMessagesDot;
