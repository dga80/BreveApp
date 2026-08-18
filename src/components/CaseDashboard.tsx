import React, { useState } from 'react';
import { CaseProfile, Prescription } from '../types';

interface CaseDashboardProps {
  caseProfile?: CaseProfile;
  activeCase?: CaseProfile;
  onUpdateCase: (updated: CaseProfile) => void;
  onNavigateToChat?: () => void;
  onDeleteCase?: (id: string) => void;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({
  caseProfile,
  activeCase: activeCaseProp,
  onUpdateCase,
  onNavigateToChat,
  onDeleteCase
}) => {
  const activeCase = caseProfile || activeCaseProp;

  const [activeSubTab, setActiveSubTab] = useState<'pautas' | 'soluciones' | 'notas'>('pautas');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [title, setTitle] = useState(activeCase?.title || 'Nueva Consulta');
  const [childName, setChildName] = useState(activeCase?.childName || '');
  const [childAge, setChildAge] = useState(activeCase?.childAge || '');
  const [mainIssue, setMainIssue] = useState(activeCase?.mainIssue || '');
  
  // New Attempted Solution
  const [newSolution, setNewSolution] = useState('');
  
  // New Note
  const [newNote, setNewNote] = useState('');

  // New Prescription Modal
  const [showAddRx, setShowAddRx] = useState(false);
  const [rxTitle, setRxTitle] = useState('');
  const [rxDesc, setRxDesc] = useState('');

  if (!activeCase) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center bg-background min-h-[calc(100vh-4rem)]">
        <h2 className="text-lg font-bold text-on-surface mb-2">No hay ninguna consulta seleccionada</h2>
        <p className="text-xs text-on-surface-variant mb-6">Selecciona o inicia una consulta desde el menú principal.</p>
        {onNavigateToChat && (
          <button
            onClick={onNavigateToChat}
            className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Ir a Consulta
          </button>
        )}
      </div>
    );
  }

  const handleSaveProfile = () => {
    onUpdateCase({
      ...activeCase,
      title: title.trim() || 'Consulta sin título',
      childName: childName.trim(),
      childAge: childAge.trim(),
      mainIssue: mainIssue.trim(),
      updatedAt: Date.now()
    });
    setIsEditingProfile(false);
  };

  const handleAddAttemptedSolution = () => {
    if (!newSolution.trim()) return;
    const list = [...(activeCase.attemptedSolutions || []), newSolution.trim()];
    onUpdateCase({
      ...activeCase,
      attemptedSolutions: list,
      updatedAt: Date.now()
    });
    setNewSolution('');
  };

  const handleRemoveAttemptedSolution = (idx: number) => {
    const list = (activeCase.attemptedSolutions || []).filter((_, i) => i !== idx);
    onUpdateCase({
      ...activeCase,
      attemptedSolutions: list,
      updatedAt: Date.now()
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const dateStr = new Date().toLocaleDateString('es-ES');
    const fullNote = `[${dateStr}] ${newNote.trim()}`;
    const list = [fullNote, ...(activeCase.notes || [])];
    onUpdateCase({
      ...activeCase,
      notes: list,
      updatedAt: Date.now()
    });
    setNewNote('');
  };

  const handleRemoveNote = (idx: number) => {
    const list = (activeCase.notes || []).filter((_, i) => i !== idx);
    onUpdateCase({
      ...activeCase,
      notes: list,
      updatedAt: Date.now()
    });
  };

  const handleTogglePrescription = (rxId: string) => {
    const updated = (activeCase.prescriptions || []).map((p) =>
      p.id === rxId ? { ...p, completed: !p.completed } : p
    );
    onUpdateCase({
      ...activeCase,
      prescriptions: updated,
      updatedAt: Date.now()
    });
  };

  const handleDeletePrescription = (rxId: string) => {
    const updated = (activeCase.prescriptions || []).filter((p) => p.id !== rxId);
    onUpdateCase({
      ...activeCase,
      prescriptions: updated,
      updatedAt: Date.now()
    });
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxTitle.trim()) return;
    const newRx: Prescription = {
      id: 'rx_' + Date.now(),
      title: rxTitle.trim(),
      description: rxDesc.trim(),
      category: 'rutinas',
      assignedDate: new Date().toLocaleDateString('es-ES'),
      completed: false
    };
    onUpdateCase({
      ...activeCase,
      prescriptions: [newRx, ...(activeCase.prescriptions || [])],
      updatedAt: Date.now()
    });
    setRxTitle('');
    setRxDesc('');
    setShowAddRx(false);
  };

  const activeRxs = (activeCase.prescriptions || []).filter((p) => !p.completed);
  const completedRxs = (activeCase.prescriptions || []).filter((p) => p.completed);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-6 bg-background min-h-[calc(100vh-4rem)] pb-24 overflow-x-hidden">
      
      {/* Sección del Perfil Infantil */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,118,110,0.04)] flex items-center gap-3 sm:gap-4 relative overflow-hidden border border-outline-variant/20 w-full">
        <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 border-2 border-surface">
          {activeCase.childName ? activeCase.childName[0].toUpperCase() : 'P'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h1 className="font-headline-lg text-base sm:text-xl font-bold text-on-surface font-display truncate">
              {activeCase.childName || activeCase.title} {activeCase.childAge ? `, ${activeCase.childAge}` : ''}
            </h1>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs text-outline hover:text-primary p-1 shrink-0"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>
          <p className="font-body-sm text-[11px] sm:text-xs text-outline flex items-center gap-1 mt-0.5 truncate">
            <span className="material-symbols-outlined text-sm">psychology</span> Foco: {activeCase.mainIssue || 'Consulta de Terapia Breve'}
          </p>
        </div>
      </section>

      {/* Formulario de Edición de Ficha */}
      {isEditingProfile && (
        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3 text-xs w-full">
          <div>
            <label className="font-semibold text-on-surface">Título del caso / Consulta:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-on-surface">Nombre del hijo/a:</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="ej. Lucas"
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-on-surface">Edad:</label>
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="ej. 8 años"
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-on-surface">Foco / Problema principal:</label>
            <textarea
              value={mainIssue}
              onChange={(e) => setMainIssue(e.target.value)}
              rows={2}
              className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-1.5 bg-primary text-white rounded-xl font-semibold shadow-xs"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* Barra de Pestañas de la Ficha (Grid de 3 columnas sin scroll lateral) */}
      <nav className="grid grid-cols-3 gap-1.5 border-b border-outline-variant/20 pb-2 w-full">
        <button
          onClick={() => setActiveSubTab('pautas')}
          className={`py-2 px-1 text-center rounded-xl text-[10px] sm:text-xs font-bold transition-all leading-tight truncate ${
            activeSubTab === 'pautas'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-container-low text-primary hover:bg-surface-container'
          }`}
        >
          Pautas ({activeRxs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('soluciones')}
          className={`py-2 px-1 text-center rounded-xl text-[10px] sm:text-xs font-bold transition-all leading-tight truncate ${
            activeSubTab === 'soluciones'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-container-low text-primary hover:bg-surface-container'
          }`}
        >
          Soluciones ({(activeCase.attemptedSolutions || []).length})
        </button>
        <button
          onClick={() => setActiveSubTab('notas')}
          className={`py-2 px-1 text-center rounded-xl text-[10px] sm:text-xs font-bold transition-all leading-tight truncate ${
            activeSubTab === 'notas'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-container-low text-primary hover:bg-surface-container'
          }`}
        >
          Evolución ({(activeCase.notes || []).length})
        </button>
      </nav>

      {/* Contenido Pautas */}
      {activeSubTab === 'pautas' && (
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-title-md text-xs sm:text-sm font-bold text-on-surface truncate">Pautas Recomendadas</h3>
            <button
              onClick={() => setShowAddRx(true)}
              className="text-[11px] sm:text-xs bg-primary/10 text-primary hover:bg-primary/20 font-bold px-2.5 py-1.5 rounded-xl border border-primary/20 flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">add</span> Nueva Pauta
            </button>
          </div>

          {showAddRx && (
            <form onSubmit={handleCreatePrescription} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-on-surface">Título de la pauta:</label>
                <input
                  type="text"
                  value={rxTitle}
                  onChange={(e) => setRxTitle(e.target.value)}
                  placeholder="ej. Experimento del silencio"
                  className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-on-surface">Instrucciones / Paso a paso:</label>
                <textarea
                  value={rxDesc}
                  onChange={(e) => setRxDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe cómo aplicarla..."
                  className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRx(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-white font-bold rounded-xl"
                >
                  Guardar Pauta
                </button>
              </div>
            </form>
          )}

          {activeRxs.length === 0 && completedRxs.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-6 text-center border border-outline-variant/20">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">assignment</span>
              <p className="text-xs text-on-surface-variant">No hay pautas registradas en esta consulta aún.</p>
              {onNavigateToChat && (
                <button
                  onClick={onNavigateToChat}
                  className="mt-3 text-xs text-primary font-bold hover:underline"
                >
                  Consultar al terapeuta virtual →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {activeRxs.map((rx) => (
                <div key={rx.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-start justify-between gap-3 shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-xs text-on-surface">{rx.title}</h4>
                    <p className="text-xs text-on-surface-variant">{rx.description}</p>
                    <span className="text-[10px] text-outline block mt-1">Asignada: {rx.assignedDate}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleTogglePrescription(rx.id)}
                      className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold"
                      title="Marcar como completada"
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                    </button>
                    <button
                      onClick={() => handleDeletePrescription(rx.id)}
                      className="p-1.5 text-outline hover:text-red-500 rounded-xl text-xs"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {completedRxs.length > 0 && (
                <div className="pt-4 border-t border-outline-variant/20">
                  <h4 className="text-xs font-bold text-outline mb-2">Pautas Completadas ({completedRxs.length})</h4>
                  <div className="space-y-2 opacity-60">
                    {completedRxs.map((rx) => (
                      <div key={rx.id} className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between text-xs">
                        <span className="line-through">{rx.title}</span>
                        <button
                          onClick={() => handleTogglePrescription(rx.id)}
                          className="text-primary hover:underline text-[11px]"
                        >
                          Reactivar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Contenido Soluciones Intentadas */}
      {activeSubTab === 'soluciones' && (
        <section className="space-y-4">
          <h3 className="font-title-md text-sm font-bold text-on-surface">Soluciones Intentadas que Han Fallado</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              placeholder="ej. Sermones de 20 minutos, Castigos sin consola..."
              className="flex-1 px-3 py-2 text-xs bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
            />
            <button
              onClick={handleAddAttemptedSolution}
              className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shrink-0"
            >
              Añadir
            </button>
          </div>

          {(activeCase.attemptedSolutions || []).length === 0 ? (
            <p className="text-xs text-on-surface-variant text-center py-6">No hay soluciones intentadas registradas.</p>
          ) : (
            <div className="space-y-2">
              {(activeCase.attemptedSolutions || []).map((sol, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 flex items-center justify-between text-xs">
                  <span className="text-on-surface">{sol}</span>
                  <button
                    onClick={() => handleRemoveAttemptedSolution(idx)}
                    className="text-outline hover:text-red-500 p-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Contenido Evolución / Notas */}
      {activeSubTab === 'notas' && (
        <section className="space-y-4">
          <h3 className="font-title-md text-sm font-bold text-on-surface">Notas de Evolución</h3>
          
          <div className="space-y-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={2}
              placeholder="Registra avances o cambios en la dinámica..."
              className="w-full px-3 py-2 text-xs bg-surface-container-lowest border border-outline-variant/30 rounded-xl resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddNote}
                className="px-4 py-1.5 bg-primary text-white font-bold text-xs rounded-xl"
              >
                Añadir Nota
              </button>
            </div>
          </div>

          {(activeCase.notes || []).length === 0 ? (
            <p className="text-xs text-on-surface-variant text-center py-6">No hay notas registradas en la evolución.</p>
          ) : (
            <div className="space-y-2">
              {(activeCase.notes || []).map((note, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 flex items-start justify-between text-xs gap-2">
                  <p className="text-on-surface whitespace-pre-wrap">{note}</p>
                  <button
                    onClick={() => handleRemoveNote(idx)}
                    className="text-outline hover:text-red-500 p-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
};
