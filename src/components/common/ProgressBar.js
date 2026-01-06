import React from 'react';

const ProgressBar = ({ value, max, color = 'var(--accent-blue)' }) => (
    <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '3px',
        overflow: 'hidden'
    }}>
        <div style={{
            width: `${Math.min((value / max) * 100, 100)}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '3px',
            transition: 'width 0.5s ease'
        }} />
    </div>
);

export default ProgressBar;
