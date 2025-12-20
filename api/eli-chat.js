export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensaje vacío" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "❌ Falta la clave OPENAI_API_KEY" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres una IA asistente clara y concisa." },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "No pude generar respuesta.";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Error consultando ChatGPT" });
  }
}
