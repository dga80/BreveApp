# 📋 CONTEXTO DEL PROYECTO PARA ASISTENTES Y DESARROLLADORES IA (BreveApp)

> **Este documento está diseñado para contextualizar inmediatamente a cualquier herramienta de IA (Cursor, Copilot, Claude Code, ChatGPT, etc.) o desarrollador que clone este repositorio.**

---

## 1. Visión General del Proyecto

**BreveApp** es una Single Page Application (SPA) en **React + TypeScript + Vite** diseñada para actuar como un **Consultor y Terapeuta Familiar Virtual** basado en la metodología clínica de **Maribel Martínez Domínguez** (psicóloga sanitaria, especialista en Terapia Breve Estratégica y autora de libros como *«¿Cuántas veces te lo tengo que decir?»*, *«Niños sin miedos»* y *«Conducir sin miedo»*) y la escuela de **Giorgio Nardone** (Centro di Terapia Strategica de Arezzo).

### Problema que resuelve:
Los padres suelen quedar atrapados en *"soluciones intentadas"* que fallan (repetir órdenes 20 veces, dar sermones interminables, sobreproteger, ceder por cansancio, perder la calma). BreveApp analiza la dinámica familiar en el presente, detecta el bucle disfuncional y prescribe **pautas conductuales estratégicas y concretas** para desbloquear la situación rápidamente.

---

## 2. Stack Tecnológico y Arquitectura

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React (iconos), React-Markdown (renderizado de formato clínico).
* **Motor de IA:** Google Gemini API (`gemini-2.5-flash` por defecto, con soporte para `gemini-1.5-pro` y `gemini-2.0-flash`).
* **Búsqueda Web en Vivo (Grounding):** Integración nativa con *Google Search Grounding* de Gemini para acceder a información y artículos recientes de la red.
* **Persistencia Dual (Sin servidores de pago ni desconexiones por inactividad):**
  1. *Local:* `LocalStorage` e `IndexedDB` en el navegador del cliente (instantáneo, privado y offline).
  2. *GitHub API Sync:* Capacidad de sincronizar el estado completo (`/data/persistence_store.json`) directamente con el repositorio privado de GitHub mediante su API REST (usando un Personal Access Token).
  3. *Copias de seguridad:* Exportación e importación manual en formato `.json`.
* **Despliegue:** Optimizado para **Netlify** con configuración en `netlify.toml` (SPA redirects, security headers y variables de entorno).

---

## 3. Mapa de la Estructura de Archivos

```
BreveApp/
├── index.html                   # HTML base con fuentes tipográficas
├── netlify.toml                 # Configuración de build y redirecciones SPA para Netlify
├── package.json                 # Dependencias y scripts npm (dev, build, preview)
├── tailwind.config.js           # Paleta de colores cálidos y terapéuticos (teal/stone/warm)
├── tsconfig.json                # Configuración de TypeScript
├── vite.config.ts               # Configuración de Vite y plugin React
├── PROJECT_CONTEXT.md           # [ESTE ARCHIVO] Contexto completo del proyecto
├── README.md                    # Documentación pública y guía de despliegue
└── src/
    ├── main.tsx                 # Punto de entrada de React
    ├── App.tsx                  # Componente raíz, orquestador de estado y pestañas
    ├── index.css                # Estilos globales y utilidades de Tailwind
    ├── types/
    │   └── index.ts             # Tipos TypeScript: CaseProfile, Message, Prescription, AppSettings
    ├── lib/
    │   ├── knowledgeBase.ts     # Base de conocimiento clínico (axiomas, casos tipo, system prompt)
    │   ├── gemini.ts            # Cliente API de Gemini, inyección de contexto y detector de pautas
    │   └── storage.ts           # Gestor de persistencia (LocalStorage + GitHub REST sync + Backup)
    └── components/
        ├── Header.tsx           # Barra superior, selector de casos, pestañas y botón de ajustes
        ├── ChatInterface.tsx    # Chat interactivo con streaming visual, chips de temas rápidos y markdown
        ├── CaseDashboard.tsx    # Ficha del caso: perfil, soluciones fallidas, pautas y notas de evolución
        ├── KnowledgeLibrary.tsx # Biblioteca interactiva con los casos y principios de Maribel Martínez
        ├── PrescriptionCard.tsx # Tarjeta interactiva para pautas activas/completadas
        └── SettingsModal.tsx    # Modal de configuración (API Key Gemini, GitHub Token, Backup JSON)
```

---

## 4. Componentes Clave y Lógica Interna

### 4.1. Marco Terapéutico (`src/lib/knowledgeBase.ts`)
Define el `SYSTEM_PROMPT_THERAPIST` y los casos de referencia estructurados.
El agente opera en 3 fases:
1. **Exploración Operativa:** Pregunta cómo funciona el problema en el presente y qué se ha intentado ya.
2. **Reestructuración:** Cambia el marco cognitivo de los padres (ej. *"Menos palabras y más acción"*, *"La sobreprotección desprotege"*).
3. **Prescripción Conductual:** Propone experimentos o tareas concretas con el formato:
   * `**🎯 Pauta estratégica recomendada:** [Título]`
   * `**📋 Cómo aplicarla paso a paso:** [Instrucciones]`
   * `**⚠️ Qué evitar hacer:** [Soluciones intentadas erróneas]`

### 4.2. Motor de IA (`src/lib/gemini.ts`)
* Envía la conversación junto con la **Ficha del Caso Activo** inyectada en el `systemInstruction`.
* Si la respuesta contiene una pauta formateada (`**🎯 Pauta estratégica recomendada:**`), la función `extractPrescriptionsFromText()` la detecta automáticamente y permite guardarla en la ficha del caso con un clic.
* Soporta *Google Search Grounding* mediante `{ tools: [{ googleSearch: {} }] }`.

### 4.3. Persistencia y Sincronización (`src/lib/storage.ts`)
* `StorageManager` encapsula todos los accesos a datos.
* `syncWithGitHub(token, repo, branch)`: Hace peticiones `GET` y `PUT` a `https://api.github.com/repos/{repo}/contents/data/persistence_store.json` codificando el payload en Base64, permitiendo tener persistencia en la nube sin depender de bases de datos que se apaguen por inactividad.

---

## 5. Variables de Entorno

| Variable | Descripción | Ubicación recomendada |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Clave API de Google AI Studio | Archivo local `.env` o en Netlify (*Site settings > Environment variables*) |

*(Nota: Los usuarios también pueden introducir su API Key y su GitHub Token directamente en la interfaz de Ajustes ⚙️ de la aplicación, guardándose en el `LocalStorage` privado de su navegador).*

---

## 6. Comandos Habituales para Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en entorno de desarrollo local (puerto 5173)
npm run dev

# 3. Compilar para producción (genera la carpeta dist/)
npm run build

# 4. Previsualizar la build de producción
npm run preview
```

---

## 7. Instrucciones para la IA que modifique este proyecto

1. **Mantener la coherencia del tono terapéutico:** Cualquier ajuste en el prompt o la interfaz debe respetar el estilo de la Terapia Breve Estratégica (directo, empático, sin moralina, enfocado en romper círculos viciosos y soluciones intentadas).
2. **Tipado estricto:** Mantener las interfaces en `src/types/index.ts` actualizadas si se agregan nuevos campos a los casos o mensajes.
3. **Compatibilidad con Netlify:** Asegurarse de que cualquier nuevo módulo o librería sea compatible con compilación estática / cliente (`npm run build`). No añadir dependencias exclusivas de Node.js en el frontend.
