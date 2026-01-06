import React, { useState } from 'react';
import { analyzeProjectWithAI } from '../../services/aiService';

const AIAssistant = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [query, setQuery] = useState('');

    const handleConsultation = async () => {
        setLoading(true);
        try {
            const result = await analyzeProjectWithAI(data, query);
            setResponse(result);
        } catch (err) {
            setResponse("⚠️ Impossibile contattare l'AI. Verifica la configurazione della chiave API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    backgroundColor: 'var(--accent-ai)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '28px',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 1000,
                    fontWeight: 600,
                    transition: 'transform 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <span>🤖</span>
                Plyform AI Coach
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '24px',
                    width: '380px',
                    maxHeight: '600px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#10a37f1a' }}>
                        <h3 style={{ color: 'var(--accent-ai)', fontSize: '14px', fontWeight: 600 }}>AI Transformation Coach</h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                    </div>

                    <div style={{ padding: '16px', overflowY: 'auto', flex: 1, maxHeight: '400px' }}>
                        {!response && !loading && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ciao! Sono il tuo coach agile. Posso analizzare i dati del progetto Plyform e suggerirti le prossime mosse. Cosa vuoi sapere?</p>
                        )}

                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <div style={{ width: '24px', height: '24px', border: '2px solid var(--accent-ai)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            </div>
                        )}

                        {response && (
                            <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                {response}
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Chiedi qualcosa..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleConsultation()}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'white',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleConsultation}
                                disabled={loading}
                                style={{
                                    backgroundColor: 'var(--accent-ai)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                ➤
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                            {['Analisi Rischi', 'Prossimo Sprint', 'Consigli NADCAP'].map(hint => (
                                <button
                                    key={hint}
                                    onClick={() => { setQuery(hint); handleConsultation(); }}
                                    style={{
                                        padding: '4px 8px',
                                        fontSize: '11px',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: '4px',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {hint}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
