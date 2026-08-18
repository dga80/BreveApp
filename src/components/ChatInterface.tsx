import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, User, HelpCircle, CheckCircle, Globe, BookmarkPlus, Sparkle } from 'lucide-react';
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-3 sm:px-6 py-3 bg-surface">
      
      {/* Banner de Caso Activo - Estilo Stitch */}
      {activeCase && (
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl px-4 py-3 mb-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {activeCase.childName ? activeCase.childName[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-semibold text-sm text-on-surface">{activeCase.title}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1 animate-pulse"></span>
                  Caso Activo
                </span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-1">
                {activeCase.childAge ? `${activeCase.childAge} • ` : ''}{activeCase.mainIssue}
              </p>
            </div>
          </div>
          {activeCase.prescriptions && activeCase.prescriptions.length > 0 && (
            <div className="hidden sm:flex items-center text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-primary" />
              {activeCase.prescriptions.filter(p => !p.completed).length} pautas activas
            </div>
          )}
        </div>
      )}

      {/* Sugerencias Rápidas en la parte superior (Scroll horizontal de pastillas) */}
      <div className="mb-3">
        <div className="flex items-center space-x-1.5 text-xs text-on-surface-variant mb-2">
          <Sparkle className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-xs">Consultas estratégicas frecuentes:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(topic.prompt);
                inputRef.current?.focus();
              }}
              className="text-xs bg-surface-container-lowest hover:bg-primary/5 border border-surface-container-highest hover:border-primary/30 text-on-surface-variant hover:text-primary rounded-full px-3 py-1.5 whitespace-nowrap transition-all shadow-2xs font-medium"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Área de Mensajes con Scroll */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar del usuario o terapeuta */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-on-surface text-surface'
                    : 'bg-primary-container text-on-primary-container'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-stitch-lightMint" />}
              </div>

              {/* Contenedor del mensaje */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-sm ${
                  isUser
                    ? 'bg-primary text-white rounded-tr-xs shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface border border-surface-container-highest rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Renderizado Markdown */}
                <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert text-white' : 'text-on-surface'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      strong: ({ children }) => (
                        <strong className={`font-semibold ${isUser ? 'text-stitch-lightMint' : 'text-primary-container'}`}>
                          {children}
                        </strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className={`border-l-3 pl-3 my-2 italic ${
                          isUser ? 'border-stitch-lightMint text-stitch-lightMint/90' : 'border-primary text-on-surface-variant'
                        }`}>
                          {children}
                        </blockquote>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {/* Fuentes Grounding de Google */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-surface-container-highest text-[11px] text-on-surface-variant flex items-center gap-1.5 flex-wrap">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium">Fuentes clínicas consultadas:</span>
                    {message.sources.map((s, idx) => (
                      <span key={idx} className="bg-surface-container-low px-1.5 py-0.5 rounded text-on-surface">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prescripciones auto-detectadas */}
                {message.prescriptions && message.prescriptions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primary/20 bg-primary/5 p-3 rounded-xl">
                    <div className="flex items-center justify-between text-xs font-semibold text-primary mb-2">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        🎯 Pauta Estratégica Prescrita
                      </span>
                    </div>
                    {message.prescriptions.map((rx) => (
                      <div key={rx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface bg-surface-container-lowest p-2.5 rounded-xl border border-primary/20">
                        <div>
                          <span className="font-semibold text-primary block">{rx.title}</span>
                          <span className="text-[11px] text-on-surface-variant line-clamp-1">{rx.description}</span>
                        </div>
                        <button
                          onClick={() => onAddPrescription(rx)}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 shrink-0 mt-1 sm:mt-0"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          Guardar en Ficha
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isUser ? 'text-stitch-lightMint/80' : 'text-on-surface-variant/70'
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

        {/* Indicador de carga estilo Stitch */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin text-stitch-lightMint" />
            </div>
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl rounded-tl-xs p-4 shadow-xs">
              <div className="flex items-center space-x-2 text-xs text-on-surface-variant">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2 font-medium text-on-surface">Analizando dinámica familiar y preparando prescripción...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Entrada de texto flotante */}
      <form onSubmit={handleSubmit} className="relative bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe la situación actual de tu hijo/a o qué dudas tienes (ej: 'No quiere apagar la tablet y montamos una batalla')..."
          rows={2}
          className="w-full bg-transparent px-4 pt-3 pb-10 text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none resize-none"
        />

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant/70 hidden sm:inline">
            Presiona <kbd className="bg-surface-container-low border border-surface-container-highest rounded px-1 text-[10px]">Enter</kbd> para enviar
          </span>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              input.trim() && !isLoading
                ? 'bg-primary hover:bg-primary/90 text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            <span>Consultar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Nota legal */}
      <p className="text-[10px] text-on-surface-variant/60 text-center mt-2">
        BreveApp es una herramienta de orientación y consultoría basada en Terapia Breve Estratégica. No sustituye la atención médica de urgencia.
      </p>

    </div>
  );
};
