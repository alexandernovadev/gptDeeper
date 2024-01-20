import type { TranslateResponse } from "../../interfaces";

export const translateUseCase = async (prompt: string, lang: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) throw new Error("Error to try to translate");

    const data = (await resp.json()) as TranslateResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      content: "Error to try to translate",
    };
  }
};
