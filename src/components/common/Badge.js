import React from 'react';

const severityColors = {
    critical: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
    high: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
    medium: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
    low: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' }
};

const statusColors = {
    'not-started': { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
    'in-progress': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
    'completed': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    'at-risk': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
    'pending': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }
};

const Badge = ({ children, type = 'default', size = 'sm' }) => {
    const colors = severityColors[type] || statusColors[type] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: size === 'sm' ? '2px 8px' : '4px 12px',
            fontSize: size === 'sm' ? '11px' : '12px',
            fontWeight: 500,
            borderRadius: '4px',
            backgroundColor: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: "'JetBrains Mono', monospace"
        }}>
            {children}
        </span>
    );
};

export default Badge;
