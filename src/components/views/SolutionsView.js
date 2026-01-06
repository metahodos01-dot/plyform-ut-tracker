import React from 'react';
import Card from '../common/Card';

const SolutionsView = ({ data }) => {
    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Piano delle Soluzioni</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Interventi strategici</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {data.solutions.map(solution => (
                    <Card key={solution.id} title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--accent-blue-dim)',
                                color: 'var(--accent-blue)',
                                fontSize: '11px',
                                fontWeight: 600,
                                fontFamily: "'JetBrains Mono', monospace"
                            }}>{solution.id}</span>
                            {solution.title}
                        </div>
                    }>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{solution.description}</p>

                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Risolve</p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {solution.needIds.map(nid => (
                                        <span key={nid} style={{
                                            padding: '4px 10px',
                                            backgroundColor: 'var(--bg-primary)',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid var(--border-subtle)'
                                        }}>
                                            {nid}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {solution.benefits && solution.benefits.length > 0 && (
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Benefici</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {solution.benefits.map((benefit, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: 'var(--accent-green)', fontSize: '12px' }}>✓</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SolutionsView;
