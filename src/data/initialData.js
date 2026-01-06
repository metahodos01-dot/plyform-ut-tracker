export const initialProjectData = {
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
