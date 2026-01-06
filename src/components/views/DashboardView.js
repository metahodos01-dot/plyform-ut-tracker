import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

const DashboardView = ({ data, updateObjectiveStatus, addTeamMember, deleteTeamMember }) => {
    const [newMember, setNewMember] = useState({ name: '', role: '' });

    const handleAddMember = () => {
        if (newMember.name && newMember.role) {
            addTeamMember(newMember);
            setNewMember({ name: '', role: '' });
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>

            {/* 🍌 NANO BANANA VISION SECTION 🍌 */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '32px',
                borderLeft: '6px solid var(--accent-banana)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        backgroundColor: 'var(--accent-banana)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: 'bold', color: '#000'
                    }}>🍌</div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            Vision: Trasformazione Ufficio Tecnico
                        </h2>
                        <p style={{ color: 'var(--accent-banana)', fontWeight: 600 }}>Da Centro di Costo a Motore di Innovazione</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Step 1: Contesto */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>1. Contesto & Sfide</h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '14px' }}>
                            Transizione da gestione "a compartimenti stagni" a modello integrato.
                            Disconnessione storica tra attività quotidiane e obiettivi strategici.
                            Necessità di allinearsi per obiettivi 2026.
                        </p>
                    </div>

                    {/* Step 2: Criticità */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-red)' }}>
                        <h3 style={{ color: 'var(--accent-red)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>2. Criticità Attuali</h3>
                        <ul style={{ color: 'var(--text-primary)', paddingLeft: '20px', lineHeight: 1.6, fontSize: '14px' }}>
                            <li><strong>Flusso Unidirezionale</strong>: UT → Produzione senza feedback.</li>
                            <li><strong>Rischio NADCAP</strong>: Gestione ambigua responsabilità.</li>
                            <li><strong>Isolamento</strong>: UT percepito come corpo estraneo.</li>
                        </ul>
                    </div>

                    {/* Step 3: Soluzione */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-banana)' }}>
                        <h3 style={{ color: 'var(--accent-banana)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>3. La Strategia</h3>
                        <ul style={{ color: 'var(--text-primary)', paddingLeft: '20px', lineHeight: 1.6, fontSize: '14px' }}>
                            <li>⚡️ <strong>Agile</strong>: Sbloccare potenziale proattivo.</li>
                            <li>🔄 <strong>Bi-direzionale</strong>: Scambio fluido con Produzione.</li>
                            <li>📊 <strong>KPI & Visibilità</strong>: Responsabilità e impatto.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Activity Log - Moved Up for Importance */}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Team Card */}
                    <Card title="Il Team" subtitle="Persone e Ruoli">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(data.project.team || []).map(member => (
                                <div key={member.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{member.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{member.role}</div>
                                    </div>
                                    <button
                                        onClick={() => deleteTeamMember(member.id)}
                                        style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <input
                                    placeholder="Nome"
                                    value={newMember.name}
                                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--bg-card)', color: 'white', fontSize: '12px' }}
                                />
                                <input
                                    placeholder="Ruolo"
                                    value={newMember.role}
                                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--bg-card)', color: 'white', fontSize: '12px' }}
                                />
                                <button
                                    onClick={handleAddMember}
                                    style={{ padding: '0 12px', borderRadius: '4px', border: 'none', background: 'var(--accent-blue)', color: 'white', cursor: 'pointer', fontSize: '16px' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Activity Log */}
                    <Card title="Attività Recenti" subtitle="Ultime modifiche">
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
            </div>
        </div>
    );
};

export default DashboardView;
