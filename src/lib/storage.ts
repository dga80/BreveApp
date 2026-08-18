import { CaseProfile, ChatSession, AppSettings } from '../types';

const SETTINGS_KEY = 'breveapp_settings';
const CASES_KEY = 'breveapp_cases';
const SESSIONS_KEY = 'breveapp_sessions';
const ACTIVE_CASE_KEY = 'breveapp_active_case_id';

// Default initial settings
export const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  modelName: 'gemini-2.5-flash',
  enableSearchGrounding: true,
  githubRepo: 'dga80/BreveApp',
  githubBranch: 'main',
  syncEnabled: false
};

// Initial default demo case
export const DEFAULT_CASES: CaseProfile[] = [
  {
    id: 'case_default_1',
    title: 'Caso de ejemplo - Rutinas y pantallas',
    childName: 'Lucas',
    childAge: '7 años',
    mainIssue: 'Dificultad para apagar la tablet al terminar el tiempo pactado y constantes quejas para vestirse por las mañanas.',
    attemptedSolutions: [
      'Avisarle 4 o 5 veces antes de apagar',
      'Amenazar con no ver dibujos en una semana',
      'Ayudarle a vestirse corriendo para no llegar tarde'
    ],
    prescriptions: [
      {
        id: 'rx_demo_1',
        title: 'La regla del aviso único con alarma visible',
        description: 'Poner un reloj de arena o alarma en la tablet. Al sonar, se apaga sin discursos ni discusiones.',
        category: 'pantallas',
        assignedDate: new Date().toLocaleDateString('es-ES'),
        completed: false,
        notes: 'Listo para probar esta tarde.'
      }
    ],
    notes: [
      'Primera evaluación: Los padres están agotados de repetir lo mismo todos los días. Se reestructura para pasar de la palabra a la acción serena.'
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const StorageManager = {
  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Cases
  getCases(): CaseProfile[] {
    try {
      const data = localStorage.getItem(CASES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading cases:', e);
    }
    // Return default cases if empty
    this.saveCases(DEFAULT_CASES);
    return DEFAULT_CASES;
  },

  saveCases(cases: CaseProfile[]): void {
    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  },

  getActiveCaseId(): string {
    const active = localStorage.getItem(ACTIVE_CASE_KEY);
    if (active) return active;
    const cases = this.getCases();
    if (cases.length > 0) {
      this.setActiveCaseId(cases[0].id);
      return cases[0].id;
    }
    return '';
  },

  setActiveCaseId(id: string): void {
    localStorage.setItem(ACTIVE_CASE_KEY, id);
  },

  // Sessions
  getSessions(): Record<string, ChatSession> {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading sessions:', e);
    }
    return {};
  },

  getSessionByCaseId(caseId: string): ChatSession {
    const sessions = this.getSessions();
    if (sessions[caseId]) {
      return sessions[caseId];
    }
    // Create new session for this case
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      caseId: caseId,
      messages: [
        {
          id: 'welcome_msg',
          role: 'assistant',
          content: `¡Hola! Soy tu **Consultor y Terapeuta Virtual en Terapia Breve Estratégica**, basado en el enfoque clínico y las obras de **Maribel Martínez** (*«¿Cuántas veces te lo tengo que decir?»*, *«Niños sin miedos»*).\n\n¿En qué situación familiar o de crianza os encontráis encallados hoy? Cuéntame qué está ocurriendo y, sobre todo, **qué habéis intentado ya para solucionarlo**.`,
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    sessions[caseId] = newSession;
    this.saveSessions(sessions);
    return newSession;
  },

  saveSessions(sessions: Record<string, ChatSession>): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  saveSession(session: ChatSession): void {
    const sessions = this.getSessions();
    sessions[session.caseId] = session;
    this.saveSessions(sessions);
  },

  // Export / Import all data
  exportAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      cases: this.getCases(),
      sessions: this.getSessions(),
      settings: { ...this.getSettings(), geminiApiKey: '', githubToken: '' } // Don't export secret tokens
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.cases) this.saveCases(data.cases);
      if (data.sessions) this.saveSessions(data.sessions);
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  },

  // Sincronización con GitHub REST API
  async syncWithGitHub(token: string, repo: string, branch = 'main'): Promise<{ success: boolean; message: string }> {
    if (!token || !repo) {
      return { success: false, message: 'Falta configurar el Token de GitHub o el repositorio (ej. dga80/BreveApp).' };
    }

    try {
      const cases = this.getCases();
      const sessions = this.getSessions();
      const contentPayload = {
        updatedAt: new Date().toISOString(),
        cases,
        sessions
      };

      const path = 'data/persistence_store.json';
      const fileUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

      // Check if file already exists to get its SHA
      let currentSha: string | undefined;
      try {
        const getRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          currentSha = fileData.sha;
        }
      } catch (err) {
        // file doesn't exist yet, proceed
      }

      // Encode content in base64 (browser utf-8 safe)
      const jsonStr = JSON.stringify(contentPayload, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonStr)));

      const commitBody: any = {
        message: `Sync BreveApp data [${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}]`,
        content: encodedContent,
        branch: branch
      };
      if (currentSha) {
        commitBody.sha = currentSha;
      }

      const putRes = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(commitBody)
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Error HTTP ${putRes.status}`);
      }

      return { success: true, message: '¡Datos sincronizados con éxito en GitHub!' };
    } catch (error: any) {
      console.error('Error syncing with GitHub:', error);
      return { success: false, message: `Error al sincronizar con GitHub: ${error.message}` };
    }
  }
};
