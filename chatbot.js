// ELI v1 - API básica modo manual
// Ruta: /api/chatbot

export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Método no permitido",
    });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(200).json({
      reply: "Escribe algo primero 🙂",
    });
  }

  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("hola")) {
    reply = "Hola 👋 Soy ELI, ¿en qué te ayudo?";
  } else if (text.includes("quien eres")) {
    reply = "Soy ELI, un asistente en evolución creado por ti.";
  } else {
    reply = "Modo manual activo. Te escucho 🙂";
  }

  return res.status(200).json({ reply });
}
