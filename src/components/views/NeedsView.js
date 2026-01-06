import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const NeedsView = ({ data, selectedNeed, setSelectedNeed, addNeed, updateNeed, deleteNeed, promoteNeed }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Handler for initiating create
    const handleStartCreate = () => {
        setEditForm({
            title: '',
            description: '',
            severity: 'medium',
            rootCause: ''
        });
        setIsCreating(true);
        setSelectedNeed(null); // Deselect any existing need
        setIsEditing(false); // Ensure we are not in edit mode
    };

    // Handler for saving new need
    const handleCreateSave = () => {
        if (!editForm.title) return; // Simple validation
        addNeed(editForm);
        setIsCreating(false);
    };

    // Handler for initiating edit
    const handleStartEdit = (need) => {
        setEditForm({ ...need });
        setIsEditing(true);
    };

    // Handler for saving edits
    const handleEditSave = () => {
        updateNeed(selectedNeed.id, editForm);
        setIsEditing(false);
        setSelectedNeed({ ...selectedNeed, ...editForm }); // Update local selection to reflect changes immediately
    };

    // Handler for confirming/promoting
    const handlePromote = () => {
        promoteNeed(selectedNeed.id);
        setSelectedNeed(null); // Deselect after promotion
    };

    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Analisi delle Esigenze</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Criticità strutturali identificate</p>
                </div>
                <button
                    onClick={handleStartCreate}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--accent-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    + Nuova Esigenza
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: (selectedNeed || isCreating) ? '1fr 1fr' : '1fr', gap: '20px' }}>
                {/* LIST OF NEEDS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.needs.map(need => (
                        <div
                            key={need.id}
                            onClick={() => {
                                if (isCreating) setIsCreating(false);
                                setIsEditing(false);
                                setSelectedNeed(selectedNeed?.id === need.id ? null : need);
                            }}
                            style={{
                                padding: '20px',
                                backgroundColor: selectedNeed?.id === need.id ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                                border: `1px solid ${selectedNeed?.id === need.id ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: need.status === 'confirmed' ? 0.6 : 1
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
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {need.status === 'confirmed' && <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}>✅ Promosso</span>}
                                    <Badge type={need.severity}>{need.severity}</Badge>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{need.description}</p>
                        </div>
                    ))}
                </div>

                {/* CREATE FORM */}
                {isCreating && (
                    <Card title="Nuova Esigenza" subtitle="Inserisci i dettagli">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                placeholder="Titolo"
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white' }}
                            />
                            <textarea
                                placeholder="Descrizione"
                                value={editForm.description}
                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white', minHeight: '80px' }}
                            />
                            <textarea
                                placeholder="Causa Radice"
                                value={editForm.rootCause}
                                onChange={e => setEditForm({ ...editForm, rootCause: e.target.value })}
                                style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white', minHeight: '60px' }}
                            />
                            <select
                                value={editForm.severity}
                                onChange={e => setEditForm({ ...editForm, severity: e.target.value })}
                                style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white' }}
                            >
                                <option value="low">Bassa</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="critical">Critica</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleCreateSave} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--accent-green)', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Salva</button>
                                <button onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer' }}>Annulla</button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* EDIT/DETAIL VIEW */}
                {selectedNeed && !isCreating && (
                    <Card
                        title={isEditing ? "Modifica Esigenza" : "Dettaglio"}
                        subtitle={isEditing ? selectedNeed.id : selectedNeed.title}
                        headerAction={
                            !isEditing && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleStartEdit(selectedNeed)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Modifica">✏️</button>
                                    <button onClick={() => deleteNeed(selectedNeed.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Elimina">🗑️</button>
                                </div>
                            )
                        }
                    >
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white' }}
                                />
                                <textarea
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white', minHeight: '100px' }}
                                />
                                <textarea
                                    value={editForm.rootCause || ''}
                                    onChange={e => setEditForm({ ...editForm, rootCause: e.target.value })}
                                    placeholder="Causa Radice"
                                    style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white', minHeight: '60px' }}
                                />
                                <select
                                    value={editForm.severity}
                                    onChange={e => setEditForm({ ...editForm, severity: e.target.value })}
                                    style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'white' }}
                                >
                                    <option value="low">Bassa</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                    <option value="critical">Critica</option>
                                </select>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={handleEditSave} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--accent-blue)', border: 'none', borderRadius: '6px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>Salva Modifiche</button>
                                    <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer' }}>Annulla</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Descrizione</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{selectedNeed.description}</p>
                                </div>

                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Causa Radice</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-orange)' }}>
                                        {selectedNeed.rootCause || "Nessuna causa radice specificata."}
                                    </p>
                                </div>

                                {selectedNeed.status !== 'confirmed' ? (
                                    <button
                                        onClick={handlePromote}
                                        style={{
                                            padding: '12px',
                                            backgroundColor: 'var(--accent-banana)',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            marginTop: '10px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        🚀 Conferma & Promuovi a Obiettivo
                                    </button>
                                ) : (
                                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', color: 'var(--accent-green)', textAlign: 'center', fontWeight: '600' }}>
                                        ✅ Promosso a Obiettivo
                                    </div>
                                )}

                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Soluzioni Correlate</p>
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
                                        {data.solutions.filter(s => s.needIds.includes(selectedNeed.id)).length === 0 && (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>Nessuna soluzione ancora collegata</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default NeedsView;
