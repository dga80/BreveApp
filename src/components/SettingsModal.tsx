import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Github, 
  Database, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Save, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { AppSettings } from '../types';
import { StorageManager } from '../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onDataImported: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onDataImported
}) => {
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey);
  const [modelName, setModelName] = useState(settings.modelName || 'gemini-2.5-flash');
  const [enableSearchGrounding, setEnableSearchGrounding] = useState(settings.enableSearchGrounding ?? true);
  
  const [githubToken, setGithubToken] = useState(settings.githubToken || '');
  const [githubRepo, setGithubRepo] = useState(settings.githubRepo || 'dga80/BreveApp');
  const [githubBranch, setGithubBranch] = useState(settings.githubBranch || 'main');

  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: AppSettings = {
      ...settings,
      geminiApiKey: geminiApiKey.trim(),
      modelName,
      enableSearchGrounding,
      githubToken: githubToken.trim(),
      githubRepo: githubRepo.trim(),
      githubBranch: githubBranch.trim()
    };
    onSaveSettings(updated);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleSyncWithGitHub = async () => {
    if (!githubToken.trim() || !githubRepo.trim()) {
      setSyncStatus('⚠️ Debes introducir tu Token de GitHub y el nombre del repositorio.');
      return;
    }
    setIsSyncing(true);
    setSyncStatus('Sincronizando con GitHub...');
    const result = await StorageManager.syncWithGitHub(githubToken, githubRepo, githubBranch);
    setIsSyncing(false);
    setSyncStatus(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
  };

  const handleExportData = () => {
    const json = StorageManager.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breveapp_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content && StorageManager.importData(content)) {
        alert('Datos importados correctamente.');
        onDataImported();
      } else {
        alert('Error al procesar el archivo de copia de seguridad.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header del Modal */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-lg text-stone-900">Configuración de BreveApp</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          
          {/* Sección 1: Gemini API */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-800 text-sm">
                <Key className="w-4 h-4 text-teal-600" />
                <span>Google AI / Gemini API</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                Obtener clave gratis en AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                API Key de Gemini:
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Pega aquí tu clave (AQ.Ab8RN6KNP... o AIzaSy...)"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Tu clave se guarda localmente en el almacenamiento privado de tu navegador.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Modelo de Gemini:</label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado, rápido)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Razonamiento profundo)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="grounding"
                  checked={enableSearchGrounding}
                  onChange={(e) => setEnableSearchGrounding(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="grounding" className="font-semibold text-stone-700 select-none cursor-pointer">
                  Búsqueda web en vivo (Grounding)
                </label>
              </div>
            </div>
          </div>

          {/* Sección 2: Persistencia con GitHub */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-800 text-sm">
                <Github className="w-4 h-4 text-stone-800" />
                <span>Persistencia en Repositorio GitHub</span>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Sin pausas por inactividad
              </span>
            </div>

            <p className="text-[11px] text-stone-500">
              Permite sincronizar tus casos y fichas directamente con tu repositorio privado en GitHub para que no dependas de ninguna base de datos externa.
            </p>

            <div className="space-y-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Repositorio de destino (Owner/Repo):
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="ej. dga80/BreveApp"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  GitHub Personal Access Token (PAT):
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx (con permiso 'repo')"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSyncWithGitHub}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar ahora con GitHub'}</span>
                </button>
              </div>

              {syncStatus && (
                <div className="p-2.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-700 font-medium">
                  {syncStatus}
                </div>
              )}
            </div>
          </div>

          {/* Sección 3: Copia de Seguridad Local (Exportar/Importar) */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 space-y-3">
            <div className="flex items-center gap-2 font-bold text-stone-800 text-sm">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Copia de Seguridad y Restauración</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Backup JSON</span>
              </button>

              <label className="px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Restaurar Backup JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Footer con botón Guardar */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div>
            {showSavedToast && (
              <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                <Check className="w-4 h-4" /> ¡Configuración guardada!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 hover:bg-white text-stone-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Ajustes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
