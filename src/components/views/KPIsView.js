import React from 'react';
import Card from '../common/Card';

const KPIsView = ({ data, updateKPIValue }) => {
    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Indicatori di Performance</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Clicca sui valori per aggiornarli</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {Object.entries(data.kpis).map(([category, kpis]) => (
                    <Card key={category} title={`KPI ${category === 'process' ? 'Processo' : category === 'quality' ? 'Qualità' : 'Progetto'}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {kpis.map(kpi => (
                                <div key={kpi.id} style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{kpi.name}</span>
                                        <span style={{ color: 'var(--accent-blue)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{kpi.target}</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Inserisci valore..."
                                        value={kpi.current || ''}
                                        onChange={(e) => updateKPIValue(category, kpi.id, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            backgroundColor: 'var(--bg-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '4px',
                                            color: 'var(--text-primary)',
                                            fontSize: '12px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default KPIsView;
