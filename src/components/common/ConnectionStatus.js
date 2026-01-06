import React from 'react';

const ConnectionStatus = ({ status, onRetry }) => {
    const statusConfig = {
        connecting: { color: 'var(--accent-orange)', text: 'Connessione...', icon: '🔄' },
        connected: { color: 'var(--accent-green)', text: 'Connesso', icon: '✓' },
        error: { color: 'var(--accent-red)', text: 'Errore', icon: '✗' },
        offline: { color: 'var(--text-muted)', text: 'Offline', icon: '○' },
        saving: { color: 'var(--accent-blue)', text: 'Salvataggio...', icon: '↑' },
        saved: { color: 'var(--accent-green)', text: 'Salvato', icon: '✓' }
    };

    const config = statusConfig[status] || statusConfig.offline;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            fontSize: '12px'
        }}>
            <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: config.color,
                animation: status === 'connecting' || status === 'saving' ? 'pulse 1s infinite' : 'none'
            }} />
            <span style={{ color: 'var(--text-muted)' }}>{config.text}</span>
            {status === 'error' && (
                <button
                    onClick={onRetry}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-blue)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        textDecoration: 'underline'
                    }}
                >
                    Riprova
                </button>
            )}
        </div>
    );
};

export default ConnectionStatus;
