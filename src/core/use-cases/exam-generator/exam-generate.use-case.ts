import { ExamResponse } from "../../../interfaces";

interface ExamRequestData {
  topic: string;
  grammar: string;
  difficulty: 'HARD' | 'MEDIUM' | 'EASY';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  ammountQuestions: number;
}

export async function* examGenerateUseCase(
  data: ExamRequestData,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/learnlang/generate-exam`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortSignal,
      }
    );

    if (!resp.ok) throw new Error("No se pudo generar el examen");

    const reader = resp.body?.getReader();
    if (!reader) {
      console.log("No se pudo generar el reader");
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      // Utiliza yield para enviar cada chunk al componente
      yield chunk;
    }
  } catch (error) {
    console.error("Error al generar el examen:", error);
    yield JSON.stringify({
      ok: false,
      errors: [],
      message: "No se pudo generar el examen",
    });
  }
}
