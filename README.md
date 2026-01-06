# Plyform UT Transformation Tracker

App per la gestione del progetto di trasformazione dell'Ufficio Tecnico Plyform.

## 🎯 Obiettivi del Progetto

- **NADCAP** - Riqualificazione entro Luglio 2026
- **Part 21** - Certificazione entro Ottobre 2026  
- **Linea Piaggio** - Reingegnerizzazione Q4 2026

## 📋 Funzionalità

| Sezione | Descrizione |
|---------|-------------|
| **Dashboard** | Panoramica avanzamento, giornate (10 totali), KPI principali |
| **Esigenze** | 4 criticità identificate con severità e causa radice |
| **Soluzioni** | 4 interventi strategici con matrice correlazioni |
| **Esecuzione** | Piano operativo 4 fasi, task interattivi |
| **KPI** | Indicatori processo, qualità, progetto |

## 🔥 Firebase Integration

L'app si sincronizza in tempo reale con Firebase Firestore:
- Auto-save ad ogni modifica
- Real-time sync tra dispositivi
- Activity log persistente

### Configurazione

```javascript
const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "plyform-ut-tracker.firebaseapp.com",
  projectId: "plyform-ut-tracker",
  // ...
};
```

## 🚀 Quick Start

1. Clona il repository
2. Apri `plyform-tracker-firebase.jsx` in un ambiente React
3. L'app si connette automaticamente a Firebase

## 📊 Struttura Dati

```
projects/
  └── plyform-ut-transformation/
      ├── project (info generali, obiettivi 2026)
      ├── needs (4 esigenze/criticità)
      ├── solutions (4 soluzioni strategiche)
      ├── phases (4 fasi, task con stato)
      ├── kpis (processo, qualità, progetto)
      └── activityLog (storico modifiche)
```

## 📅 Piano 10 Giornate

| Fase | Giorni | Focus |
|------|--------|-------|
| F1 - Avvio | 1.5 | Kick-off, allineamento stakeholder |
| F2 - Agile | 3 | Formazione, setup board, cerimonie |
| F3 - Flussi | 3 | Mappatura AS-IS, design TO-BE, NADCAP |
| F4 - KPI | 2.5 | Metriche, dashboard, tavoli inter-funzionali |

---

**Plyform** - Trasformazione Ufficio Tecnico 2025-2026
