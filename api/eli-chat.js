export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método no permitido" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Mensaje vacío" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      reply: "❌ Falta la clave OPENAI_API_KEY en Vercel"
    });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Eres ELI, una IA asistente clara, directa y útil."
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

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No pude generar respuesta";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ELI API error:", error);
    return res.status(500).json({
      reply: "Error al conectar con la IA"
    });
  }
}
