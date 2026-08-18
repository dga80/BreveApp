import React, { useState } from 'react';
import { CaseProfile, Prescription } from '../types';

interface CaseDashboardProps {
  activeCase: CaseProfile;
  onUpdateCase: (updated: CaseProfile) => void;
  onDeleteCase: (id: string) => void;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({
  activeCase,
  onUpdateCase,
  onDeleteCase
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pautas' | 'soluciones' | 'notas'>('pautas');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [title, setTitle] = useState(activeCase.title);
  const [childName, setChildName] = useState(activeCase.childName || '');
  const [childAge, setChildAge] = useState(activeCase.childAge || '');
  const [mainIssue, setMainIssue] = useState(activeCase.mainIssue || '');
  
  // New Attempted Solution
  const [newSolution, setNewSolution] = useState('');
  
  // New Note
  const [newNote, setNewNote] = useState('');

  // New Prescription Modal
  const [showAddRx, setShowAddRx] = useState(false);
  const [rxTitle, setRxTitle] = useState('');
  const [rxDesc, setRxDesc] = useState('');

  const handleSaveProfile = () => {
    onUpdateCase({
      ...activeCase,
      title: title.trim() || 'Caso sin título',
      childName: childName.trim(),
      childAge: childAge.trim(),
      mainIssue: mainIssue.trim(),
      updatedAt: Date.now()
    });
    setIsEditingProfile(false);
  };

  const handleAddAttemptedSolution = () => {
    if (!newSolution.trim()) return;
    const list = [...activeCase.attemptedSolutions, newSolution.trim()];
    onUpdateCase({
      ...activeCase,
      attemptedSolutions: list,
      updatedAt: Date.now()
    });
    setNewSolution('');
  };

  const handleRemoveAttemptedSolution = (idx: number) => {
    const list = activeCase.attemptedSolutions.filter((_, i) => i !== idx);
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
    const list = [fullNote, ...activeCase.notes];
    onUpdateCase({
      ...activeCase,
      notes: list,
      updatedAt: Date.now()
    });
    setNewNote('');
  };

  const handleRemoveNote = (idx: number) => {
    const list = activeCase.notes.filter((_, i) => i !== idx);
    onUpdateCase({
      ...activeCase,
      notes: list,
      updatedAt: Date.now()
    });
  };

  const handleTogglePrescription = (rxId: string) => {
    const updated = activeCase.prescriptions.map((p) =>
      p.id === rxId ? { ...p, completed: !p.completed } : p
    );
    onUpdateCase({
      ...activeCase,
      prescriptions: updated,
      updatedAt: Date.now()
    });
  };

  const handleDeletePrescription = (rxId: string) => {
    const updated = activeCase.prescriptions.filter((p) => p.id !== rxId);
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
      prescriptions: [newRx, ...activeCase.prescriptions],
      updatedAt: Date.now()
    });
    setRxTitle('');
    setRxDesc('');
    setShowAddRx(false);
  };

  const activeRxs = activeCase.prescriptions.filter((p) => !p.completed);
  const completedRxs = activeCase.prescriptions.filter((p) => p.completed);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 bg-background min-h-[calc(100vh-4rem)] pb-24">
      
      {/* Sección del Perfil Infantil (Stitch Child Profile Section) */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,118,110,0.04)] flex items-center gap-4 relative overflow-hidden border border-outline-variant/20">
        <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
        <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl shrink-0 border-2 border-surface">
          {activeCase.childName ? activeCase.childName[0].toUpperCase() : 'L'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h1 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface font-display truncate">
              {activeCase.childName || activeCase.title} {activeCase.childAge ? `, ${activeCase.childAge}` : ''}
            </h1>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs text-outline hover:text-primary p-1"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>
          <p className="font-body-sm text-xs text-outline flex items-center gap-1 mt-0.5 truncate">
            <span className="material-symbols-outlined text-sm">psychology</span> Foco: {activeCase.mainIssue || 'Dificultad de límites'}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-11 h-11 rounded-full border-3 border-secondary-container text-secondary font-label-md text-xs font-bold shrink-0">
          60%
        </div>
      </section>

      {/* Formulario de Edición de Ficha */}
      {isEditingProfile && (
        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3 text-xs">
          <div>
            <label className="font-semibold text-on-surface">Título del caso / Familia:</label>
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
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-on-surface">Edad:</label>
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-on-surface">Motivo de consulta:</label>
            <textarea
              value={mainIssue}
              onChange={(e) => setMainIssue(e.target.value)}
              rows={2}
              className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
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

      {/* Barra de Pestañas de la Ficha (Stitch Tab Bar) */}
      <nav className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-outline-variant/20">
        <button
          onClick={() => setActiveSubTab('pautas')}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-label-md text-xs font-semibold transition-colors ${
            activeSubTab === 'pautas'
              ? 'bg-primary text-white font-bold shadow-xs'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Pautas Activas ({activeRxs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('soluciones')}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-label-md text-xs font-semibold transition-colors ${
            activeSubTab === 'soluciones'
              ? 'bg-primary text-white font-bold shadow-xs'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Soluciones Intentadas ({activeCase.attemptedSolutions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('notas')}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-label-md text-xs font-semibold transition-colors ${
            activeSubTab === 'notas'
              ? 'bg-primary text-white font-bold shadow-xs'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Notas de Evolución ({activeCase.notes.length})
        </button>
      </nav>

      {/* Pautas Activas Section */}
      {activeSubTab === 'pautas' && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-lg font-bold text-on-surface">Pautas Activas</h2>
            <button
              onClick={() => setShowAddRx(!showAddRx)}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded-xl font-medium flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span> Nueva Pauta
            </button>
          </div>

          {showAddRx && (
            <form onSubmit={handleCreatePrescription} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Título de la pauta conductual..."
                value={rxTitle}
                onChange={(e) => setRxTitle(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
              />
              <textarea
                placeholder="Instrucciones paso a paso..."
                rows={2}
                value={rxDesc}
                onChange={(e) => setRxDesc(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-1.5 bg-primary text-white rounded-xl font-semibold">
                  Asignar Pauta
                </button>
              </div>
            </form>
          )}

          {activeRxs.length === 0 ? (
            <div className="text-center py-8 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-3xl text-primary/40 mb-2">assignment</span>
              <p className="text-xs font-semibold text-on-surface">No hay pautas activas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRxs.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(15,118,110,0.04)] relative overflow-hidden p-4 pl-6 flex justify-between items-center group cursor-pointer border border-outline-variant/20"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-tertiary-container"></div>
                  <div>
                    <h3 className="font-label-md text-sm font-semibold text-on-surface mb-0.5">{rx.title}</h3>
                    <p className="font-body-sm text-xs text-outline line-clamp-1">{rx.description || 'En curso - Terapia Breve'}</p>
                  </div>
                  <button
                    onClick={() => handleTogglePrescription(rx.id)}
                    className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {completedRxs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-outline-variant/20">
              <h3 className="font-label-md text-xs font-bold text-outline uppercase tracking-wider mb-2">Completadas</h3>
              <div className="space-y-2">
                {completedRxs.map((rx) => (
                  <div key={rx.id} className="bg-surface-container-low rounded-xl p-3 flex justify-between items-center opacity-70">
                    <span className="text-xs line-through text-on-surface-variant">{rx.title}</span>
                    <button onClick={() => handleTogglePrescription(rx.id)} className="text-secondary">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Soluciones Intentadas Section (Stitch Attempted Solutions Section) */}
      {activeSubTab === 'soluciones' && (
        <section className="flex flex-col gap-4 bg-error-container/20 p-6 rounded-2xl border border-error-container/40">
          <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            Soluciones Intentadas Erróneas <span className="text-tertiary font-body-sm text-xs font-normal">(A Evitar)</span>
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Identificar lo que <strong>ya habéis intentado y no ha funcionado</strong> evita repetir el mismo círculo vicioso.
          </p>

          <ul className="flex flex-col gap-2.5">
            {activeCase.attemptedSolutions.map((sol, idx) => (
              <li key={idx} className="flex items-center justify-between gap-3 p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-error-container/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-xl">block</span>
                  <span className="font-body-md text-xs text-on-surface font-medium">{sol}</span>
                </div>
                <button onClick={() => handleRemoveAttemptedSolution(idx)} className="text-outline hover:text-red-600">
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Añadir solución intentada fallida (ej. Dar sermones largos)..."
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddAttemptedSolution();
              }}
              className="flex-1 px-3 py-2 text-xs bg-surface-container-lowest border border-error-container/40 rounded-xl"
            />
            <button onClick={handleAddAttemptedSolution} className="px-3.5 py-2 bg-tertiary text-white rounded-xl text-xs font-semibold">
              Añadir
            </button>
          </div>
        </section>
      )}

      {/* Notas de Evolución Section */}
      {activeSubTab === 'notas' && (
        <section className="flex flex-col gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20">
          <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
            Diario de Evolución Terapéutica
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Anotar observación de la semana..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNote();
              }}
              className="flex-1 px-3.5 py-2 text-xs bg-surface-container-low border border-outline-variant/30 rounded-xl"
            />
            <button onClick={handleAddNote} className="px-4 py-2 bg-on-surface text-surface rounded-xl text-xs font-semibold">
              Anotar
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pt-2">
            {activeCase.notes.map((note, idx) => (
              <div key={idx} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-start justify-between gap-2 text-xs text-on-surface">
                <span>{note}</span>
                <button onClick={() => handleRemoveNote(idx)} className="text-outline hover:text-red-500">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
