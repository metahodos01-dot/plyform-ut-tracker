export const analyzeProjectWithAI = async (projectData, query) => {
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

export const generateTasksFromAI = async (objective, teamMembers) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) throw new Error("API Key mancante");

    const context = `
    Sei un Project Manager esperto.
    Obiettivo: "${objective.name}"
    Descrizione: "${objective.description}"
    Team Disponibile: ${JSON.stringify(teamMembers.map(m => ({ id: m.id, name: m.name, role: m.role })))}

    Genera una lista di 3-5 task operativi per raggiungere questo obiettivo.
    Per ogni task fornisci:
    - title: Titolo breve
    - description: Descrizione operativa
    - ownerId: ID del membro del team più adatto (scegli dal Team Disponibile)
    - definitionOfDone: Criteri di accettazione
    - estimatedHours: Stima ore (intero)

    Rispondi SOLAMENTE con un array JSON valido. Esempio:
    [
      { "title": "...", "description": "...", "ownerId": "...", "definitionOfDone": "...", "estimatedHours": 4 }
    ]
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
                    { role: "system", content: "Sei un assistente JSON. Rispondi solo con JSON valido." },
                    { role: "user", content: context }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        // Handle if API returns { tasks: [...] } or just [...]
        return Array.isArray(parsed) ? parsed : (parsed.tasks || []);
    } catch (error) {
        console.error("AI Task Generation Error:", error);
        throw error;
    }
};
