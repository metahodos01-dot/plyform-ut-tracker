export const initialProjectData = {
    project: {
        name: "Trasformazione UT Plyform",
        vision: "Trasformare l'Ufficio Tecnico da Centro di Costo a Motore di Innovazione",
        manager: "Leonardo",
        startDate: "2025-04-01",
        totalDays: 280, // Approx until end of 2025/early 2026
        progress: 15,
        team: [
            { id: 'TM1', name: 'Leonardo', role: 'Executive Sponsor' },
            { id: 'TM2', name: 'Ramponi', role: 'Responsabile Produzione' },
            { id: 'TM3', name: 'Team UT', role: 'Technical Execution' }
        ],
        objectives2026: [
            {
                id: 1,
                name: "Rinnovo NADCAP",
                deadline: "Luglio 2026",
                status: "at-risk",
                description: "Ottenere il rinnovo della certificazione. Zero Non Conformità gravi ammesse."
            },
            {
                id: 2,
                name: "Certificazione Part 21",
                deadline: "Ottobre 2026",
                status: "pending",
                description: "Nuova certificazione critica per il settore Aerospace."
            },
            {
                id: 3,
                name: "Reingegnerizzazione Linea Piaggio",
                deadline: "Gennaio 2026",
                status: "pending",
                description: "Presa in carico e ottimizzazione asset tattico biennio."
            }
        ]
    },

    needs: [
        {
            id: 'N1',
            title: "Disallineamento Resp. NADCAP",
            description: "UT è garante formale, ma la gestione operativa è in Produzione (Ramponi). Rischio elevato di NC.",
            severity: "critical",
            rootCause: "Cultura a compartimenti stagni e gestione storica non integrata.",
            status: "pending"
        },
        {
            id: 'N2',
            title: "Flusso Comunicazione Unidirezionale",
            description: "UT trasmette a Produzione senza feedback strutturato ('Lesson Learned').",
            severity: "high",
            rootCause: "Mancanza di canali ufficiali di ritorno e cultura della 'infallibilità'.",
            status: "pending"
        },
        {
            id: 'N3',
            title: "Isolamento Operativo",
            description: "UT percepito come corpo estraneo o mero esecutore di compiti ('Build to Print').",
            severity: "medium",
            rootCause: "Mancata integrazione nei tavoli decisionali operativi.",
            status: "pending"
        }
    ],

    solutions: [
        {
            id: 'S1',
            title: "Framework Agile UT",
            description: "Adozione metodologie agili per gestione carichi e prioritizzazione autonoma.",
            type: "process", // process, tool, org
            needIds: ['N3'],
            status: "proposed"
        },
        {
            id: 'S2',
            title: "Loop di Feedback Bidirezionale",
            description: "Canale strutturato per 'Lesson Learned' dalla Produzione all'UT.",
            type: "process",
            needIds: ['N2'],
            status: "proposed"
        },
        {
            id: 'S3',
            title: "Tavoli Inter-funzionali",
            description: "Meeting periodici con Commerciale, Produzione e Qualità per allineamento.",
            type: "org",
            needIds: ['N1', 'N3'],
            status: "proposed"
        }
    ],

    phases: [
        {
            id: 'P1',
            name: "Fase 1: Avvio & Allineamento",
            days: 30,
            status: "in-progress",
            tasks: [
                { id: 'T1.1', name: "Kick-off team UT + Leonardo", status: "pending", assignee: "Leonardo" },
                { id: 'T1.2', name: "Incontro preliminare Ramponi (Sponsorship)", status: "pending", assignee: "Leonardo" },
                { id: 'T1.3', name: "Diffusione Piano di Progetto (Charter)", status: "pending", assignee: "PM" }
            ]
        },
        {
            id: 'P2',
            name: "Fase 2: Integrazione Agile",
            days: 60,
            status: "pending",
            tasks: [
                { id: 'T2.1', name: "Formazione base metodologie Agile", status: "pending" },
                { id: 'T2.2', name: "Workshop applicazione pratica ai carichi attuali", status: "pending" }
            ]
        },
        {
            id: 'P3',
            name: "Fase 3: Ridisegno Flussi",
            days: 45,
            status: "pending",
            tasks: [
                { id: 'T3.1', name: "Mappatura As-Is collo di bottiglia", status: "pending" },
                { id: 'T3.2', name: "Design nuovo flusso bidirezionale (Loop Feedback)", status: "pending" }
            ]
        },
        {
            id: 'P4',
            name: "Fase 4: KPI & Visibilità Strategica",
            days: 45,
            status: "pending",
            tasks: [
                { id: 'T4.1', name: "Definizione KPI di Processo, Qualità, Progetto", status: "pending" },
                { id: 'T4.2', name: "Avvio tavoli inter-funzionali (Comm/Prod/Qual)", status: "pending" }
            ]
        }
    ],

    kpis: {
        efficiency: [
            { id: 'K1', name: "Riduzione Lead Time Progetti", current: 0, target: 20, unit: '%' },
            { id: 'K2', name: "Tempi Risposta a Produzione", current: 48, target: 24, unit: 'h' }
        ],
        quality: [
            { id: 'K3', name: "NC da Documentazione Tecnica", current: 5, target: 0, unit: '#' },
            { id: 'K4', name: "Feedback Implementati da Prod", current: 0, target: 10, unit: '#' }
        ]
    },

    activityLog: [
        { type: 'info', message: 'Piano strategico caricato', timestamp: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
};
