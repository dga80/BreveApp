import React from 'react';

interface BottomNavProps {
  activeTab: 'chat' | 'dashboard' | 'knowledge';
  onTabChange: (tab: 'chat' | 'dashboard' | 'knowledge') => void;
  activePrescriptionsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activePrescriptionsCount = 0
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(15,118,110,0.04)] md:hidden">
      <div className="flex justify-around items-center px-4 py-2 pb-safe w-full max-w-md mx-auto">
        
        {/* Consulta / Chat */}
        <button
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center justify-center text-[11px] w-20 py-1 transition-all active:scale-95 ${
            activeTab === 'chat' ? 'text-primary font-bold' : 'text-primary/70'
          }`}
        >
          <div className={`w-12 h-7 flex items-center justify-center rounded-full mb-0.5 transition-all ${
            activeTab === 'chat' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low'
          }`}>
            <span className={`material-symbols-outlined text-xl ${activeTab === 'chat' ? 'text-white' : 'text-primary'}`}>
              forum
            </span>
          </div>
          <span className={activeTab === 'chat' ? 'text-primary font-bold' : 'text-primary'}>Consulta</span>
        </button>

        {/* Ficha & Cases */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center text-[11px] w-20 py-1 transition-all active:scale-95 relative ${
            activeTab === 'dashboard' ? 'text-primary font-bold' : 'text-primary/70'
          }`}
        >
          <div className={`w-12 h-7 flex items-center justify-center rounded-full mb-0.5 transition-all ${
            activeTab === 'dashboard' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low'
          }`}>
            <span className={`material-symbols-outlined text-xl ${activeTab === 'dashboard' ? 'text-white' : 'text-primary'}`}>
              analytics
            </span>
            {activePrescriptionsCount > 0 && (
              <span className="absolute top-1 right-3 bg-tertiary-container text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activePrescriptionsCount}
              </span>
            )}
          </div>
          <span className={activeTab === 'dashboard' ? 'text-primary font-bold' : 'text-primary'}>Ficha</span>
        </button>

        {/* Biblioteca */}
        <button
          onClick={() => onTabChange('knowledge')}
          className={`flex flex-col items-center justify-center text-[11px] w-20 py-1 transition-all active:scale-95 ${
            activeTab === 'knowledge' ? 'text-primary font-bold' : 'text-primary/70'
          }`}
        >
          <div className={`w-12 h-7 flex items-center justify-center rounded-full mb-0.5 transition-all ${
            activeTab === 'knowledge' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low'
          }`}>
            <span className={`material-symbols-outlined text-xl ${activeTab === 'knowledge' ? 'text-white' : 'text-primary'}`}>
              menu_book
            </span>
          </div>
          <span className={activeTab === 'knowledge' ? 'text-primary font-bold' : 'text-primary'}>Biblioteca</span>
        </button>

      </div>
    </nav>
  );
};
