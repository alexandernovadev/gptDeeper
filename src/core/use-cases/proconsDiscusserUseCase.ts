import type { ProConsResponse } from "../../interfaces";

export const proconsDiscusserUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) throw new Error("No se pudo realizar la comparativa");

    const data = (await resp.json()) as ProConsResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      content: "No se pudo realizar la comparativa",
    };
  }
};
