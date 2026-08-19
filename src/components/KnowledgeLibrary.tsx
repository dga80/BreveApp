import React, { useState } from 'react';
import { KNOWLEDGE_CASES } from '../lib/knowledgeBase';

interface KnowledgeLibraryProps {
  onApplyCasePrompt: (prompt: string) => void;
}

export const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({ onApplyCasePrompt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCases = KNOWLEDGE_CASES.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keyRule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 bg-background min-h-[calc(100vh-4rem)] pb-24">
      
      {/* Sección de Búsqueda y Filtros estilo Stitch */}
      <section className="mb-6">
        <div className="relative w-full max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            type="text"
            placeholder="Buscar axiomas, casos o lecturas de TBE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl py-3 pl-12 pr-4 font-body-md text-sm text-on-surface placeholder:text-outline shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Pastillas de filtro (Adaptadas sin scroll lateral) */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {['all', 'pantallas', 'rabietas', 'estudio', 'rutinas', 'miedos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-label-md text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white font-bold shadow-xs border border-transparent'
                  : 'bg-surface-container-low text-primary hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {cat === 'all' ? 'Todos los Casos' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Bento Grid Layout para Items de la Biblioteca de Stitch */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta Principal Destacada: Axiomas Clínicos */}
        <article className="col-span-1 md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-outline-variant/20 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-tertiary-container flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-tertiary-container">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-tertiary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <span className="font-label-md text-xs font-bold text-tertiary-container uppercase tracking-wider">Axiomas Clínicos & Metodología</span>
            </div>
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mb-2 font-display">Fundamentos de Intervención Breve</h2>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Principios rectores de Maribel Martínez y la escuela de Terapia Breve Estratégica, enfocados en la resolución de problemas en el presente e interrupción de soluciones intentadas ineficaces.
            </p>
          </div>
          <div className="flex justify-between items-end mt-4 pt-3 border-t border-outline-variant/20">
            <span className="font-label-sm text-xs text-outline font-medium">12 Documentos Clínicos</span>
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </div>
        </article>

        {/* Tarjetas de Casos Tipo */}
        {filteredCases.map((item) => (
          <article
            key={item.id}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-soft border border-outline-variant/20 flex flex-col hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-secondary justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-wider">{item.category}</span>
                </div>
                <span className="font-label-sm text-[10px] text-outline">{item.source}</span>
              </div>

              <h3 className="font-headline-md text-base font-bold text-on-surface mb-2 font-display">{item.title}</h3>
              
              <div className="space-y-2.5 text-xs text-on-surface-variant mb-4">
                <p className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                  <strong className="text-tertiary block mb-0.5">⚠️ Error común (Solución fallida):</strong>
                  {item.attemptedSolutionFailed}
                </p>
                <p className="bg-primary-container/10 p-2.5 rounded-xl border border-primary/20 text-on-surface">
                  <strong className="text-primary block mb-0.5">🎯 Pauta Estratégica:</strong>
                  {item.prescription}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
              <span className="font-label-sm text-[11px] text-outline italic">Regla: {item.keyRule}</span>
              <button
                onClick={() =>
                  onApplyCasePrompt(
                    `Quiero consultar cómo aplicar la pauta estratégica para: "${item.title}". En nuestro caso ocurre lo siguiente: `
                  )
                }
                className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary hover:text-white transition-colors shrink-0"
                title="Consultar en el chat"
              >
                <span className="material-symbols-outlined text-base">forum</span>
              </button>
            </div>
          </article>
        ))}

      </section>

    </div>
  );
};
