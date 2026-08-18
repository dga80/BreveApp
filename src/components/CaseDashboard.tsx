import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  ListTodo, 
  X, 
  Sparkles,
  ArrowRight
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Cabecera de la Ficha */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900">{activeCase.title}</h2>
              <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full font-semibold border border-teal-200">
                Ficha Activa
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Hijo/a: <span className="font-semibold text-stone-700">{activeCase.childName || 'No definido'}</span> ({activeCase.childAge || 'Edad no definida'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-semibold transition-colors"
            >
              {isEditingProfile ? 'Cancelar' : 'Editar Ficha'}
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Seguro que deseas eliminar la ficha "${activeCase.title}"?`)) {
                  onDeleteCase(activeCase.id);
                }
              }}
              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Eliminar caso"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulario de Edición de Ficha */}
        {isEditingProfile ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700">Título del Caso / Familia:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700">Nombre del hijo/a:</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700">Edad:</label>
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700">Motivo principal de consulta / Problema:</label>
              <textarea
                value={mainIssue}
                onChange={(e) => setMainIssue(e.target.value)}
                rows={2}
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-xs text-stone-600 bg-stone-50/70 p-3.5 rounded-xl border border-stone-100">
            <span className="font-semibold text-stone-800">Motivo de consulta: </span>
            {activeCase.mainIssue || 'No especificado aún. Utiliza el chat para iniciar la exploración.'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (2 cols): Pautas y Prescripciones */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tarjeta de Prescripciones Activas */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <ListTodo className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-stone-900">
                  Pautas Estratégicas Activas ({activeRxs.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddRx(true)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva Pauta
              </button>
            </div>

            {/* Modal para añadir pauta manual */}
            {showAddRx && (
              <form onSubmit={handleCreatePrescription} className="mb-4 bg-teal-50/60 border border-teal-200 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span>Añadir pauta de intervención</span>
                  <button type="button" onClick={() => setShowAddRx(false)} className="text-stone-400 hover:text-stone-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Título de la Pauta / Tarea:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. La regla del aviso único para la cena"
                    value={rxTitle}
                    onChange={(e) => setRxTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Cómo aplicarla (instrucciones breves):</label>
                  <textarea
                    placeholder="Explicar qué deben hacer los padres exactamente..."
                    rows={2}
                    value={rxDesc}
                    onChange={(e) => setRxDesc(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={rxCat}
                    onChange={(e) => setRxCat(e.target.value as any)}
                    className="bg-white border border-stone-300 px-3 py-1.5 rounded-lg text-xs"
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
                    className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
                  >
                    Asignar Pauta
                  </button>
                </div>
              </form>
            )}

            {/* Listado de pautas activas */}
            {activeRxs.length === 0 ? (
              <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <Sparkles className="w-8 h-8 text-teal-500/50 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-600">No hay pautas activas en este momento</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Consulta con el terapeuta en el chat para que te prescriba tareas concretas o añade una manualmente.
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
              <div className="mt-6 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Pautas Completadas / Superadas ({completedRxs.length})
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

          {/* Notas de Evolución Terapéutica */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900">
                Diario y Notas de Evolución
              </h3>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Añadir una observación o resultado de la semana (ej: 'El miércoles funcionó apagar con la alarma sin quejarse')..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddNote();
                }}
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Anotar</span>
              </button>
            </div>

            {activeCase.notes.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No hay notas de seguimiento registradas.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeCase.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start justify-between gap-2 text-xs text-stone-700"
                  >
                    <span>{note}</span>
                    <button
                      onClick={() => handleRemoveNote(idx)}
                      className="text-stone-300 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Columna Derecha (1 col): Soluciones intentadas que fallan (Concepto clave TBE) */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-2xl border border-amber-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Soluciones Intentadas Erróneas</span>
            </div>
            <p className="text-[11px] text-amber-800/80 mb-3 leading-relaxed">
              En Terapia Breve Estratégica, registrar lo que <strong>no funciona</strong> es vital para dejar de repetirlo y bloquear el círculo vicioso.
            </p>

            <div className="space-y-2 mb-3">
              {activeCase.attemptedSolutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-lg border border-amber-200/60 flex items-center justify-between gap-2 text-xs text-stone-800"
                >
                  <span className="flex-1 font-medium">❌ {sol}</span>
                  <button
                    onClick={() => handleRemoveAttemptedSolution(idx)}
                    className="text-stone-300 hover:text-red-500 shrink-0"
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
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={handleAddAttemptedSolution}
                className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Tarjeta de recordatorio clínico */}
          <div className="bg-teal-900 text-white rounded-2xl p-5 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300 mb-2">
              Axioma de Maribel Martínez
            </h4>
            <blockquote className="text-xs italic text-teal-100 leading-relaxed mb-3">
              «Educar no es convencer a base de sermones ni allanar todo el camino. Educar es dar seguridad con amor y límites claros desde la calma del adulto.»
            </blockquote>
            <span className="text-[11px] text-teal-400 font-semibold block text-right">
              — ¿Cuántas veces te lo tengo que decir?
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
