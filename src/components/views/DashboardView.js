import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

const DashboardView = ({ data, updateObjectiveStatus, addTeamMember, deleteTeamMember, onGenerateAI }) => {
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
                            Vision: {data.project.name}
                        </h2>
                        <p style={{ color: 'var(--accent-banana)', fontWeight: 600 }}>{data.project.vision}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Step 1: Contesto */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>1. Contesto & Sfide</h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '14px' }}>
                            Ufficio Tecnico come fulcro nevralgico ma storicamente gestito a "compartimenti stagni".
                            Necessità di allineamento per obiettivi 2026 (NADCAP, Part 21) e ottimizzazione catena del valore.
                        </p>
                    </div>

                    {/* Step 2: Criticità */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-red)' }}>
                        <h3 style={{ color: 'var(--accent-red)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>2. Criticità (As-Is)</h3>
                        <ul style={{ color: 'var(--text-primary)', paddingLeft: '20px', lineHeight: 1.6, fontSize: '14px' }}>
                            <li><strong>Unidirezionalità</strong>: UT → Produzione senza feedback ("Lesson Learned").</li>
                            <li><strong>Rischio NADCAP</strong>: UT garante formale, Produzione gestore operativo.</li>
                            <li><strong>Cultura</strong>: "Infallibilità" percepita e isolamento operativo.</li>
                        </ul>
                    </div>

                    {/* Step 3: Soluzione */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--accent-banana)' }}>
                        <h3 style={{ color: 'var(--accent-banana)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>3. Visione (To-Be)</h3>
                        <ul style={{ color: 'var(--text-primary)', paddingLeft: '20px', lineHeight: 1.6, fontSize: '14px' }}>
                            <li>⚡️ <strong>Agile & Integrato</strong>: Unità coesa, reattiva e responsabile.</li>
                            <li>🔄 <strong>Ciclo Chiuso</strong>: Comunicazione bidirezionale fluida.</li>
                            <li>📊 <strong>Guidato dai Dati</strong>: KPI chiari per impatto su marginalità.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Objectives */}
                    <Card title="Obiettivi Strategici 2026" subtitle="Target aziendali imperativi">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {data.project.objectives2026.map(obj => (
                                <div key={obj.id} style={{
                                    padding: '16px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderRadius: '8px',
                                    borderLeft: `3px solid ${obj.status === 'at-risk' ? 'var(--accent-red)' : obj.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)'}`,
                                    display: 'flex', flexDirection: 'column', gap: '8px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, margin: 0 }}>{obj.name}</h4>
                                        <Badge type={obj.status} onClick={() => {
                                            const statuses = ['pending', 'in-progress', 'at-risk', 'completed'];
                                            const nextStatus = statuses[(statuses.indexOf(obj.status) + 1) % statuses.length];
                                            updateObjectiveStatus(obj.id, nextStatus);
                                        }}>{obj.status}</Badge>
                                    </div>

                                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>{obj.description}</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        <div>📅 <strong>Scadenza:</strong> {obj.deadline}</div>
                                        <div>🎯 <strong>Target:</strong> {obj.target}</div>
                                        <div>📊 <strong>KPI:</strong> {obj.kpi}</div>
                                        <div>👥 <strong>Risorse:</strong> {obj.resources?.join(', ') || 'N/A'}</div>
                                    </div>

                                    {obj.linkedNeedId && (
                                        <div style={{ fontSize: '10px', color: 'var(--accent-blue)', backgroundColor: 'var(--accent-blue-dim)', padding: '4px 6px', borderRadius: '4px', alignSelf: 'start' }}>
                                            🔗 Esigenza: {obj.linkedNeedId}
                                        </div>
                                    )}

                                    {/* AI Task Generation */}
                                    <button
                                        onClick={async () => {
                                            // Handle AI generation here or pass up to App.js via a prop
                                            // For now, let's assume we pass a handler or just do it inline if we had the service.
                                            // Since DashboardView doesn't have the AI service directly, we should ideally trigger this from App.js or passing the function.
                                            // User request: "AI aiuta per ogni obiettivo a creare i task"
                                            // I need to add 'generateTasksForObjective' to App.js and pass it down.
                                            // I will fix the props passed to DashboardView in App.js in the next step to include `onGenerateTasks`.
                                            if (window.confirm(`Generare task con AI per "${obj.name}"?`)) {
                                                // Placeholder alert until App.js connection is verified
                                                // window.alert("Funzionalità in fase di collegamento...");
                                                if (onGenerateAI) {
                                                    onGenerateAI(obj);
                                                }
                                            }
                                        }}
                                        style={{
                                            marginTop: '8px',
                                            padding: '8px',
                                            backgroundColor: 'var(--bg-secondary)',
                                            border: '1px solid var(--accent-purple)',
                                            color: 'var(--accent-purple)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                        }}
                                    >
                                        ✨ Genera Task con AI
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Phases - Roadmap */}
                    <Card title="Roadmap di Trasformazione" subtitle="Fasi operative del piano">
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
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {phase.tasks.map(task => (
                                                    <span key={task.id} style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', padding: '2px 6px', borderRadius: '4px' }}>
                                                        {task.name}
                                                    </span>
                                                ))}
                                            </div>
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
                    <Card title="Team & Stakeholder" subtitle="Sponsor e Esecutori">
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
                    <Card title="Activity Log" subtitle="Real-time updates">
                        {data.activityLog.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                                Nessuna attività
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                                {data.activityLog.slice(0, 5).map((log, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        borderRadius: '6px'
                                    }}>
                                        <span style={{ fontSize: '14px' }}>
                                            {log.type === 'task_update' ? '✅' : log.type === 'objective_update' ? '🎯' : 'ℹ️'}
                                        </span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px', flex: 1 }}>{log.message}</span>
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
