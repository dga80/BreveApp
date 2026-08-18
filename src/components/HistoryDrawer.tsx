import React, { useState } from 'react';
import { X, Search, MessageSquare, Plus, Trash2, Calendar } from 'lucide-react';
import { CaseProfile } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseProfile[];
  activeCaseId: string;
  onSelectCase: (id: string) => void;
  onNewConsultation: () => void;
  onDeleteCase: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  cases,
  activeCaseId,
  onSelectCase,
  onNewConsultation,
  onDeleteCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCases = (cases || []).filter(
    (c) =>
      c?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.childName && c.childName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c?.mainIssue && c.mainIssue.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-sm h-full shadow-2xl flex flex-col border-r border-surface-container-highest">
        
        {/* Header del Historial */}
        <div className="p-4 border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl">history</span>
            <h2 className="font-heading font-bold text-base text-on-surface">Historial de Consultas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botón de Nueva Consulta Directa */}
        <div className="p-4 border-b border-surface-container-highest">
          <button
            onClick={() => {
              onNewConsultation();
              onClose();
            }}
            className="w-full bg-primary hover:bg-primary/90 text-stitch-lightMint rounded-xl py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
          >
            <Plus className="w-4 h-4 text-stitch-lightMint" />
            <span>Iniciar Nueva Consulta</span>
          </button>
        </div>

        {/* Buscador de Consultas */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar en el historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-surface-container-low border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Lista de Consultas Pasadas */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {filteredCases.length === 0 ? (
            <p className="text-xs text-on-surface-variant/60 text-center py-6">
              No se encontraron consultas registradas.
            </p>
          ) : (
            filteredCases.map((c) => {
              const isActive = c.id === activeCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCase(c.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isActive
                      ? 'bg-primary/10 border-primary/30 shadow-xs'
                      : 'bg-surface-container-low border-surface-container-highest hover:bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isActive ? 'bg-primary text-stitch-lightMint' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant/70 line-clamp-1 mt-0.5">
                        {c.mainIssue || 'Consulta abierta'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/50 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(c.createdAt || Date.now()).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>

                  {cases.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Eliminar la consulta "${c.title}" del historial?`)) {
                          onDeleteCase(c.id);
                        }
                      }}
                      className="text-on-surface-variant/30 hover:text-red-500 p-1 shrink-0"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-surface-container-highest text-[10px] text-on-surface-variant/60 text-center">
          Pragmapp • Terapia Breve Estratégica
        </div>

      </div>
    </div>
  );
};
