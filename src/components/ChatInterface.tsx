import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, User, HelpCircle, ArrowRight, ShieldAlert, CheckCircle, Globe, RefreshCw, BookmarkPlus } from 'lucide-react';
import { Message, CaseProfile, Prescription } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  activeCase?: CaseProfile;
  onAddPrescription: (prescription: Prescription) => void;
}

const QUICK_TOPICS = [
  { label: '📱 Apagar pantallas sin drama', prompt: 'Tenemos una batalla constante cada vez que hay que apagar la tablet o los videojuegos. Cuando le aviso se enfada y monta un escándalo. ¿Qué pauta estratégica nos recomiendas?' },
  { label: '💥 Rabietas al decirle que no', prompt: 'Cuando le negamos un capricho o le ponemos un límite, estalla en una rabieta monumental y no sabemos cómo pararla sin acabar gritando o cediendo.' },
  { label: '📚 Batalla diaria con los deberes', prompt: 'Tardamos horas en hacer las tareas escolares. Si no estoy sentada encima de él no hace nada y se distrae constantemente.' },
  { label: '🛏️ Problemas para dormir solo', prompt: 'A la hora de dormir busca cualquier excusa (sed, miedo, otro cuento) y a mitad de la noche acaba metiéndose en nuestra cama.' },
  { label: '🔄 ¿Qué son las "Soluciones Intentadas"?', prompt: 'Explícame qué son las "soluciones intentadas" en Terapia Breve Estratégica y cómo podemos identificar si lo que estamos haciendo empeora el problema.' }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeCase,
  onAddPrescription
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 sm:px-6 py-4">
      
      {/* Banner del caso activo */}
      {activeCase && (
        <div className="bg-white/80 backdrop-blur-xs border border-stone-200/80 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-stone-900">{activeCase.title}</span>
            {activeCase.childAge && (
              <span className="text-xs text-stone-500">({activeCase.childAge})</span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 truncate max-w-[280px] hidden sm:block">
            {activeCase.mainIssue}
          </div>
        </div>
      )}

      {/* Área de mensajes con scroll */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-stone-800 text-white'
                    : 'bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Burbuja de contenido */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm ${
                  isUser
                    ? 'bg-stone-800 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Renderizado de Markdown */}
                <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-stone'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      strong: ({ children }) => <strong className="font-semibold text-teal-800">{children}</strong>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-3 border-teal-500 pl-3 my-2 text-stone-600 italic">
                          {children}
                        </blockquote>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {/* Fuentes de búsqueda si las hay */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-1.5 flex-wrap">
                    <Globe className="w-3 h-3 text-teal-600" />
                    <span className="font-medium text-stone-600">Fuentes consultadas:</span>
                    {message.sources.map((s, idx) => (
                      <span key={idx} className="bg-stone-100 px-1.5 py-0.5 rounded-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Si detectó prescripciones en esta respuesta */}
                {message.prescriptions && message.prescriptions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-teal-100 bg-teal-50/50 p-2.5 rounded-lg">
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-900 mb-1.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                        Pauta identificada para el caso
                      </span>
                    </div>
                    {message.prescriptions.map((rx) => (
                      <div key={rx.id} className="flex items-center justify-between gap-2 text-xs text-stone-700 bg-white p-2 rounded-md border border-teal-200">
                        <span className="font-medium">{rx.title}</span>
                        <button
                          onClick={() => onAddPrescription(rx)}
                          className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0"
                        >
                          <BookmarkPlus className="w-3 h-3" />
                          Guardar en Ficha
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isUser ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 shadow-xs">
              <div className="flex items-center space-x-2 text-xs text-stone-500">
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2 font-medium text-stone-600">Analizando el caso y preparando pautas estratégicas...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias Rápidas */}
      {messages.length <= 2 && (
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-teal-600" />
            Situaciones frecuentes para consultar:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(topic.prompt);
                  inputRef.current?.focus();
                }}
                className="text-xs bg-white hover:bg-teal-50 border border-stone-200 hover:border-teal-300 text-stone-700 hover:text-teal-800 rounded-full px-3 py-1.5 whitespace-nowrap transition-all shadow-2xs font-medium"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Caja de entrada de texto */}
      <form onSubmit={handleSubmit} className="relative bg-white border border-stone-200 rounded-2xl shadow-sm focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe la situación de tu hijo/a o qué dudas tienes (ej: 'No quiere apagar la tablet y montamos una batalla cada noche')..."
          rows={2}
          className="w-full bg-transparent px-4 pt-3 pb-10 text-sm text-stone-900 placeholder-stone-400 focus:outline-none resize-none"
        />

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Presiona <kbd className="bg-stone-100 border border-stone-300 rounded px-1 text-[10px]">Enter</kbd> para enviar
          </span>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              input.trim() && !isLoading
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs hover:shadow'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Consultar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Nota de pie */}
      <p className="text-[11px] text-stone-400 text-center mt-2">
        BreveApp es una herramienta de orientación y consultoría basada en Terapia Breve Estratégica. No sustituye la atención médica o psiquiátrica de urgencia.
      </p>

    </div>
  );
};
