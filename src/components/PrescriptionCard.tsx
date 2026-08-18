import React from 'react';
import { CheckCircle2, Circle, Calendar, Trash2 } from 'lucide-react';
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
        return 'bg-primary/10 text-primary border-primary/20';
      case 'rabietas':
        return 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20';
      case 'estudio':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rutinas':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'miedos':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-surface-container-low text-on-surface-variant border-surface-container-highest';
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${
        prescription.completed
          ? 'bg-surface-container-low/70 border-surface-container-highest opacity-75'
          : 'bg-surface-container-lowest border-primary/20 shadow-2xs hover:border-primary/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => onToggleComplete(prescription.id)}
          className="mt-0.5 text-primary hover:text-primary/80 transition-colors focus:outline-none shrink-0"
          title={prescription.completed ? "Marcar como pendiente" : "Marcar como completada"}
        >
          {prescription.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 text-on-surface-variant/40 hover:text-primary" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4
              className={`text-sm font-semibold ${
                prescription.completed ? 'line-through text-on-surface-variant/60' : 'text-on-surface font-heading'
              }`}
            >
              {prescription.title}
            </h4>
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(
                prescription.category
              )}`}
            >
              {prescription.category}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
            {prescription.description}
          </p>

          <div className="flex items-center justify-between text-[11px] text-on-surface-variant/60 pt-2 border-t border-surface-container-highest">
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
