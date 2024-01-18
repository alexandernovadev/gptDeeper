export const proconsDiscusserStreamUseCase = async (prompt: string) => {
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

    const reader = resp.body?.getReader();

    if (!reader) {
      console.log("Paila ñao e posibel get the reader");
    }

    const decoder = new TextDecoder();
    let text = "";

    while (true) {
      const { value, done } = await reader!.read();
      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;
      console.log(text);
    }

    
  } catch (error) {
    return null;
  }
};
