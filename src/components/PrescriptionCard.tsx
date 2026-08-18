import React from 'react';
import { CheckCircle2, Circle, Calendar, Tag, Trash2 } from 'lucide-react';
import { Prescription } from '../types';

interface PrescriptionCardProps {
  prescription: Prescription;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onToggleComplete,
  onDelete
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'pantallas':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rabietas':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'estudio':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rutinas':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'miedos':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${
        prescription.completed
          ? 'bg-stone-50/80 border-stone-200 opacity-75'
          : 'bg-white border-teal-200 shadow-xs hover:border-teal-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => onToggleComplete(prescription.id)}
          className="mt-0.5 text-teal-600 hover:text-teal-700 transition-colors focus:outline-none shrink-0"
          title={prescription.completed ? "Marcar como pendiente" : "Marcar como completada"}
        >
          {prescription.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 text-stone-400 hover:text-teal-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4
              className={`text-sm font-semibold ${
                prescription.completed ? 'line-through text-stone-500' : 'text-stone-900'
              }`}
            >
              {prescription.title}
            </h4>
            <span
              className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(
                prescription.category
              )}`}
            >
              {prescription.category}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-2">
            {prescription.description}
          </p>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Asignada: {prescription.assignedDate}</span>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(prescription.id)}
                className="hover:text-red-500 transition-colors p-0.5"
                title="Eliminar pauta"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
