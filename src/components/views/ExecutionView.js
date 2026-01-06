import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ExecutionView = ({ data, updateTaskStatus }) => {
    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Piano di Esecuzione</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{data.project.totalDays} giornate • Clicca sui task per aggiornare</p>
            </div>

            {data.phases.map((phase, phaseIdx) => {
                const completedTasks = phase.tasks.filter(t => t.status === 'completed').length;

                return (
                    <Card key={phase.id} title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: phase.status === 'completed' ? 'var(--accent-green-dim)' : phase.status === 'in-progress' ? 'var(--accent-blue-dim)' : 'var(--bg-tertiary)',
                                color: phase.status === 'completed' ? 'var(--accent-green)' : phase.status === 'in-progress' ? 'var(--accent-blue)' : 'var(--text-muted)',
                                fontSize: '14px',
                                fontWeight: 700
                            }}>F{phaseIdx + 1}</span>
                            <span>{phase.name}</span>
                        </div>
                    } subtitle={`${phase.days} giorni • ${completedTasks}/${phase.tasks.length} completati`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {phase.tasks.map(task => (
                                <div key={task.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto auto',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '14px 16px',
                                    backgroundColor: task.status === 'completed' ? 'rgba(16, 185, 129, 0.05)' : task.status === 'in-progress' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-tertiary)',
                                    borderRadius: '8px',
                                    border: `1px solid ${task.status === 'completed' ? 'var(--accent-green-dim)' : task.status === 'in-progress' ? 'var(--accent-blue-dim)' : 'var(--border-subtle)'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button
                                            onClick={() => {
                                                const newStatus = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
                                                updateTaskStatus(phase.id, task.id, newStatus);
                                            }}
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '6px',
                                                border: `2px solid ${task.status === 'completed' ? 'var(--accent-green)' : task.status === 'in-progress' ? 'var(--accent-blue)' : 'var(--border-medium)'}`,
                                                backgroundColor: task.status === 'completed' ? 'var(--accent-green)' : 'transparent',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {task.status === 'completed' && '✓'}
                                            {task.status === 'in-progress' && <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--accent-blue)' }} />}
                                        </button>
                                        <p style={{
                                            color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                                            fontSize: '14px',
                                            textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                                        }}>{task.name}</p>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{task.hours}h</span>
                                    <Badge type={task.status} size="sm">{task.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default ExecutionView;
