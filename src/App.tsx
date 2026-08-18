import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { CaseDashboard } from './components/CaseDashboard';
import { KnowledgeLibrary } from './components/KnowledgeLibrary';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { HistoryDrawer } from './components/HistoryDrawer';
import { CaseProfile, ChatSession, AppSettings, Message, Prescription } from './types';
import { StorageManager } from './lib/storage';
import { sendChatMessage } from './lib/gemini';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = StorageManager.getSettings();
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

  const activeCase = (cases || []).find((c) => c.id === activeCaseId) || cases[0];
  const activePrescriptionsCount = activeCase?.prescriptions?.filter(p => !p.completed).length || 0;

  useEffect(() => {
    if (activeCaseId) {
      StorageManager.setActiveCaseId(activeCaseId);
      const sess = StorageManager.getSessionByCaseId(activeCaseId);
      setSession(sess);
    }
  }, [activeCaseId]);

  const handleSendMessage = async (content: string) => {
    if (!activeCase) return;

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

    const updatedMessages = [...(session.messages || []), userMessage];
    const updatedSession = { ...session, messages: updatedMessages, updatedAt: Date.now() };
    setSession(updatedSession);
    StorageManager.saveSession(updatedSession);

    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        updatedMessages,
        activeCase,
        settings.geminiApiKey,
        settings.modelName || 'gemini-2.5-flash',
        settings.enableSearchGrounding ?? true
      );

      const assistantMessage: Message = {
        id: 'msg_a_' + Date.now(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        prescriptions: response.extractedPrescriptions,
        sources: response.sources
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSession = { ...session, messages: finalMessages, updatedAt: Date.now() };
      setSession(finalSession);
      StorageManager.saveSession(finalSession);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ **Error de conexión:** ${error.message || 'No se pudo comunicar con el servidor de IA.'}`,
        timestamp: Date.now()
      };
      const errorSession = { ...session, messages: [...updatedMessages, errorMessage], updatedAt: Date.now() };
      setSession(errorSession);
      StorageManager.saveSession(errorSession);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrescription = (prescription: Prescription) => {
    if (!activeCase) return;

    const exists = (activeCase.prescriptions || []).some(p => p.title === prescription.title);
    if (exists) {
      alert('Esta pauta ya está guardada en la ficha del caso.');
      return;
    }

    const updatedCase = {
      ...activeCase,
      prescriptions: [...(activeCase.prescriptions || []), prescription],
      updatedAt: Date.now()
    };

    const updatedCases = cases.map(c => c.id === activeCase.id ? updatedCase : c);
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);

    alert(`¡Pauta "${prescription.title}" guardada correctamente en la ficha!`);
  };

  const handleCreateNewCase = () => {
    const caseNum = cases.length + 1;
    const newCase: CaseProfile = {
      id: 'case_' + Date.now(),
      title: `Consulta #${caseNum}`,
      childName: '',
      childAge: '',
      mainIssue: 'Consulta de Terapia Breve Estratégica',
      attemptedSolutions: [],
      prescriptions: [],
      notes: [`[${new Date().toLocaleDateString('es-ES')}] Apertura de consulta en Pragmapp.`],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);
    setActiveCaseId(newCase.id);
    setActiveTab('chat');
  };

  const handleDeleteCase = (id: string) => {
    if (cases.length <= 1) {
      alert('Debe existir al menos una consulta en la aplicación.');
      return;
    }
    const updatedCases = cases.filter(c => c.id !== id);
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);
    if (activeCaseId === id) {
      setActiveCaseId(updatedCases[0].id);
    }
  };

  const handleUpdateCase = (updatedCase: CaseProfile) => {
    const updatedCases = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setCases(updatedCases);
    StorageManager.saveCases(updatedCases);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Header Superior */}
      <Header
        cases={cases}
        activeCaseId={activeCaseId}
        onSelectCase={(id) => {
          setActiveCaseId(id);
          setActiveTab('chat');
        }}
        onNewCase={handleCreateNewCase}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Drawer de Historial de Consultas */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        cases={cases}
        activeCaseId={activeCaseId}
        onSelectCase={(id) => {
          setActiveCaseId(id);
          setActiveTab('chat');
        }}
        onNewConsultation={handleCreateNewCase}
        onDeleteCase={handleDeleteCase}
      />

      {/* Contenido Principal por Pestañas */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-4 md:px-6 py-0 sm:py-4">
        {activeTab === 'chat' && (
          <ChatInterface
            messages={session?.messages || []}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeCase={activeCase}
            onAddPrescription={handleAddPrescription}
            onStartNewConsultation={handleCreateNewCase}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && activeCase && (
          <CaseDashboard
            caseProfile={activeCase}
            onUpdateCase={handleUpdateCase}
            onNavigateToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeLibrary
            onApplyStrategy={(prompt) => {
              setActiveTab('chat');
              handleSendMessage(prompt);
            }}
          />
        )}
      </main>

      {/* Navegación Móvil Inferior */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activePrescriptionsCount={activePrescriptionsCount}
      />

      {/* Modal de Configuración */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          StorageManager.saveSettings(newSettings);
        }}
        onDataImported={() => {
          setCases(StorageManager.getCases());
          setActiveCaseId(StorageManager.getActiveCaseId());
        }}
      />
    </div>
  );
};

export default App;
