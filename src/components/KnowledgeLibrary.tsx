import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Introducción y principios de Maribel Martínez */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Metodología & Escuela de Maribel Martínez</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Principios de la Terapia Breve Estratégica en Familia
        </h2>
        <p className="text-sm text-teal-100 max-w-3xl leading-relaxed">
          La Terapia Breve Estratégica no busca las causas en el pasado lejano, sino cómo se mantiene el problema en el presente mediante las <strong>soluciones intentadas</strong> de los padres.
        </p>

        {/* Tarjetas de principios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {MARIBEL_PRINCIPLES.slice(0, 3).map((principle, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-1.5">{principle.title}</h3>
              <p className="text-xs text-teal-100/90 leading-relaxed">{principle.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por pantallas, rabietas, miedos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {['all', 'pantallas', 'rabietas', 'estudio', 'rutinas', 'miedos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'Todos los casos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Casos clínicos y pautas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  {item.category}
                </span>
                <span className="text-[11px] text-stone-400">{item.source}</span>
              </div>

              <h3 className="font-bold text-stone-900 text-sm mb-3">{item.title}</h3>

              <div className="space-y-3 text-xs">
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="font-semibold text-stone-800 block mb-0.5">⚠️ Error común (solución que falla):</span>
                  <p className="text-stone-600">{item.attemptedSolutionFailed}</p>
                </div>

                <div className="bg-teal-50/60 p-2.5 rounded-lg border border-teal-100">
                  <span className="font-semibold text-teal-900 block mb-0.5">🎯 Pauta Estratégica:</span>
                  <p className="text-teal-950">{item.prescription}</p>
                </div>

                <div className="flex items-center gap-1.5 text-stone-500 italic pt-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Regla de oro: {item.keyRule}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() =>
                  onApplyCasePrompt(
                    `Quiero consultar cómo aplicar la pauta estratégica para: "${item.title}". En nuestro caso ocurre lo siguiente: `
                  )
                }
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline"
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
