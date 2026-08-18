# BreveApp 🌿
> **Consultor y Terapeuta Virtual Familiar en Terapia Breve Estratégica**  
> Basado en la metodología clínica y las obras de **Maribel Martínez Domínguez** (*«¿Cuántas veces te lo tengo que decir?»*, *«Niños sin miedos»*, *«Conducir sin miedo»*) y la escuela de **Giorgio Nardone**.

---

## 🌟 Características Principales

1. **Agente Terapéutico Especializado (Google Gemini):**
   * **Enfoque Estratégico en 3 fases:** Exploración operativa de cómo funciona el problema en el presente, análisis de las *soluciones intentadas* que fallan y prescripción de tareas conductuales concretas.
   * **Base de conocimiento integrada:** Pautas para límites sin gritos, apagado de pantallas, batallas con deberes, rutinas del sueño, rabietas y gestión de miedos infantiles.
   * **Búsqueda Web en Vivo (Grounding):** Capacidad de consultar información reciente y fuentes en la red en tiempo real.

2. **Ficha del Caso y Gestión de Pautas:**
   * Registro estructurado por cada hijo/familia.
   * Detección y registro de **Soluciones Intentadas Erróneas** (para frenar el círculo vicioso).
   * Panel de **Prescripciones Activas** y tareas asignadas para hacer seguimiento semanal.
   * Diario de notas y evolución clínica.

3. **Persistencia Dual (Sin desconexiones por inactividad):**
   * **Local:** Almacenamiento instantáneo y privado en tu navegador (*LocalStorage / IndexedDB*).
   * **Sincronización con GitHub:** Conexión directa mediante la API REST de GitHub para respaldar tus fichas y chats en tu repositorio privado (`dga80/BreveApp`) sin necesidad de bases de datos de pago ni pausas por inactividad.
   * **Exportación / Importación:** Descarga y restauración completa en archivos JSON.

4. **Biblioteca TBE Interactiva:**
   * Catálogo de axiomas, reglas de oro y casos clínicos típicos de Maribel Martínez listos para consultar.

---

## 🚀 Despliegue en Netlify

La aplicación está completamente configurada y optimizada para ser desplegada en **Netlify**:

1. Sube tu código al repositorio en GitHub (ej. `dga80/BreveApp`).
2. Entra en [Netlify](https://app.netlify.com/) y haz clic en **«Add new site» > «Import an existing project»**.
3. Selecciona tu repositorio de GitHub `BreveApp`.
4. Los parámetros de compilación se detectarán automáticamente gracias al archivo `netlify.toml`:
   * **Build command:** `npm run build`
   * **Publish directory:** `dist`
5. *(Opcional)* En **Site configuration > Environment variables**, puedes añadir:
   * `VITE_GEMINI_API_KEY`: Tu clave de Gemini para que esté configurada por defecto para todos tus dispositivos.
6. Haz clic en **«Deploy BreveApp»** y tu app estará lista en internet con HTTPS en segundos.

---

## 💻 Ejecución en Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 🔒 Privacidad y Seguridad

* Tus conversaciones no se comparten con terceros.
* La API Key de Gemini y los tokens de GitHub se gestionan en local en tu navegador o mediante variables de entorno privadas.
