import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, CaseProfile, Prescription } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  activeCase?: CaseProfile;
  onAddPrescription: (prescription: Prescription) => void;
}

const QUICK_TOPICS = [
  { label: 'Rabietas y límites', prompt: 'Tenemos una batalla constante cada vez que hay que poner un límite o apagar la pantalla. Cuando le aviso se enfada y monta un escándalo. ¿Qué pauta estratégica nos recomiendas?' },
  { label: 'Uso de pantallas', prompt: 'Dificultad para apagar la tablet o videojuegos al terminar el tiempo pactado y constantes quejas para vestirse o ir a cenar.' },
  { label: 'Miedos e inseguridad', prompt: 'A la hora de dormir busca excusas por miedo a quedarse solo en su habitación y acaba viniendo a nuestra cama.' },
  { label: 'Estudios', prompt: 'Tardamos horas en hacer los deberes. Si no estoy sentada a su lado constantemente no trabaja.' },
  { label: 'Desobediencia', prompt: 'Ignora las instrucciones a la primera y solo reacciona cuando alzamos la voz o amenazamos con castigos.' }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeCase,
  onAddPrescription
}) => {
  const [input, setInput] = useState('');
  const [activeChip, setActiveChip] = useState<string>('Rabietas y límites');
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto w-full bg-background text-on-background relative">
      
      {/* Pastillas horizontales deslizables de Stitch */}
      <div className="w-full overflow-x-auto hide-scrollbar py-2.5 px-4 border-b border-outline-variant/30 shrink-0 bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex gap-2 w-max">
          {QUICK_TOPICS.map((topic, idx) => {
            const isActive = activeChip === topic.label;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveChip(topic.label);
                  setInput(topic.prompt);
                  inputRef.current?.focus();
                }}
                className={`px-4 py-2 rounded-full font-label-md text-xs whitespace-nowrap transition-transform active:scale-95 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50'
                }`}
              >
                {topic.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Área de flujo de chat */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 pb-28 md:pb-24">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 max-w-[88%] sm:max-w-[85%] ${
                isUser ? 'self-end' : 'self-start'
              }`}
            >
              {/* Burbuja de mensaje */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-primary text-on-primary rounded-tr-xs shadow-[0_4px_12px_rgba(15,118,110,0.15)] font-body-md'
                    : 'bg-surface-container-low text-on-surface rounded-tl-xs shadow-[0_2px_10px_rgba(15,118,110,0.03)] border border-white/50 font-body-md'
                }`}
              >
                <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert text-white' : 'text-on-surface'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      strong: ({ children }) => (
                        <strong className={`font-semibold ${isUser ? 'text-on-primary-container' : 'text-primary'}`}>
                          {children}
                        </strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className={`border-l-3 pl-3 my-2 italic ${
                          isUser ? 'border-on-primary-container text-on-primary-container/90' : 'border-primary text-on-surface-variant'
                        }`}>
                          {children}
                        </blockquote>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {/* Fuentes consultadas */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant flex items-center gap-1.5 flex-wrap">
                    <span className="material-symbols-outlined text-sm text-primary">public</span>
                    <span className="font-medium">Fuentes clínicas:</span>
                    {message.sources.map((s, idx) => (
                      <span key={idx} className="bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tarjeta de Prescripción Destacada de Stitch si se detecta */}
              {!isUser && message.prescriptions && message.prescriptions.length > 0 && (
                <div className="bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgba(15,118,110,0.08)] border border-outline-variant/20 overflow-hidden my-3 relative w-full">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-container"></div>
                  <div className="p-5 pl-6 flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>target</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-display font-semibold">
                        Pauta estratégica recomendada
                      </h2>
                    </div>

                    {message.prescriptions.map((rx) => (
                      <div key={rx.id} className="flex flex-col gap-3">
                        <p className="font-body-sm text-body-sm text-on-surface font-medium">{rx.title}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{rx.description}</p>
                        
                        <button
                          onClick={() => onAddPrescription(rx)}
                          className="mt-1 w-full bg-primary-container text-on-primary-container font-label-md text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors active:scale-[0.98] shadow-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                          Guardar en Ficha del Caso
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className={`font-label-sm text-[10px] text-on-surface-variant ${isUser ? 'mr-2 self-end' : 'ml-2 self-start'}`}>
                {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          );
        })}

        {/* Carga estilo Stitch */}
        {isLoading && (
          <div className="flex flex-col gap-1 max-w-[85%] self-start">
            <div className="bg-surface-container-low text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-[0_2px_10px_rgba(15,118,110,0.03)] border border-white/50 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl animate-spin">sync</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Analizando caso y preparando prescripción conductual...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Caja de entrada flotante al pie (Stitch Bottom Input Area) */}
      <div className="fixed bottom-14 md:bottom-2 w-full max-w-3xl left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 p-2 z-40 px-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-surface-container-lowest rounded-3xl p-1.5 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] border border-outline-variant/30">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta a Maribel Bot..."
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[40px] py-2.5 px-3 font-body-md text-xs sm:text-sm text-on-surface placeholder:text-outline/70"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-full transition-all shrink-0 ${
              input.trim() && !isLoading
                ? 'bg-primary text-on-primary shadow-md active:scale-95'
                : 'bg-surface-container text-outline/50 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </form>
      </div>

    </div>
  );
};
