// ELI v1.7 - Núcleo estable preparado para IA
// Prioridad: comandos → mejoras → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración por defecto segura
  let eliConfig = {
    mode: "manual",
    memory: { enabled: false, lastMessage: "" },
    responses: { default: "ELI activo" },
    ai: { enabled: false }
  };

  // Cargar configuración externa
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      eliConfig = await res.json();
      console.log("ELI config cargada:", eliConfig);
    }
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

  // 🧠 Cerebro IA (simulado por ahora)
  async function askAI(message) {
    return "🤖 IA aún no conectada, pero lista para activarse.";
  }

  sendBtn.addEventListener("click", async function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* 1️⃣ COMANDOS */
    if (text === "memoria" && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo que dijiste: "${eliConfig.memory.lastMessage}"`
        : "Aún no tengo memoria.";
    }

    else if (text.startsWith("mejora:")) {
      const imp = input.substring(7).trim();
      if (imp) {
        eliImprovements.push(imp);
        localStorage.setItem(
          "eli_improvements",
          JSON.stringify(eliImprovements)
        );
        reply = "✅ Mejora registrada.";
      } else reply = "Escribe la mejora después de 'mejora:'";
    }

    else if (text === "mejoras") {
      reply =
        eliImprovements.length === 0
          ? "No hay mejoras pendientes."
          : "📌 Mejoras:\n- " + eliImprovements.join("\n- ");
    }

    /* 2️⃣ MEJORAS APLICADAS */
    else if (
      text.includes("quien eres") &&
      eliImprovements.some(m => m.toLowerCase().includes("present"))
    ) {
      reply =
        "Soy ELI 🤖, un asistente digital en evolución.\n" +
        "Aprendo de configuración, memoria y mejoras.\n" +
        "Mi objetivo es ayudarte a construir sistemas inteligentes.";
    }

    /* 3️⃣ RESPUESTAS CONFIG */
    else if (eliConfig.responses) {
      let matched = false;
      for (const key in eliConfig.responses) {
        if (key !== "default" && text.includes(key)) {
          reply = eliConfig.responses[key];
          matched = true;
          break;
        }
      }
      if (!matched) reply = "";
    }

    /* 4️⃣ IA (si está habilitada) */
    if (!reply && eliConfig.ai?.enabled) {
      reply = await askAI(input);
    }

    /* 5️⃣ DEFAULT */
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

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
