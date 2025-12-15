// ELI v2.0 - Núcleo con Modo Control (Autoprogramable)
// Prioridad:
// control → comandos → aprendizajes → mejoras → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado v2.0");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  /* =========================
     CONFIGURACIÓN BASE
  ========================== */

  let eliConfig = {
    mode: "manual", // manual | ia
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

  /* =========================
     ESTADOS PERSISTENTES
  ========================== */

  // Memoria
  if (eliConfig.memory?.enabled) {
    const saved = localStorage.getItem("eli_last_message");
    if (saved) eliConfig.memory.lastMessage = saved;
  }

  // Mejoras
  let eliImprovements = JSON.parse(
    localStorage.getItem("eli_improvements") || "[]"
  );

  // Aprendizajes
  let eliLearnings = JSON.parse(
    localStorage.getItem("eli_learnings") || "{}"
  );

  /* =========================
     IA (SIMULADA POR AHORA)
  ========================== */

  async function askAI(message) {
    return "🤖 IA aún no conectada, pero lista para activarse.";
  }

  /* =========================
     EVENTO PRINCIPAL
  ========================== */

  sendBtn.addEventListener("click", async function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* =========================
       1️⃣ MODO CONTROL (NUEVO)
    ========================== */

    // Cambiar modo
    if (text.startsWith("modo:")) {
      const value = text.replace("modo:", "").trim();
      if (value === "manual" || value === "ia") {
        eliConfig.mode = value;
        reply = `✅ Modo cambiado a: ${value}`;
      } else {
        reply = "Modo inválido. Usa: modo: manual | modo: ia";
      }
    }

    // Activar / desactivar memoria
    else if (text.startsWith("memoria:")) {
      const value = text.replace("memoria:", "").trim();
      if (value === "on") {
        eliConfig.memory.enabled = true;
        reply = "✅ Memoria activada";
      } else if (value === "off") {
        eliConfig.memory.enabled = false;
        localStorage.removeItem("eli_last_message");
        reply = "🧹 Memoria desactivada y limpiada";
      } else {
        reply = "Usa: memoria: on | memoria: off";
      }
    }

    // Estado general
    else if (text === "estado") {
      reply =
        "🧠 Estado de ELI:\n" +
        `- Modo: ${eliConfig.mode}\n` +
        `- Memoria: ${eliConfig.memory.enabled ? "activa" : "inactiva"}\n` +
        `- Aprendizajes: ${Object.keys(eliLearnings).length}\n` +
        `- Mejoras: ${eliImprovements.length}`;
    }

    /* =========================
       2️⃣ COMANDOS
    ========================== */

    else if (text === "memoria" && eliConfig.memory?.enabled) {
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
      } else {
        reply = "Escribe la mejora después de 'mejora:'";
      }
    }

    else if (text === "mejoras") {
      reply =
        eliImprovements.length === 0
          ? "No hay mejoras pendientes."
          : "📌 Mejoras:\n- " + eliImprovements.join("\n- ");
    }

    /* =========================
       3️⃣ APRENDIZAJE
    ========================== */

    else if (text.startsWith("aprende ")) {
      const content = input.substring(8);
      const parts = content.split("=");

      if (parts.length === 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts[1].trim();

        if (key && value) {
          eliLearnings[key] = value;
          localStorage.setItem(
            "eli_learnings",
            JSON.stringify(eliLearnings)
          );
          reply = `🧠 Aprendido. Cuando digas "${key}", responderé eso.`;
        } else {
          reply = "La clave y la respuesta no pueden estar vacías.";
        }
      } else {
        reply = "Formato correcto: aprende pregunta = respuesta";
      }
    }

    else if (text === "aprendizajes") {
      const keys = Object.keys(eliLearnings);
      reply =
        keys.length === 0
          ? "Aún no he aprendido nada."
          : "📚 Aprendizajes:\n- " + keys.join("\n- ");
    }

    /* =========================
       4️⃣ USAR APRENDIZAJES
    ========================== */

    if (!reply) {
      for (const key in eliLearnings) {
        if (text.includes(key)) {
          reply = eliLearnings[key];
          break;
        }
      }
    }

    /* =========================
       5️⃣ RESPUESTAS CONFIG
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
       6️⃣ IA
    ========================== */

    if (!reply && eliConfig.mode === "ia" && eliConfig.ai?.enabled) {
      reply = await askAI(input);
    }

    /* =========================
       7️⃣ DEFAULT
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

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
