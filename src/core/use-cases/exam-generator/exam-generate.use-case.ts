import { ExamResponse } from "../../../interfaces";

interface ExamRequestData {
  topic: string;
  grammar: string;
  difficulty: 'HARD' | 'MEDIUM' | 'EASY';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  ammountQuestions: number;
}

export const examGenerateUseCase = async (
  data: ExamRequestData,
  abortSignal: AbortSignal
) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/learnlang/generate-exam`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortSignal, // Añadido para manejar la posibilidad de cancelar la solicitud
      }
    );

    if (!resp.ok) throw new Error("No se pudo generar el examen");

    const reader = resp.body?.getReader();
    if (!reader) {
      console.log("No se pudo generar el reader");
      return null;
    }

    const decoder = new TextDecoder();
    let text = "";
    let isFirstChunk = true;

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;

      if (isFirstChunk) {
        isFirstChunk = false;
        console.log("Primer chunk recibido:", decodedChunk);
      }
    }

    const examData = JSON.parse(text) as ExamResponse;

    return {
      ok: true,
      ...examData,
    };
  } catch (error) {
    console.error("Error al generar el examen:", error);
    return {
      ok: false,
      errors: [],
      message: "No se pudo generar el examen",
    };
  }
};
