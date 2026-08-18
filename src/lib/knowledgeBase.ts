import { KnowledgeItem } from '../types';

export const MARIBEL_PRINCIPLES = [
  {
    title: "La trampa de las 'Soluciones Intentadas'",
    text: "Cuando una estrategia no funciona (por ejemplo, repetir una orden 10 veces, gritar, sermonear o castigar con exageración), insistir en ella es lo que mantiene y agranda el problema. Si lo que haces no funciona, haz algo diferente."
  },
  {
    title: "Padres son padres, no amigos",
    text: "El niño necesita referentes claros, seguridad y límites. Tratar de ser 'amigos' de los hijos diluye la jerarquía necesaria para que el menor se sienta protegido y estructurado."
  },
  {
    title: "La sobreprotección desprotege",
    text: "Allanar todo el camino a los hijos para evitarles cualquier sufrimiento o frustración genera niños frágiles, inseguros y dependientes. Deben aprender a superar pequeñas dificultades por sí mismos para construir su autoestima real."
  },
  {
    title: "Acción en lugar de sermones (La regla del aviso único)",
    text: "Las palabras repetidas se convierten en ruido de fondo. Se da un solo aviso claro y con calma; si no se cumple, se pasa directamente a la consecuencia pactada o a la acción, sin discutir ni justificarse."
  },
  {
    title: "La Ilusión de Alternativa",
    text: "Dar a elegir entre dos opciones que a los padres les parecen bien (ej. '¿Te bañas antes de cenar o después de poner la mesa?'). El niño siente autonomía al decidir, pero dentro del marco de límites fijado por los adultos."
  },
  {
    title: "Declaración de Incapacidad Estratégica",
    text: "Cuando el niño busca la confrontación constante o exige que los padres le hagan todo, los padres adoptan una postura tranquila de 'no saber cómo ayudarle si se pone así', retirando la atención del conflicto y devolviéndole la responsabilidad."
  }
];

export const KNOWLEDGE_CASES: KnowledgeItem[] = [
  {
    id: "pantallas-1",
    title: "El conflicto de apagar las pantallas y videojuegos",
    source: "¿Cuántas veces te lo tengo que decir? (Capítulo Pantallas)",
    category: "pantallas",
    problem: "El niño se niega a soltar la consola o la tablet cuando se le pide; los padres avisan 5 veces, acaban gritando y el niño monta un drama.",
    attemptedSolutionFailed: "Repetir 'apágalo ya', amenazar con castigos desproporcionados ('no juegas en un mes') que nunca se cumplen, y negociar 5 minutos más una y otra vez.",
    strategicReframing: "El niño ha aprendido que los primeros 4 avisos no cuentan y que la pataleta retrasa el apagado.",
    prescription: "Pactar la hora antes de encender con alarma visible. Se da un único recordatorio a los 5 minutos previos. Si al sonar la alarma no se apaga en 1 minuto, el padre/madre apaga sin hablar, sin regañar y retira el dispositivo por las siguientes 24-48 horas con absoluta serenidad.",
    keyRule: "Cero discursos al apagar. Menos palabras, más firmeza tranquila."
  },
  {
    id: "rabietas-1",
    title: "Rabietas para conseguir lo que quiere en público o en casa",
    source: "¿Cuántas veces te lo tengo que decir? (Capítulo Rabietas y límites)",
    category: "rabietas",
    problem: "Pataletas intensas, gritos en el supermercado o en el salón cuando se le dice 'no' a un capricho.",
    attemptedSolutionFailed: "Intentar razonar durante la rabieta, ceder por vergüenza, o ponerse a su nivel emocional gritando.",
    strategicReframing: "Durante la tormenta emocional el cerebro racional del niño está desconectado. Intentar convencerle le da protagonismo a la rabieta.",
    prescription: "Garantizar seguridad física. Mantener silencio absoluto y mirada neutra. Si es en público, apartarlo con calma sin hablar. No negociar jamás durante la rabieta. Cuando se calme por completo, no hacer sermones: continuar la rutina normal.",
    keyRule: "El enfado tiene derecho a existir; la conducta destructiva o la manipulación no obtienen premio."
  },
  {
    id: "deberes-1",
    title: "La batalla diaria por hacer los deberes y estudiar",
    source: "¿Cuántas veces te lo tengo que decir? (Capítulo Autonomía y Escuela)",
    category: "estudio",
    problem: "Los padres se sientan toda la tarde con el niño, le recuerdan cada ejercicio, le leen las consignas y acaban haciendo ellos la tarea.",
    attemptedSolutionFailed: "Supervisar cada minuto, sentarse al lado como un tutor a tiempo completo, convertir los deberes en la responsabilidad del padre/madre.",
    strategicReframing: "La escuela y los deberes son la responsabilidad del hijo, no de los padres. Asumir su rol le transmite el mensaje implícito de 'tú no eres capaz sin mí'.",
    prescription: "Definir un horario fijo y un espacio sin distracciones. Los padres declaran con afecto: 'Confiamos en que eres capaz de hacerlo solo. Estaré en la cocina; si tienes una duda concreta de una palabra, ven y pregúntame, pero tú haces el trabajo'. Si no los hace, asume la consecuencia directa ante su maestro al día siguiente.",
    keyRule: "Permitir que la realidad y el colegio hagan de límite natural."
  },
  {
    id: "dormir-1",
    title: "Hora de dormir y el peregrinaje nocturno a la cama de los padres",
    source: "Niños sin miedos / ¿Cuántas veces te lo tengo que decir?",
    category: "rutinas",
    problem: "Excusas interminables (agua, otro cuento, pis) y traslado a media noche a la cama de los progenitores.",
    attemptedSolutionFailed: "Acostarse con él hasta que se duerma profundamente, enfadarse a las 3 de la mañana y terminar cediendo por agotamiento.",
    strategicReframing: "El niño no aprende a conciliar el sueño por sí mismo, sino asociado a la presencia del adulto.",
    prescription: "Rutina corta, predecible y afectuosa (baño, cuento, beso). Si sale de la cama, se le acompaña de vuelta con amabilidad y silencio (sin entablar conversación, sin debate). Si ocurre 10 veces, las 10 veces se le devuelve a su cama como un robot cariñoso pero inquebrantable.",
    keyRule: "La noche es para descansar y cada uno tiene su espacio seguro."
  },
  {
    id: "miedos-1",
    title: "Miedos infantiles y necesidad de confirmación constante",
    source: "Niños sin miedos",
    category: "miedos",
    problem: "El niño tiene miedo a la oscuridad, a estar solo en una habitación o a monstruos, y pide consuelo repetidamente.",
    attemptedSolutionFailed: "Decirle 'eso no existe, no seas tonto' (invalida su emoción) o revisar 20 veces debajo de la cama (confirma que el peligro podría ser real).",
    strategicReframing: "Alimentar la comprobación refuerza la fobia; negar la emoción genera soledad.",
    prescription: "Validar la emoción ('Entiendo que sientas miedo, es normal'). Prescribir la técnica de 'La peor fantasía' adaptada o el 'Dibujo del monstruo ridículo': dedicar 10 minutos al día a dibujar o hablar del miedo para agotarlo, pero fuera de ese tiempo pactado, no responder preguntas obsesivas sobre el miedo.",
    keyRule: "El miedo mirado a la cara se convierte en valor; el miedo evitado se convierte en pánico."
  }
];

export const SYSTEM_PROMPT_THERAPIST = `Eres el Asistente Experto y Terapeuta Virtual de Pragmapp, especializado en TERAPIA BREVE ESTRATÉGICA (TBE) y fundamentado en la metodología, obras y filosofía clínica de MARIBEL MARTÍNEZ DOMÍNGUEZ (autora de "¿Cuántas veces te lo tengo que decir?", "Niños sin miedos" y codirectora del Centro de Terapia Breve en Barcelona), así como en los modelos de Giorgio Nardone y Paul Watzlawick.

TU IDENTIDAD Y ESTILO:
- Eres empático, cercano, pero a la vez muy directo, pragmático y orientado a la acción.
- Hablas con tono profesional, cálido y comprensivo hacia la angustia de los padres, pero sin caer en el buenismo ineficaz ni en sermones teóricos abstractos.
- Tu misión no es dar consejos vagos ("ten paciencia"), sino formular PREGUNTAS ESTRATÉGICAS y PRESCRIBIR PAUTAS CONDUCTUALES CONCRETAS para desbloquear el problema en pocas semanas.

PRINCIPIOS CLAVE QUE RIGEN TU ENFOQUE:
1. "Si lo que estás haciendo no funciona, haz algo diferente": El problema casi siempre se mantiene por las "soluciones intentadas" que los padres repiten sin éxito (repetir órdenes mil veces, gritar, sobreproteger, ceder por cansancio, razonar con niños en plena rabieta).
2. Los padres deben ser padres, no amigos: La jerarquía y los límites son un acto de amor que aporta seguridad.
3. La sobreprotección desprotege: Allanarles todo el camino crea hijos inseguros y tiranos.
4. Menos palabras y más acción: La "regla del aviso único". No repetir órdenes ni dar sermones eternos.
5. Preguntas estratégicas con ilusión de alternativa y reestructuraciones.

ESTRUCTURA DE TU CONSULTA EN 3 FASES:
1. FASE DE EXPLORACIÓN OPERATIVA:
   - Pregunta cómo funciona el problema en la práctica (ej. ¿cuándo pasa? ¿quién interviene?).
   - Indaga siempre: "¿Qué habéis probado ya para solucionarlo?".
2. FASE DE REESTRUCTURACIÓN:
   - Ayuda a los padres a ver el problema desde otra óptica (ej. "Al repetirle la orden 5 veces, le estás enseñando que las 4 primeras no importan").
3. FASE DE PRESCRIPCIÓN CLARA:
   - Ofrece 1 o máximo 2 pautas o tareas muy precisas y realistas para poner a prueba durante los próximos días (como un experimento conductual).
   - Siempre que propongas una tarea o pauta clave, puedes estructurarla con el formato:
     **🎯 Pauta estratégica recomendada:** [Título]
     **📋 Cómo aplicarla paso a paso:** [Instrucciones claras]
     **⚠️ Qué evitar hacer:** [Soluciones intentadas erróneas]

IMPORTANTE (SEGURIDAD Y LÍMITES):
- Si el usuario describe situaciones de violencia física grave, abusos o trastornos psiquiátricos severos que requieran atención médica urgente, indícale amablemente que debe acudir de inmediato a un centro de salud o servicio de urgencias especializado.
- Responde siempre en español, de forma clara y formateada en Markdown con viñetas y negritas para facilitar la lectura rápida de los padres.`;
