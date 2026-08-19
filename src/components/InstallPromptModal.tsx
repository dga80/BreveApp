import React from 'react';
import { X, Download, Share, PlusSquare, Smartphone, CheckCircle2, Sparkles } from 'lucide-react';
import { PragmappLogo } from './PragmappLogo';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onNativeInstall: () => Promise<void>;
  canPromptNative: boolean;
  isInstalled: boolean;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onNativeInstall,
  canPromptNative,
  isInstalled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl border border-surface-container-highest overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-on-surface">Instalar Pragmapp</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs">
          
          {/* Logo & Intro */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md p-3">
              <PragmappLogo size="lg" showText={false} />
            </div>
            <h4 className="font-heading font-bold text-base text-on-surface mt-1">
              Pragmapp en tu Pantalla de Inicio
            </h4>
            <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs">
              Instala la aplicación en tu móvil u ordenador para abrirla a pantalla completa y acceder a tus consultas en 1 toque.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container-highest space-y-2">
            <div className="flex items-start gap-2 text-on-surface">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span><strong>Sin descargas de tiendas:</strong> Acceso instantáneo y actualizaciones automáticas.</span>
            </div>
            <div className="flex items-start gap-2 text-on-surface">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span><strong>Pantalla completa:</strong> Sin barras de navegador para una experiencia limpia.</span>
            </div>
            <div className="flex items-start gap-2 text-on-surface">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span><strong>Privacidad total:</strong> Tus casos y fichas continúan guardados en tu dispositivo.</span>
            </div>
          </div>

          {/* State: Already Installed */}
          {isInstalled ? (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-primary font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>¡Ya tienes Pragmapp instalada!</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Estás disfrutando de la versión de escritorio/móvil independiente.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Guide */
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-3">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Instalación en iPhone / iPad (Safari):</span>
              </div>

              <div className="space-y-2.5 text-on-surface text-xs">
                <div className="flex items-center gap-2.5 bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container-highest">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    1
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span>Pulsa el botón <strong>Compartir</strong></span>
                    <Share className="w-4 h-4 text-primary shrink-0" />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container-highest">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    2
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span>Selecciona <strong>"Añadir a pantalla de inicio"</strong></span>
                    <PlusSquare className="w-4 h-4 text-primary shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Desktop Direct Native Install Button */
            <div className="space-y-2">
              <button
                type="button"
                onClick={onNativeInstall}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{canPromptNative ? 'Instalar Pragmapp ahora' : 'Instalar en este dispositivo'}</span>
              </button>

              {!canPromptNative && (
                <p className="text-[11px] text-center text-on-surface-variant/80">
                  Si tu navegador no abre el diálogo automáticamente, pulsa en el menú <strong>(⋮)</strong> de tu navegador y selecciona <strong>"Instalar aplicación"</strong>.
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container-highest flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-highest text-on-surface rounded-xl font-semibold text-xs transition-colors"
          >
            {isInstalled ? 'Cerrar' : 'Entendido'}
          </button>
        </div>

      </div>
    </div>
  );
};
