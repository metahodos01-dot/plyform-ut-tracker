import React, { useState, useEffect } from 'react';

// =============================================================================
// FIREBASE CONFIGURATION - SOSTITUISCI CON I TUOI VALORI
// =============================================================================
// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const COLLECTION_NAME = "projects";
const DOCUMENT_ID = "plyform-ut-transformation";

// Initialize Firebase
const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firestoreDb = getFirestore(firebaseApp);

// Save data to Firestore
const saveToFirestore = async (data) => {
  try {
    const docRef = doc(firestoreDb, COLLECTION_NAME, DOCUMENT_ID);
    await setDoc(docRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    });
    console.log('✅ Dati salvati su Firebase');
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio:', error);
    return false;
  }
};

// Load data from Firestore
const loadFromFirestore = async () => {
  try {
    const docRef = doc(firestoreDb, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('✅ Dati caricati da Firebase');
      return docSnap.data();
    }
    console.log('ℹ️ Nessun dato esistente, uso defaults');
    return null;
  } catch (error) {
    console.error('❌ Errore caricamento:', error);
    return null;
  }
};

// Subscribe to real-time updates
const subscribeToUpdates = (callback) => {
  try {
    const docRef = doc(firestoreDb, COLLECTION_NAME, DOCUMENT_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    });
  } catch (error) {
    console.error('❌ Errore subscription:', error);
    return () => { };
  }
};
// =============================================================================
// AI SERVICE
// =============================================================================
const analyzeProjectWithAI = async (projectData, query) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key mancante");
  }

  const context = `
    Sei un Agile Transformation Coach esperto per l'Ufficio Tecnico Plyform.
    Dati Progetto:
    - Avanzamento: ${Math.round((projectData.phases.flatMap(p => p.tasks).filter(t => t.status === 'completed').length / projectData.phases.flatMap(p => p.tasks).length) * 100)}%
    - Obiettivi Critici: ${projectData.project.objectives2026.filter(o => o.status === 'at-risk').map(o => o.name).join(', ')}
    - KPI Critici: ${projectData.kpis.process.filter(k => !k.current).map(k => k.name).join(', ')}
    - Esigenze: ${projectData.needs.map(n => n.title).join(', ')}
    
    Rispondi in modo sintetico, professionale e orientato all'azione.
    Usa elenchi puntati se necessario.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: context },
          { role: "user", content: query || "Analizza lo stato attuale e dammi 3 suggerimenti prioritari." }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Errore durante l'analisi AI");
  }
};

// =============================================================================

// =============================================================================
// INITIAL PROJECT DATA
// =============================================================================
const initialProjectData = {
  project: {
    name: "Trasformazione Ufficio Tecnico Plyform",
    totalDays: 10,
    startDate: "2025-01-13",
    objectives2026: [
      { id: 1, name: "Riqualificazione NADCAP", deadline: "Luglio 2026", status: "at-risk" },
      { id: 2, name: "Certificazione Part 21", deadline: "Ottobre 2026", status: "pending" },
      { id: 3, name: "Reingegnerizzazione Linea Piaggio", deadline: "Q4 2026", status: "pending" }
    ]
  },
  needs: [
    {
      id: "N1",
      title: "Flusso Informativo Sbilanciato",
      description: "Comunicazione unidirezionale UT→Produzione. Manca feedback strutturato e lesson learned dal campo.",
      severity: "critical",
      rootCause: "Cultura pregressa orientata all'infallibilità, assenza di riferimenti chiari in reparto"
    },
    {
      id: "N2",
      title: "Gestione Ambigua NADCAP",
      description: "Disallineamento tra responsabilità formale (UT) e operativa (Ramponi/Produzione). Rischio NC grave = perdita certificazione.",
      severity: "critical",
      rootCause: "Modello a compartimenti stagni, mancata definizione ruoli"
    },
    {
      id: "N3",
      title: "Carenza Coesione Team",
      description: "UT percepito come unico ente non integrato. Limitata autonomia, scarsa condivisione informazioni, visibilità ridotta su obiettivi.",
      severity: "high",
      rootCause: "Gestione precedente a compartimenti stagni, personale esecutore senza deleghe"
    },
    {
      id: "N4",
      title: "Assenza KPI e Metriche",
      description: "Nessuna percezione oggettiva delle performance, avanzamento lavori non tracciato, impatto su marginalità non misurato.",
      severity: "medium",
      rootCause: "Disconnessione tra attività quotidiane e indicatori strategici"
    }
  ],
  solutions: [
    {
      id: "S1",
      needIds: ["N3", "N4"],
      title: "Framework Agile per l'UT",
      description: "Introdurre metodologie agili per gestione progetti, prioritizzazione e miglioramento processi interni.",
      benefits: ["Reattività aumentata", "Autonomia decisionale", "Orientamento obiettivi strategici"]
    },
    {
      id: "S2",
      needIds: ["N1", "N2"],
      title: "Flusso Comunicazione Bidirezionale",
      description: "Implementare processo scambio informativo UT↔Produzione fluido, mappabile e reattivo.",
      benefits: ["Lesson learned capitalizzate", "Riduzione errori", "Miglioramento continuo"]
    },
    {
      id: "S3",
      needIds: ["N4"],
      title: "Sistema KPI e Dashboard",
      description: "Definire metriche chiare: efficienza cicli, tempi risposta, NC da documentazione, milestone progetti.",
      benefits: ["Cultura data-driven", "Responsabilità individuale", "Visibilità performance"]
    },
    {
      id: "S4",
      needIds: ["N1", "N3"],
      title: "Tavoli Inter-funzionali",
      description: "Stabilire collaborazione strutturata con Commerciale, Produzione, Qualità per marginalità ed efficientamento.",
      benefits: ["Impatto economico visibile", "Partner strategico", "Lean manufacturing"]
    }
  ],
  phases: [
    {
      id: "F1",
      name: "Avvio e Allineamento",
      days: 1.5,
      status: "not-started",
      solutionIds: [],
      tasks: [
        { id: "T1.1", name: "Kick-off con team UT + Leonardo", hours: 4, status: "pending", notes: "" },
        { id: "T1.2", name: "Incontro preliminare Ramponi (30min)", hours: 2, status: "pending", notes: "" },
        { id: "T1.3", name: "Distribuzione charter progetto", hours: 2, status: "pending", notes: "" },
        { id: "T1.4", name: "Raccolta feedback iniziale stakeholder", hours: 4, status: "pending", notes: "" }
      ]
    },
    {
      id: "F2",
      name: "Integrazione Agile",
      days: 3,
      status: "not-started",
      solutionIds: ["S1"],
      tasks: [
        { id: "T2.1", name: "Formazione team su metodologie Agile", hours: 8, status: "pending", notes: "" },
        { id: "T2.2", name: "Setup board Kanban/Scrum", hours: 4, status: "pending", notes: "" },
        { id: "T2.3", name: "Sessioni pratiche su carichi correnti", hours: 8, status: "pending", notes: "" },
        { id: "T2.4", name: "Definizione cerimonie (daily, retrospettive)", hours: 4, status: "pending", notes: "" }
      ]
    },
    {
      id: "F3",
      name: "Ridisegno Flussi",
      days: 3,
      status: "not-started",
      solutionIds: ["S2"],
      tasks: [
        { id: "T3.1", name: "Mappatura processi AS-IS UT↔Produzione", hours: 6, status: "pending", notes: "" },
        { id: "T3.2", name: "Identificazione colli di bottiglia", hours: 4, status: "pending", notes: "" },
        { id: "T3.3", name: "Design flusso TO-BE bidirezionale", hours: 6, status: "pending", notes: "" },
        { id: "T3.4", name: "Implementazione canali feedback", hours: 4, status: "pending", notes: "" },
        { id: "T3.5", name: "Allineamento responsabilità NADCAP", hours: 4, status: "pending", notes: "" }
      ]
    },
    {
      id: "F4",
      name: "KPI e Visibilità",
      days: 2.5,
      status: "not-started",
      solutionIds: ["S3", "S4"],
      tasks: [
        { id: "T4.1", name: "Definizione KPI processo/qualità/progetto", hours: 6, status: "pending", notes: "" },
        { id: "T4.2", name: "Setup dashboard monitoraggio", hours: 4, status: "pending", notes: "" },
        { id: "T4.3", name: "Tavolo con Commerciale per marginalità", hours: 4, status: "pending", notes: "" },
        { id: "T4.4", name: "Tavolo con Produzione/Qualità per Lean", hours: 4, status: "pending", notes: "" },
        { id: "T4.5", name: "Documentazione e handover", hours: 2, status: "pending", notes: "" }
      ]
    }
  ],
  kpis: {
    process: [
      { id: "KPI1", name: "Tempo redazione cicli", target: "-20%", current: null, unit: "giorni" },
      { id: "KPI2", name: "Tempo risposta a Produzione", target: "<24h", current: null, unit: "ore" },
      { id: "KPI3", name: "Lead time progetti", target: "-15%", current: null, unit: "giorni" }
    ],
    quality: [
      { id: "KPI4", name: "NC da documentazione tecnica", target: "-50%", current: null, unit: "numero" },
      { id: "KPI5", name: "Feedback Produzione ricevuti", target: ">10/mese", current: null, unit: "numero" }
    ],
    project: [
      { id: "KPI6", name: "NADCAP - Milestone rispettate", target: "100%", current: null, unit: "%" },
      { id: "KPI7", name: "Part 21 - Avanzamento", target: "On track", current: null, unit: "stato" },
      { id: "KPI8", name: "Piaggio - Presidio attivo", target: "Sì", current: null, unit: "bool" }
    ]
  },
  activityLog: []
};

// =============================================================================
// STYLING
// =============================================================================
const severityColors = {
  critical: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  high: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  medium: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  low: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' }
};

const statusColors = {
  'not-started': { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  'in-progress': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  'completed': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'at-risk': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'pending': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --bg-primary: #0A0A0B;
    --bg-secondary: #141417;
    --bg-tertiary: #1C1C21;
    --bg-card: #18181C;
    --border-subtle: #2A2A30;
    --border-medium: #3A3A42;
    --text-primary: #FAFAFA;
    --text-secondary: #A1A1AA;
    --text-muted: #71717A;
    --accent-blue: #3B82F6;
    --accent-blue-dim: #1E3A5F;
    --accent-green: #10B981;
    --accent-green-dim: #064E3B;
    --accent-orange: #F59E0B;
    --accent-red: #EF4444;
    --accent-purple: #8B5CF6;
    --accent-ai: #10a37f;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// =============================================================================
// COMPONENTS
// =============================================================================
const Badge = ({ children, type = 'default', size = 'sm' }) => {
  const colors = severityColors[type] || statusColors[type] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 500,
      borderRadius: '4px',
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      {children}
    </span>
  );
};

const ProgressBar = ({ value, max, color = 'var(--accent-blue)' }) => (
  <div style={{
    width: '100%',
    height: '6px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '3px',
    overflow: 'hidden'
  }}>
    <div style={{
      width: `${Math.min((value / max) * 100, 100)}%`,
      height: '100%',
      backgroundColor: color,
      borderRadius: '3px',
      transition: 'width 0.5s ease'
    }} />
  </div>
);

const Card = ({ children, title, subtitle, actions, noPadding = false }) => (
  <div style={{
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    overflow: 'hidden'
  }}>
    {(title || actions) && (
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          {title && <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, marginBottom: subtitle ? '4px' : 0 }}>{title}</h3>}
          {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
      </div>
    )}
    <div style={{ padding: noPadding ? 0 : '20px' }}>
      {children}
    </div>
  </div>
);

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

// =============================================================================
// MAIN APPLICATION
// =============================================================================


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

// =============================================================================
// MAIN APPLICATION
// =============================================================================
export default function PlyformProjectTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(initialProjectData);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize Firebase and load data
  useEffect(() => {
    const init = async () => {
      setConnectionStatus('connecting');

      // Static initialization is already done
      const savedData = await loadFromFirestore();
      if (savedData) {
        setData(savedData);
        setLastSaved(savedData.lastUpdated);
        setConnectionStatus('connected');
      } else {
        // Save initial data if nothing exists
        const success = await saveToFirestore(initialProjectData);
        if (success) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
        }
      }

      // Subscribe to real-time updates
      const unsubscribe = subscribeToUpdates((newData) => {
        setData(newData);
        setLastSaved(newData.lastUpdated);
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    };

    init();
  }, []);

  // Save data to Firebase
  const saveData = async (newData) => {
    setData(newData);
    setConnectionStatus('saving');

    const success = await saveToFirestore(newData);

    if (success) {
      setConnectionStatus('saved');
      setLastSaved(new Date().toISOString());
      setTimeout(() => setConnectionStatus('connected'), 2000);
    } else {
      setConnectionStatus('error');
    }
  };

  // Retry connection
  const retryConnection = async () => {
    setConnectionStatus('connecting');
    const savedData = await loadFromFirestore();
    if (savedData) {
      setData(savedData);
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('error');
    }
  };

  // Update task status
  const updateTaskStatus = (phaseId, taskId, newStatus) => {
    const newData = { ...data };
    const phase = newData.phases.find(p => p.id === phaseId);
    const task = phase.tasks.find(t => t.id === taskId);
    task.status = newStatus;

    const allCompleted = phase.tasks.every(t => t.status === 'completed');
    const anyInProgress = phase.tasks.some(t => t.status === 'in-progress');
    phase.status = allCompleted ? 'completed' : anyInProgress ? 'in-progress' : 'not-started';

    newData.activityLog.unshift({
      timestamp: new Date().toISOString(),
      type: 'task_update',
      message: `Task "${task.name}" → ${newStatus}`
    });

    if (newData.activityLog.length > 50) {
      newData.activityLog = newData.activityLog.slice(0, 50);
    }

    saveData(newData);
  };

  // Update objective status
  const updateObjectiveStatus = (objId, newStatus) => {
    const newData = { ...data };
    const obj = newData.project.objectives2026.find(o => o.id === objId);
    obj.status = newStatus;

    newData.activityLog.unshift({
      timestamp: new Date().toISOString(),
      type: 'objective_update',
      message: `Obiettivo "${obj.name}" → ${newStatus}`
    });

    saveData(newData);
  };

  // Update KPI value
  const updateKPIValue = (category, kpiId, value) => {
    const newData = { ...data };
    const kpi = newData.kpis[category].find(k => k.id === kpiId);
    kpi.current = value;

    newData.activityLog.unshift({
      timestamp: new Date().toISOString(),
      type: 'kpi_update',
      message: `KPI "${kpi.name}" aggiornato: ${value}`
    });

    saveData(newData);
  };

  // Calculate progress
  const calculateProgress = () => {
    const allTasks = data.phases.flatMap(p => p.tasks);
    const completed = allTasks.filter(t => t.status === 'completed').length;
    return { completed, total: allTasks.length, percentage: Math.round((completed / allTasks.length) * 100) };
  };

  const progress = calculateProgress();
  const daysUsed = data.phases.reduce((acc, p) => {
    const completedHours = p.tasks.filter(t => t.status === 'completed').reduce((h, t) => h + t.hours, 0);
    return acc + (completedHours / 8);
  }, 0);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'needs', label: 'Esigenze', icon: '🔍' },
    { id: 'solutions', label: 'Soluzioni', icon: '💡' },
    { id: 'execution', label: 'Esecuzione', icon: '⚡' },
    { id: 'kpis', label: 'KPI', icon: '📈' }
  ];

  // =============================================================================
  // RENDER SECTIONS
  // =============================================================================

  const renderDashboard = () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avanzamento</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '32px', fontWeight: 700 }}>{progress.percentage}%</p>
          <ProgressBar value={progress.completed} max={progress.total} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>{progress.completed}/{progress.total} task</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giornate</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '32px', fontWeight: 700 }}>{daysUsed.toFixed(1)}<span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/{data.project.totalDays}</span></p>
          <ProgressBar value={daysUsed} max={data.project.totalDays} color="var(--accent-green)" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>{(data.project.totalDays - daysUsed).toFixed(1)} rimanenti</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Criticità</p>
          <p style={{ color: 'var(--accent-red)', fontSize: '32px', fontWeight: 700 }}>{data.needs.filter(n => n.severity === 'critical').length}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>su {data.needs.length} identificate</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Obiettivi 2026</p>
          <p style={{ color: 'var(--accent-orange)', fontSize: '32px', fontWeight: 700 }}>3</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>NADCAP • Part 21 • Piaggio</p>
        </div>
      </div>

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

      {/* Activity Log */}
      <Card title="Attività Recenti" subtitle="Ultime modifiche sincronizzate">
        {data.activityLog.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
            Nessuna attività registrata
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
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

  const renderNeeds = () => (
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

  const renderSolutions = () => (
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExecution = () => (
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

  const renderKPIs = () => (
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

  // =============================================================================
  // MAIN RENDER
  // =============================================================================
  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        color: 'var(--text-primary)'
      }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(10, 10, 11, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '16px',
                color: '#fff'
              }}>P</div>
              <div>
                <h1 style={{ fontSize: '16px', fontWeight: 600 }}>Plyform UT Transformation</h1>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Firebase Sync</p>
              </div>
            </div>

            <nav style={{ display: 'flex', gap: '4px' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? 'var(--accent-blue)' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            <ConnectionStatus status={connectionStatus} onRetry={retryConnection} />
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'needs' && renderNeeds()}
          {activeTab === 'solutions' && renderSolutions()}
          {activeTab === 'execution' && renderExecution()}
          {activeTab === 'kpis' && renderKPIs()}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {lastSaved && `Ultimo sync: ${new Date(lastSaved).toLocaleString('it-IT')}`}
          </p>
        </footer>

        <AIAssistant data={data} />
      </div>
    </>
  );
}
