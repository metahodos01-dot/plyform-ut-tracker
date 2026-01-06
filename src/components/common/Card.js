import React from 'react';

const Card = ({ children, title, subtitle, actions, noPadding = false }) => (
    <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden'
    }}>
        {(title || actions) && (
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    {title && <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, marginBottom: subtitle ? '4px' : 0 }}>{title}</h3>}
                    {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{subtitle}</p>}
                </div>
                {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
            </div>
        )}
        <div style={{ padding: noPadding ? 0 : '20px' }}>
            {children}
        </div>
    </div>
);

export default Card;
