import { Message, CaseProfile, Prescription } from '../types';
import { SYSTEM_PROMPT_THERAPIST, KNOWLEDGE_CASES, MARIBEL_PRINCIPLES } from './knowledgeBase';

export interface SendMessageOptions {
  apiKey: string;
  modelName?: string;
  messages: Message[];
  activeCase?: CaseProfile | null;
  enableSearchGrounding?: boolean;
}

export async function sendChatMessage({
  apiKey,
  modelName = 'gemini-2.5-flash',
  messages,
  activeCase,
  enableSearchGrounding = false
}: SendMessageOptions): Promise<{ text: string; prescriptions?: Prescription[]; sources?: string[] }> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('No se ha configurado la API Key de Gemini. Por favor, añádela en Ajustes ⚙️.');
  }

  // Build context including knowledge base & active case profile
  let contextSystemPrompt = SYSTEM_PROMPT_THERAPIST;

  if (activeCase) {
    contextSystemPrompt += `\n\n--- FICHA DEL CASO ACTUAL ---
Título del Caso: ${activeCase.title}
Hijo/a: ${activeCase.childName || 'No especificado'} (${activeCase.childAge || 'Edad no especificada'})
Motivo principal de consulta: ${activeCase.mainIssue || 'No especificado'}
Soluciones intentadas previamente: ${activeCase.attemptedSolutions.join(', ') || 'Ninguna registrada todavía'}
Pautas asignadas previamente: ${activeCase.prescriptions.map(p => `- ${p.title} (${p.completed ? 'Completada' : 'En curso'})`).join('\n') || 'Ninguna'}
Notas acumuladas del terapeuta: ${activeCase.notes.join(' | ') || 'Sin notas adicionales'}`;
  }

  // Include top relevant knowledge cases for prompt grounding
  contextSystemPrompt += `\n\n--- CONOCIMIENTO Y CASOS DE REFERENCIA DE MARIBEL MARTÍNEZ ---
${KNOWLEDGE_CASES.map(c => `[CASO: ${c.title}]\nProblema: ${c.problem}\nError común: ${c.attemptedSolutionFailed}\nEstrategia: ${c.prescription}\nRegla de oro: ${c.keyRule}`).join('\n\n')}`;

  // Format conversation history for Gemini REST API
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Clean model name for endpoint
  const targetModel = modelName.includes('/') ? modelName.split('/')[1] : modelName;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey.trim()}`;

  const requestBody: any = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: contextSystemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048
    }
  };

  // Enable Google Search Grounding if requested
  if (enableSearchGrounding) {
    requestBody.tools = [
      {
        googleSearch: {}
      }
    ];
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Error en la API de Gemini (${response.status})`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || 'No se pudo generar respuesta.';

    // Extract sources if grounding was active
    const sources: string[] = [];
    const groundingMetadata = candidate?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push(`${chunk.web.title} (${chunk.web.uri})`);
        }
      }
    }

    // Try to auto-detect prescriptions from text
    const prescriptions = extractPrescriptionsFromText(text);

    return { text, prescriptions, sources: sources.length > 0 ? sources : undefined };
  } catch (error: any) {
    console.error('Error al llamar a Gemini API:', error);
    throw error;
  }
}

/**
 * Helper to detect strategic prescriptions formatted in the response
 */
function extractPrescriptionsFromText(text: string): Prescription[] {
  const list: Prescription[] = [];
  const regex = /\*\*🎯\s*Pauta estratégica recomendada:\*\*\s*(.+?)(?:\n|$)/gi;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const title = match[1].trim();
    if (title) {
      list.push({
        id: 'rx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        title: title,
        description: 'Pauta asignada por el terapeuta en la última sesión.',
        category: 'general',
        assignedDate: new Date().toLocaleDateString('es-ES'),
        completed: false
      });
    }
  }

  return list;
}
