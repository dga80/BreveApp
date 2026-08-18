import React, { useState } from 'react';
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  ListTodo, 
  X, 
  Sparkles,
  User,
  Activity,
  Calendar
} from 'lucide-react';
import { CaseProfile, Prescription } from '../types';
import { PrescriptionCard } from './PrescriptionCard';

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
  const [rxCat, setRxCat] = useState<Prescription['category']>('rutinas');

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
      category: rxCat,
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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-5 bg-surface">
      
      {/* Banner del Perfil Familiar (Estilo Stitch Case Dashboard) */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-highest">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-heading font-bold text-xl text-on-surface tracking-tight">{activeCase.title}</h2>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold border border-primary/20">
                  Ficha de Caso
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Hijo/a: <span className="font-semibold text-on-surface">{activeCase.childName || 'No definido'}</span> ({activeCase.childAge || 'Edad no especificada'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-1.5 border border-surface-container-highest text-on-surface hover:bg-surface-container-low rounded-xl text-xs font-semibold transition-colors"
            >
              {isEditingProfile ? 'Cancelar' : 'Editar Ficha'}
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Seguro que deseas eliminar la ficha "${activeCase.title}"?`)) {
                  onDeleteCase(activeCase.id);
                }
              }}
              className="p-2 text-on-surface-variant hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              title="Eliminar caso"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulario de Edición de Ficha */}
        {isEditingProfile ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-container-highest text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-on-surface">Título del Caso / Familia:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-on-surface">Nombre del hijo/a:</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-on-surface">Edad:</label>
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-on-surface">Motivo principal de consulta / Problema:</label>
              <textarea
                value={mainIssue}
                onChange={(e) => setMainIssue(e.target.value)}
                rows={2}
                className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-xs text-on-surface-variant bg-surface-container-low p-3.5 rounded-xl border border-surface-container-highest">
            <span className="font-semibold text-on-surface">Motivo de consulta: </span>
            {activeCase.mainIssue || 'No especificado aún. Utiliza la pestaña de Consulta para iniciar la exploración.'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Columna Izquierda (2 cols): Pautas Estratégicas Activas */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ListTodo className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-heading font-bold text-base text-on-surface">
                  Pautas Estratégicas Activas ({activeRxs.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddRx(true)}
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva Pauta
              </button>
            </div>

            {/* Modal para añadir pauta manual */}
            {showAddRx && (
              <form onSubmit={handleCreatePrescription} className="mb-4 bg-surface-container-low border border-primary/20 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-primary">
                  <span>Añadir pauta conductual</span>
                  <button type="button" onClick={() => setShowAddRx(false)} className="text-on-surface-variant hover:text-on-surface">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="font-semibold text-on-surface">Título de la Pauta / Tarea:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Regla del aviso único antes de apagar"
                    value={rxTitle}
                    onChange={(e) => setRxTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-on-surface">Cómo aplicarla (instrucciones paso a paso):</label>
                  <textarea
                    placeholder="Explicar qué deben hacer los padres exactamente..."
                    rows={2}
                    value={rxDesc}
                    onChange={(e) => setRxDesc(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={rxCat}
                    onChange={(e) => setRxCat(e.target.value as any)}
                    className="bg-surface-container-lowest border border-surface-container-highest px-3 py-1.5 rounded-xl text-xs"
                  >
                    <option value="rutinas">Rutinas y hábitos</option>
                    <option value="pantallas">Pantallas y tecnología</option>
                    <option value="rabietas">Rabietas y límites</option>
                    <option value="estudio">Deberes y estudio</option>
                    <option value="miedos">Miedos y fobias</option>
                    <option value="general">General</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90"
                  >
                    Asignar Pauta
                  </button>
                </div>
              </form>
            )}

            {/* Listado de pautas activas */}
            {activeRxs.length === 0 ? (
              <div className="text-center py-8 bg-surface-container-low rounded-xl border border-dashed border-surface-container-highest">
                <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                <p className="text-xs font-semibold text-on-surface">No hay pautas activas en este momento</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-1">
                  Pide una pauta al terapeuta en el chat o crea una manualmente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRxs.map((rx) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    onToggleComplete={handleTogglePrescription}
                    onDelete={handleDeletePrescription}
                  />
                ))}
              </div>
            )}

            {/* Pautas ya completadas */}
            {completedRxs.length > 0 && (
              <div className="mt-6 pt-4 border-t border-surface-container-highest">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                  Pautas Completadas ({completedRxs.length})
                </h4>
                <div className="space-y-2">
                  {completedRxs.map((rx) => (
                    <PrescriptionCard
                      key={rx.id}
                      prescription={rx}
                      onToggleComplete={handleTogglePrescription}
                      onDelete={handleDeletePrescription}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Diario de Evolución Terapéutica */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-base text-on-surface">
                Diario y Notas de Evolución
              </h3>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Añadir nota de evolución (ej. 'Hoy ha funcionado el aviso único sin gritos')..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddNote();
                }}
                className="flex-1 px-3.5 py-2 text-xs bg-surface-container-low border border-surface-container-highest rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleAddNote}
                className="px-3.5 py-2 bg-on-surface text-surface rounded-xl text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Anotar</span>
              </button>
            </div>

            {activeCase.notes.length === 0 ? (
              <p className="text-xs text-on-surface-variant/60 italic">No hay notas de seguimiento registradas.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeCase.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-container-low rounded-xl border border-surface-container-highest flex items-start justify-between gap-2 text-xs text-on-surface"
                  >
                    <span>{note}</span>
                    <button
                      onClick={() => handleRemoveNote(idx)}
                      className="text-on-surface-variant/40 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Columna Derecha: Soluciones Intentadas Erróneas */}
        <div className="space-y-5">
          
          <div className="bg-tertiary-container/10 rounded-2xl border border-tertiary-container/20 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-tertiary-container font-bold text-sm mb-2">
              <AlertCircle className="w-4 h-4 text-tertiary-container" />
              <span>Soluciones Intentadas Erróneas</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
              En Terapia Breve Estratégica, registrar lo que <strong>no funciona</strong> es vital para dejar de repetirlo y romper el círculo vicioso.
            </p>

            <div className="space-y-2 mb-3">
              {activeCase.attemptedSolutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest p-2.5 rounded-xl border border-tertiary-container/20 flex items-center justify-between gap-2 text-xs text-on-surface shadow-2xs"
                >
                  <span className="flex-1 font-medium">❌ {sol}</span>
                  <button
                    onClick={() => handleRemoveAttemptedSolution(idx)}
                    className="text-on-surface-variant/40 hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Ej. Repetir 5 veces 'a la ducha'..."
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddAttemptedSolution();
                }}
                className="flex-1 px-2.5 py-1.5 text-xs bg-surface-container-lowest border border-tertiary-container/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-tertiary-container"
              />
              <button
                onClick={handleAddAttemptedSolution}
                className="px-3 py-1.5 bg-tertiary-container text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Tarjeta de Axioma Clínico (Estilo Stitch) */}
          <div className="bg-primary text-white rounded-2xl p-5 shadow-xs">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stitch-lightMint mb-2">
              Axioma de Maribel Martínez
            </h4>
            <blockquote className="text-xs italic text-white/90 leading-relaxed mb-3">
              «Educar no es convencer a base de sermones ni allanar todo el camino. Educar es dar seguridad con amor y límites claros desde la calma del adulto.»
            </blockquote>
            <span className="text-[11px] text-stitch-lightMint font-semibold block text-right">
              — ¿Cuántas veces te lo tengo que decir?
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
