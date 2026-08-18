import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { CaseDashboard } from './components/CaseDashboard';
import { KnowledgeLibrary } from './components/KnowledgeLibrary';
import { SettingsModal } from './components/SettingsModal';
import { CaseProfile, ChatSession, AppSettings, Message, Prescription } from './types';
import { StorageManager, DEFAULT_SETTINGS } from './lib/storage';
import { sendChatMessage } from './lib/gemini';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = StorageManager.getSettings();
    // If not set, check Vite env vars
    if (!s.geminiApiKey) {
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';
      if (envKey) {
        s.geminiApiKey = envKey;
      }
    }
    return s;
  });

  const [cases, setCases] = useState<CaseProfile[]>(() => StorageManager.getCases());
  const [activeCaseId, setActiveCaseId] = useState<string>(() => StorageManager.getActiveCaseId());
  const [session, setSession] = useState<ChatSession>(() => StorageManager.getSessionByCaseId(activeCaseId || cases[0]?.id || ''));
  
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'knowledge'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Active case object
  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  // Sync state on activeCaseId change
  useEffect(() => {
    if (activeCaseId) {
      StorageManager.setActiveCaseId(activeCaseId);
      const sess = StorageManager.getSessionByCaseId(activeCaseId);
      setSession(sess);
    }
  }, [activeCaseId]);

  // Handle sending a chat message to the therapist
  const handleSendMessage = async (content: string) => {
    if (!activeCase) return;

    // Check API Key
    if (!settings.geminiApiKey || settings.geminiApiKey.trim() === '') {
      setIsSettingsOpen(true);
      alert('Por favor, configura tu API Key de Gemini en los Ajustes para comenzar.');
      return;
    }

    const userMessage: Message = {
      id: 'msg_u_' + Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const updatedMessages = [...session.messages, userMessage];
    const newSession: ChatSession = {
      ...session,
      messages: updatedMessages,
      updatedAt: Date.now()
    };

    setSession(newSession);
    StorageManager.saveSession(newSession);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        apiKey: settings.geminiApiKey,
        modelName: settings.modelName,
        messages: updatedMessages,
        activeCase: activeCase,
        enableSearchGrounding: settings.enableSearchGrounding
      });

      const assistantMessage: Message = {
        id: 'msg_a_' + Date.now(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        prescriptions: response.prescriptions,
        sources: response.sources
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSession: ChatSession = {
        ...session,
        messages: finalMessages,
        updatedAt: Date.now()
      };

      setSession(finalSession);
      StorageManager.saveSession(finalSession);

      // If any prescription was automatically detected, suggest it or add it
      if (response.prescriptions && response.prescriptions.length > 0) {
        const existingIds = new Set(activeCase.prescriptions.map(p => p.title.toLowerCase()));
        const newRxs = response.prescriptions.filter(p => !existingIds.has(p.title.toLowerCase()));
        
        if (newRxs.length > 0) {
          const updatedCase: CaseProfile = {
            ...activeCase,
            prescriptions: [...newRxs, ...activeCase.prescriptions],
            updatedAt: Date.now()
          };
          handleUpdateCase(updatedCase);
        }
      }
    } catch (error: any) {
      console.error('Error al generar respuesta:', error);
      const errorMessage: Message = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ **Ha ocurrido un error al conectar con el terapeuta:**\n\n${error.message || 'Comprueba tu conexión y tu API Key en los Ajustes.'}`,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      const errSession: ChatSession = {
        ...session,
        messages: finalMessages,
        updatedAt: Date.now()
      };
      setSession(errSession);
      StorageManager.saveSession(errSession);
    } finally {
      setIsLoading(false);
    }
  };

  // Case management
  const handleNewCase = () => {
    const childName = prompt('Nombre del hijo/a o título del caso familiar (ej: "Sofía (9 años)"):');
    if (!childName) return;

    const newCase: CaseProfile = {
      id: 'case_' + Date.now(),
      title: `Caso ${childName.trim()}`,
      childName: childName.trim(),
      childAge: '',
      mainIssue: 'Nuevo caso familiar en evaluación.',
      attemptedSolutions: [],
      prescriptions: [],
      notes: [`[${new Date().toLocaleDateString('es-ES')}] Apertura de ficha para consulta.`],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);
    setActiveCaseId(newCase.id);
    setActiveTab('chat');
  };

  const handleUpdateCase = (updated: CaseProfile) => {
    const updatedCases = cases.map((c) => (c.id === updated.id ? updated : c));
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);
  };

  const handleDeleteCase = (id: string) => {
    if (cases.length <= 1) {
      alert('Debe existir al menos un caso activo.');
      return;
    }
    const updatedCases = cases.filter((c) => c.id !== id);
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);
    setActiveCaseId(updatedCases[0].id);
  };

  const handleAddPrescription = (prescription: Prescription) => {
    if (!activeCase) return;
    const exists = activeCase.prescriptions.some((p) => p.title === prescription.title);
    if (exists) {
      alert('Esta pauta ya está guardada en la ficha del caso.');
      return;
    }
    const updatedCase: CaseProfile = {
      ...activeCase,
      prescriptions: [prescription, ...activeCase.prescriptions],
      updatedAt: Date.now()
    };
    handleUpdateCase(updatedCase);
    alert(`¡Pauta "${prescription.title}" guardada en la Ficha del Caso!`);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageManager.saveSettings(newSettings);
  };

  const handleDataImported = () => {
    setCases(StorageManager.getCases());
    const actId = StorageManager.getActiveCaseId();
    setActiveCaseId(actId);
    setSession(StorageManager.getSessionByCaseId(actId));
    setIsSettingsOpen(false);
  };

  const handleApplyCasePromptFromLibrary = (promptText: string) => {
    setActiveTab('chat');
    handleSendMessage(promptText);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      {/* Header */}
      <Header
        cases={cases}
        activeCaseId={activeCase?.id || ''}
        onSelectCase={setActiveCaseId}
        onNewCase={handleNewCase}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatInterface
            messages={session?.messages || []}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeCase={activeCase}
            onAddPrescription={handleAddPrescription}
          />
        )}

        {activeTab === 'dashboard' && activeCase && (
          <CaseDashboard
            activeCase={activeCase}
            onUpdateCase={handleUpdateCase}
            onDeleteCase={handleDeleteCase}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeLibrary onApplyCasePrompt={handleApplyCasePromptFromLibrary} />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onDataImported={handleDataImported}
      />
    </div>
  );
};
export default App;
