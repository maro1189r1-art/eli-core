// /api/eli-chat.js
// API puente entre ELI y ChatGPT (Vercel)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensaje vacío" });
  }

  try {
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Eres ELI, una IA asistente que ayuda de forma clara, directa y en español."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.6
        })
      }
    );

    const data = await openaiResponse.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No pude generar respuesta.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Error ChatGPT:", error);
    res.status(500).json({
      reply: "Error al conectar con IA."
    });
  }
}
