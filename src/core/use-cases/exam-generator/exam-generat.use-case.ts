// import type { OrthographyResponse } from "../../interfaces";
export const examGeneratUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/learnlang/generate-exam`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) throw new Error("No se pudo generar el examen");

    // const data = (await resp.json()) as OrthographyResponse;
    const data = {};

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: "No se pudo generar el examen",
    };
  }
};
