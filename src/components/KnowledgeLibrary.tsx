import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { MARIBEL_PRINCIPLES, KNOWLEDGE_CASES } from '../lib/knowledgeBase';

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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6 bg-surface">
      
      {/* Banner Principal - Metodología Maribel Martínez (Estilo Stitch) */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-2 text-stitch-lightMint text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-stitch-lightMint" />
          <span>Biblioteca Clínica & Metodología Maribel Martínez</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Principios de la Terapia Breve Estratégica
        </h2>
        <p className="text-sm text-white/90 max-w-3xl leading-relaxed">
          La Terapia Breve Estratégica no busca culpa en el pasado, sino identificar cómo se mantiene el problema en el presente mediante las <strong>soluciones intentadas</strong> erróneas de los padres.
        </p>

        {/* Tarjetas de Principios Fundamentales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {MARIBEL_PRINCIPLES.slice(0, 3).map((principle, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <h3 className="font-heading text-sm font-bold text-white mb-1.5">{principle.title}</h3>
              <p className="text-xs text-white/80 leading-relaxed">{principle.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador y Pastillas de Filtro */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar casos por pantallas, rabietas, miedos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-surface-container-highest rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs text-on-surface placeholder-on-surface-variant/50"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs no-scrollbar">
          {['all', 'pantallas', 'rabietas', 'estudio', 'rutinas', 'miedos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-surface-container-highest'
              }`}
            >
              {cat === 'all' ? 'Todos los casos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Casos Clínicos Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {item.category}
                </span>
                <span className="text-[11px] text-on-surface-variant/70">{item.source}</span>
              </div>

              <h3 className="font-heading font-bold text-on-surface text-base mb-3">{item.title}</h3>

              <div className="space-y-3 text-xs">
                <div className="bg-tertiary-container/10 p-3 rounded-xl border border-tertiary-container/20">
                  <span className="font-semibold text-tertiary-container block mb-0.5">⚠️ Error común (Solución intentada fallida):</span>
                  <p className="text-on-surface-variant">{item.attemptedSolutionFailed}</p>
                </div>

                <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                  <span className="font-semibold text-primary block mb-0.5">🎯 Pauta Estratégica:</span>
                  <p className="text-on-surface">{item.prescription}</p>
                </div>

                <div className="flex items-center gap-1.5 text-on-surface-variant/80 italic pt-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Regla de oro: {item.keyRule}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-container-highest flex justify-end">
              <button
                onClick={() =>
                  onApplyCasePrompt(
                    `Quiero consultar cómo aplicar la pauta estratégica para: "${item.title}". En nuestro caso ocurre lo siguiente: `
                  )
                }
                className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 hover:underline"
              >
                <span>Consultar caso en el chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
