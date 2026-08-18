import React from 'react';
import { Sparkles, Settings, BookOpen, FolderHeart, Plus, RefreshCw } from 'lucide-react';
import { CaseProfile } from '../types';

interface HeaderProps {
  cases: CaseProfile[];
  activeCaseId: string;
  onSelectCase: (id: string) => void;
  onNewCase: () => void;
  activeTab: 'chat' | 'dashboard' | 'knowledge';
  onTabChange: (tab: 'chat' | 'dashboard' | 'knowledge') => void;
  onOpenSettings: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onNewCase,
  activeTab,
  onTabChange,
  onOpenSettings,
  isSyncing
}) => {
  const activeCase = cases.find(c => c.id === activeCaseId);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-stone-900 tracking-tight">BreveApp</span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200/60 rounded-full">
                  TBE Maribel Martínez
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Consultoría y Terapia Breve Estratégica Familiar
              </p>
            </div>
          </div>

          {/* Selector de caso y navegación */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Selector de Casos */}
            <div className="flex items-center space-x-1 bg-stone-100/80 p-1 rounded-lg border border-stone-200">
              <select
                value={activeCaseId}
                onChange={(e) => onSelectCase(e.target.value)}
                className="bg-transparent text-xs font-medium text-stone-800 py-1 px-2 focus:outline-none cursor-pointer max-w-[160px] sm:max-w-[220px] truncate"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <button
                onClick={onNewCase}
                title="Crear nuevo caso familiar"
                className="p-1 hover:bg-white text-stone-600 hover:text-teal-600 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas */}
            <nav className="flex space-x-1 bg-stone-100/80 p-1 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => onTabChange('chat')}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-teal-700 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <span>Consulta</span>
              </button>

              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-teal-700 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ficha & Pautas</span>
                {activeCase?.prescriptions?.filter(p => !p.completed).length ? (
                  <span className="bg-teal-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                    {activeCase.prescriptions.filter(p => !p.completed).length}
                  </span>
                ) : null}
              </button>

              <button
                onClick={() => onTabChange('knowledge')}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  activeTab === 'knowledge'
                    ? 'bg-white text-teal-700 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Biblioteca TBE</span>
              </button>
            </nav>

            {/* Ajustes */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-stone-600 hover:text-teal-700 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200"
              title="Configuración de API Key y GitHub"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
