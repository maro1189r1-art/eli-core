// ELI v1.9 - Núcleo con aprendizaje controlado
// Prioridad: comandos → aprendizajes → mejoras → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración por defecto
  let eliConfig = {
    mode: "manual",
    memory: { enabled: false, lastMessage: "" },
    responses: { default: "ELI activo" },
    ai: { enabled: false }
  };

  // Cargar configuración externa
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) eliConfig = await res.json();
  } catch {
    console.warn("ELI: usando configuración por defecto");
  }

  // Memoria
  if (eliConfig.memory?.enabled) {
    const saved = localStorage.getItem("eli_last_message");
    if (saved) eliConfig.memory.lastMessage = saved;
  }

  // Mejoras
  let eliImprovements = JSON.parse(
    localStorage.getItem("eli_improvements") || "[]"
  );

  // 🧠 Aprendizajes (NUEVO)
  let eliLearnings = JSON.parse(
    localStorage.getItem("eli_learnings") || "{}"
  );

  // IA simulada
  async function askAI(message) {
    return "🤖 Respuesta IA (simulada).";
  }

  sendBtn.addEventListener("click", async function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* =========================
       1️⃣ COMANDOS
    ========================== */

    // Enseñar
    if (text.startsWith("aprende:")) {
      // Formato: aprende: pregunta | respuesta
      const data = input.substring(8).split("|");
      if (data.length === 2) {
        const key = data[0].trim().toLowerCase();
        const value = data[1].trim();
        eliLearnings[key] = value;
        localStorage.setItem(
          "eli_learnings",
          JSON.stringify(eliLearnings)
        );
        reply = `🧠 Aprendido: cuando digas "${key}" responderé eso.`;
      } else {
        reply =
          "Formato incorrecto. Usa: aprende: pregunta | respuesta";
      }
    }

    // Listar aprendizajes
    else if (text === "aprendizajes") {
      const keys = Object.keys(eliLearnings);
      reply =
        keys.length === 0
          ? "Aún no he aprendido nada."
          : "📚 Aprendizajes:\n- " + keys.join("\n- ");
    }

    // Memoria
    else if (text === "memoria" && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo que dijiste: "${eliConfig.memory.lastMessage}"`
        : "Aún no tengo memoria.";
    }

    /* =========================
       2️⃣ APRENDIZAJES
    ========================== */

    else {
      for (const key in eliLearnings) {
        if (text.includes(key)) {
          reply = eliLearnings[key];
          break;
        }
      }
    }

    /* =========================
       3️⃣ MEJORAS
    ========================== */

    if (
      !reply &&
      text.includes("quien eres") &&
      eliImprovements.some(m =>
        m.toLowerCase().includes("present")
      )
    ) {
      reply =
        "Soy ELI 🤖, un asistente que aprende contigo.\n" +
        "Puedo memorizar, aprender frases y evolucionar paso a paso.";
    }

    /* =========================
       4️⃣ RESPUESTAS CONFIG
    ========================== */

    if (!reply && eliConfig.responses) {
      for (const key in eliConfig.responses) {
        if (key !== "default" && text.includes(key)) {
          reply = eliConfig.responses[key];
          break;
        }
      }
    }

    /* =========================
       5️⃣ IA
    ========================== */

    if (!reply && eliConfig.mode === "ia" && eliConfig.ai?.enabled) {
      reply = await askAI(input);
    }

    /* =========================
       6️⃣ DEFAULT
    ========================== */

    if (!reply) reply = eliConfig.responses?.default || "ELI activo";

    // Guardar memoria
    if (eliConfig.memory?.enabled) {
      localStorage.setItem("eli_last_message", input);
      eliConfig.memory.lastMessage = input;
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
