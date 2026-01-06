import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const NeedsView = ({ data, selectedNeed, setSelectedNeed }) => {
    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Analisi delle Esigenze</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Criticità strutturali identificate</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedNeed ? '1fr 1fr' : '1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.needs.map(need => (
                        <div
                            key={need.id}
                            onClick={() => setSelectedNeed(selectedNeed?.id === need.id ? null : need)}
                            style={{
                                padding: '20px',
                                backgroundColor: selectedNeed?.id === need.id ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                                border: `1px solid ${selectedNeed?.id === need.id ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '6px',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        color: 'var(--text-muted)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        fontFamily: "'JetBrains Mono', monospace"
                                    }}>{need.id}</span>
                                    <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600 }}>{need.title}</h3>
                                </div>
                                <Badge type={need.severity}>{need.severity}</Badge>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{need.description}</p>
                        </div>
                    ))}
                </div>

                {selectedNeed && (
                    <Card title="Dettaglio" subtitle={selectedNeed.title}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Causa Radice</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-orange)' }}>
                                    {selectedNeed.rootCause}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Soluzioni</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {data.solutions.filter(s => s.needIds.includes(selectedNeed.id)).map(sol => (
                                        <div key={sol.id} style={{
                                            padding: '12px',
                                            backgroundColor: 'var(--bg-tertiary)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}>
                                            <span style={{ color: 'var(--accent-green)' }}>💡</span>
                                            <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{sol.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default NeedsView;
