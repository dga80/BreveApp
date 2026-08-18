import { CaseProfile, ChatSession, AppSettings } from '../types';

const SETTINGS_KEY = 'pragmapp_settings';
const CASES_KEY = 'pragmapp_cases';
const SESSIONS_KEY = 'pragmapp_sessions';
const ACTIVE_CASE_KEY = 'pragmapp_active_case_id';

export const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  modelName: 'gemini-2.5-flash',
  enableSearchGrounding: true,
  githubRepo: 'dga80/BreveApp',
  githubBranch: 'main',
  syncEnabled: false
};

// Default clean case without demo clutter
export const DEFAULT_CASES: CaseProfile[] = [
  {
    id: 'case_default_1',
    title: 'Nueva Consulta',
    childName: '',
    childAge: '',
    mainIssue: 'Consulta de Terapia Breve Estratégica Familiar',
    attemptedSolutions: [],
    prescriptions: [],
    notes: [
      `[${new Date().toLocaleDateString('es-ES')}] Apertura de ficha en Pragmapp.`
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const StorageManager = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem('breveapp_settings');
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

  getCases(): CaseProfile[] {
    try {
      const data = localStorage.getItem(CASES_KEY) || localStorage.getItem('breveapp_cases');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => ({
            ...c,
            attemptedSolutions: Array.isArray(c?.attemptedSolutions) ? c.attemptedSolutions : [],
            prescriptions: Array.isArray(c?.prescriptions) ? c.prescriptions : [],
            notes: Array.isArray(c?.notes) ? c.notes : []
          }));
        }
      }
    } catch (e) {
      console.error('Error loading cases:', e);
    }
    this.saveCases(DEFAULT_CASES);
    return DEFAULT_CASES;
  },

  saveCases(cases: CaseProfile[]): void {
    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  },

  getActiveCaseId(): string {
    const active = localStorage.getItem(ACTIVE_CASE_KEY) || localStorage.getItem('breveapp_active_case_id');
    if (active) return active;
    const cases = this.getCases();
    if (cases.length > 0) {
      this.setActiveCaseId(cases[0].id);
      return cases[0].id;
    }
    return 'case_default_1';
  },

  setActiveCaseId(id: string): void {
    localStorage.setItem(ACTIVE_CASE_KEY, id);
  },

  getSessions(): Record<string, ChatSession> {
    try {
      const data = localStorage.getItem(SESSIONS_KEY) || localStorage.getItem('breveapp_sessions');
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
      return {
        ...sessions[caseId],
        messages: Array.isArray(sessions[caseId]?.messages) ? sessions[caseId].messages : []
      };
    }
    // Create new session with empty messages array so user starts on Gemini landing page
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      caseId: caseId || 'case_default_1',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    sessions[caseId || 'case_default_1'] = newSession;
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

  exportAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      cases: this.getCases(),
      sessions: this.getSessions(),
      settings: { ...this.getSettings(), geminiApiKey: '', githubToken: '' }
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
        // file doesn't exist yet
      }

      const jsonStr = JSON.stringify(contentPayload, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonStr)));

      const commitBody: any = {
        message: `Sync Pragmapp data [${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}]`,
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
