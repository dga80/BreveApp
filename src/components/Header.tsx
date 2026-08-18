import React from 'react';
import { Sparkles, Settings, BookOpen, FolderHeart, Plus, RefreshCw, MessageSquare } from 'lucide-react';
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
  const activePrescriptionsCount = activeCase?.prescriptions?.filter(p => !p.completed).length || 0;

  return (
    <header className="bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-highest sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Fila Principal */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo y Marca */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-stitch-lightMint" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-on-surface tracking-tight">BreveApp</span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full">
                PRAGMAPP TBE
              </span>
            </div>
          </div>

          {/* Fila Derecha: Selector de Casos y Ajustes */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Selector de Casos */}
            <div className="flex items-center space-x-0.5 bg-surface-container-low p-1 rounded-xl border border-surface-container-highest">
              <select
                value={activeCaseId}
                onChange={(e) => onSelectCase(e.target.value)}
                className="bg-transparent text-xs font-medium text-on-surface py-0.5 px-1.5 focus:outline-none cursor-pointer max-w-[110px] xs:max-w-[140px] sm:max-w-[200px] truncate"
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
                className="p-1 hover:bg-surface-container-lowest text-on-surface-variant hover:text-primary rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Pestañas de Navegación en Desktop */}
            <nav className="hidden md:flex space-x-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-highest text-xs font-medium">
              <button
                onClick={() => onTabChange('chat')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeTab === 'chat'
                    ? 'bg-primary text-white font-medium shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consulta</span>
              </button>

              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary text-white font-medium shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>Ficha y Pautas</span>
                {activePrescriptionsCount > 0 && (
                  <span className={`rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold ${
                    activeTab === 'dashboard' ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}>
                    {activePrescriptionsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('knowledge')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeTab === 'knowledge'
                    ? 'bg-primary text-white font-medium shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Biblioteca TBE</span>
              </button>
            </nav>

            {/* Ajustes */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-colors border border-transparent hover:border-surface-container-highest"
              title="Configuración de API Key y Sincronización"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

        {/* Fila Móvil Secundaria: Barra de Pestañas Flotante Móvil */}
        <div className="md:hidden pb-2 pt-0.5">
          <nav className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-highest text-xs font-medium">
            <button
              onClick={() => onTabChange('chat')}
              className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Consulta</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>Ficha</span>
              {activePrescriptionsCount > 0 && (
                <span className={`rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold ${
                  activeTab === 'dashboard' ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {activePrescriptionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('knowledge')}
              className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca</span>
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
};
