import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

const DashboardView = ({ data, updateObjectiveStatus }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Objectives */}
                <Card title="Obiettivi Strategici 2026" subtitle="Clicca per aggiornare lo stato">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {data.project.objectives2026.map(obj => (
                            <div key={obj.id} style={{
                                padding: '16px',
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${obj.status === 'at-risk' ? 'var(--accent-red)' : obj.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)'}`,
                                cursor: 'pointer'
                            }}
                                onClick={() => {
                                    const statuses = ['pending', 'in-progress', 'at-risk', 'completed'];
                                    const currentIdx = statuses.indexOf(obj.status);
                                    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                                    updateObjectiveStatus(obj.id, nextStatus);
                                }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>{obj.name}</h4>
                                    <Badge type={obj.status}>{obj.status}</Badge>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Scadenza: {obj.deadline}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Phases */}
                <Card title="Fasi del Progetto" subtitle={`${data.project.totalDays} giornate pianificate`}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.phases.map((phase, idx) => {
                            const completedTasks = phase.tasks.filter(t => t.status === 'completed').length;
                            return (
                                <div key={phase.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '40px 1fr 100px 120px',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        backgroundColor: phase.status === 'completed' ? 'var(--accent-green-dim)' : 'var(--accent-blue-dim)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: phase.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-blue)',
                                        fontWeight: 700,
                                        fontSize: '14px'
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{phase.name}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{phase.days} giorni • {phase.tasks.length} task</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{completedTasks}/{phase.tasks.length}</p>
                                        <ProgressBar value={completedTasks} max={phase.tasks.length} />
                                    </div>
                                    <Badge type={phase.status}>{phase.status}</Badge>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Activity Log */}
            <Card title="Attività Recenti" subtitle="Ultime modifiche sincronizzate">
                {data.activityLog.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                        Nessuna attività registrata
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                        {data.activityLog.slice(0, 10).map((log, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: '6px'
                            }}>
                                <span style={{ fontSize: '14px' }}>
                                    {log.type === 'task_update' ? '✅' : log.type === 'objective_update' ? '🎯' : '📊'}
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', flex: 1 }}>{log.message}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
                                    {new Date(log.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DashboardView;
