export const config = {
  api: {
    bodyParser: true,
  },
};
export default function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    return res.status(200).json({
      reply: `Recibí tu mensaje: ${message}`
    });
  }

  return res.status(405).json({ reply: "Método no permitido" });
}
