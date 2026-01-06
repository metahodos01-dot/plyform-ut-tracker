import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Data & Services
import { initialProjectData } from './data/initialData';
import { saveToFirestore, loadFromFirestore, subscribeToUpdates } from './services/firebaseService';

// Common Components
import ConnectionStatus from './components/common/ConnectionStatus';

// View Components
import DashboardView from './components/views/DashboardView';
import NeedsView from './components/views/NeedsView';
import SolutionsView from './components/views/SolutionsView';
import ExecutionView from './components/views/ExecutionView';
import KPIsView from './components/views/KPIsView';

// AI Component
import AIAssistant from './components/ai/AIAssistant';

export default function PlyformProjectTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(initialProjectData);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastSaved, setLastSaved] = useState(null);
  const unsubscribeRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Initialize Data
  useEffect(() => {
    const initData = async () => {
      try {
        const remoteData = await loadFromFirestore();
        if (remoteData) {
          setData(remoteData);
          setConnectionStatus('connected');
        } else {
          // If no remote data, save initial data
          await saveToFirestore(initialProjectData);
          setConnectionStatus('saved');
        }
        isInitialLoad.current = false;
      } catch (error) {
        console.error("Init Error:", error);
        setConnectionStatus('error');
      }
    };

    initData();

    // Subscribe to realtime updates
    const setupSubscription = async () => {
      const unsub = await subscribeToUpdates((newData) => {
        if (!isInitialLoad.current && newData) {
          setData(newData);
          setLastSaved(newData.lastUpdated);
          setConnectionStatus('connected');
        }
      });
      unsubscribeRef.current = unsub;
    };

    setupSubscription();

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  // Generic Update Handler
  const updateData = async (newData) => {
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

  // --- CRUD Operations for Needs ---

  const addNeed = (needData) => {
    const newNeed = {
      id: `N${data.needs.length + 1}`,
      ...needData,
      status: 'pending',
      severity: needData.severity || 'medium'
    };
    const newData = {
      ...data,
      needs: [...data.needs, newNeed],
      activityLog: [{
        type: 'need_update',
        message: `Nuova esigenza creata: ${newNeed.title}`,
        timestamp: new Date().toISOString()
      }, ...data.activityLog]
    };
    updateData(newData);
  };

  const updateNeed = (id, updatedFields) => {
    const newData = {
      ...data,
      needs: data.needs.map(need => need.id === id ? { ...need, ...updatedFields } : need),
      activityLog: [{
        type: 'need_update',
        message: `Esigenza aggiornata: ${id}`,
        timestamp: new Date().toISOString()
      }, ...data.activityLog]
    };
    updateData(newData);
  };

  const deleteNeed = (id) => {
    // Also remove from solutions? For now just remove need.
    const newData = {
      ...data,
      needs: data.needs.filter(need => need.id !== id),
      activityLog: [{
        type: 'need_update',
        message: `Esigenza eliminata: ${id}`,
        timestamp: new Date().toISOString()
      }, ...data.activityLog]
    };
    if (selectedNeed?.id === id) setSelectedNeed(null);
    updateData(newData);
  };

  const promoteNeedToObjective = (needId) => {
    const needToPromote = data.needs.find(n => n.id === needId);
    if (!needToPromote) return;

    // 1. Update Need Status
    const updatedNeeds = data.needs.map(n => n.id === needId ? { ...n, status: 'confirmed' } : n);

    // 2. Create New Objective
    const newObjective = {
      id: data.project.objectives2026.length + 1,
      name: `Risoluzione: ${needToPromote.title}`,
      deadline: "TBD",
      status: "pending",
      originNeedId: needId
    };

    const newData = {
      ...data,
      needs: updatedNeeds,
      project: {
        ...data.project,
        objectives2026: [...data.project.objectives2026, newObjective]
      },
      activityLog: [{
        type: 'objective_update',
        message: `Esigenza ${needId} promossa a Obiettivo`,
        timestamp: new Date().toISOString()
      }, ...data.activityLog]
    };
    updateData(newData);
  };

  // --- Team Management ---
  const addTeamMember = (member) => {
    const newMember = {
      id: `TM${(data.project.team?.length || 0) + 1}`,
      ...member
    };
    const newData = {
      ...data,
      project: {
        ...data.project,
        team: [...(data.project.team || []), newMember]
      }
    };
    updateData(newData);
  };

  const deleteTeamMember = (id) => {
    const newData = {
      ...data,
      project: {
        ...data.project,
        team: data.project.team.filter(m => m.id !== id)
      }
    };
    updateData(newData);
  };

  const resetProjectData = async () => {
    if (window.confirm("Attenzione: Questo sovrascriverà tutti i dati correnti con il Piano Strategico iniziale. Continuare?")) {
      await updateData(initialProjectData);
      alert("Piano Strategico caricato con successo!");
    }
  };

  // --- Existing Updaters ---

  const updateObjectiveStatus = (id, status) => {
    const newData = {
      ...data,
      project: {
        ...data.project,
        objectives2026: data.project.objectives2026.map(o => o.id === id ? { ...o, status } : o)
      },
      activityLog: [{
        type: 'objective_update',
        message: `Obiettivo aggiornato: ${status}`,
        timestamp: new Date().toISOString()
      }, ...data.activityLog]
    };
    updateData(newData);
  };

  const updateTaskStatus = (phaseId, taskId, status) => {
    const newData = {
      ...data,
      phases: data.phases.map(p => p.id === phaseId ? {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
      } : p),
      activityLog: [{
        type: 'task_update',
        message: `Task ${taskId} completato`,
        timestamp: new Date().toISOString()
      }, ...data.activityLog]
    };
    updateData(newData);
  };

  const updateKPIValue = (category, kpiId, value) => {
    const newData = {
      ...data,
      kpis: {
        ...data.kpis,
        [category]: data.kpis[category].map(k => k.id === kpiId ? { ...k, current: value } : k)
      }
    };
    updateData(newData);
  };

  const retryConnection = async () => {
    setConnectionStatus('connecting');
    const remoteData = await loadFromFirestore();
    if (remoteData) {
      setData(remoteData);
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('error');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'needs', label: 'Esigenze', icon: '🔍' },
    { id: 'solutions', label: 'Soluzioni', icon: '💡' },
    { id: 'execution', label: 'Esecuzione', icon: '⚡' },
    { id: 'kpis', label: 'KPIs', icon: '📈' }
  ];

  return (
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
        {activeTab === 'dashboard' && <DashboardView
          data={data}
          updateObjectiveStatus={updateObjectiveStatus}
          addTeamMember={addTeamMember}
          deleteTeamMember={deleteTeamMember}
        />}
        {activeTab === 'needs' &&
          <NeedsView
            data={data}
            selectedNeed={selectedNeed}
            setSelectedNeed={setSelectedNeed}
            addNeed={addNeed}
            updateNeed={updateNeed}
            deleteNeed={deleteNeed}
            promoteNeed={promoteNeedToObjective}
          />
        }
        {activeTab === 'solutions' && <SolutionsView data={data} />}
        {activeTab === 'execution' && <ExecutionView data={data} updateTaskStatus={updateTaskStatus} />}
        {activeTab === 'kpis' && <KPIsView data={data} updateKPIValue={updateKPIValue} />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
          {lastSaved && `Ultimo sync: ${new Date(lastSaved).toLocaleString('it-IT')}`}
        </p>
        <button
          onClick={resetProjectData}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-red)',
            fontSize: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: 0.7
          }}
        >
          ⚠️ Reset / Carica Piano Iniziale
        </button>
      </footer>

      <AIAssistant data={data} />
    </div>
  );
}
