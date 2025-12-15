// ELI v1.7 - núcleo estable con mejoras flexibles
// Prioridad: comandos → mejoras → respuestas → default

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
    memory: {
      enabled: false,
      lastMessage: ""
    },
    responses: {
      default: "ELI activo"
    }
  };

  // Cargar configuración externa
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      eliConfig = await res.json();
      console.log("ELI config cargada:", eliConfig);
    }
  } catch (error) {
    console.warn("ELI: error leyendo eli-config.json");
  }

  // Cargar memoria
  if (eliConfig.memory?.enabled) {
    const savedMemory = localStorage.getItem("eli_last_message");
    if (savedMemory) {
      eliConfig.memory.lastMessage = savedMemory;
    }
  }

  // Cargar mejoras
  let eliImprovements = JSON.parse(
    localStorage.getItem("eli_improvements") || "[]"
  );

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* =========================
       1️⃣ COMANDOS
    ========================== */

    if (text === "memoria" && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo que dijiste: "${eliConfig.memory.lastMessage}"`
        : "Aún no tengo nada en memoria.";
    }

    /* =========================
       2️⃣ MEJORAS (flexibles)
    ========================== */

    else if (
      text.startsWith("mejora") ||
      text.startsWith("mejoras ") ||
      text.startsWith("agrega mejora")
    ) {
      let improvement = input
        .replace(/^mejoras?:?/i, "")
        .replace(/^agrega mejora:?/i, "")
        .trim();

      if (improvement.length > 0) {
        eliImprovements.push(improvement);
        localStorage.setItem(
          "eli_improvements",
          JSON.stringify(eliImprovements)
        );
        reply = "✅ Mejora registrada correctamente.";
      } else {
        reply = "Escribe la mejora después del comando.";
      }
    }

    else if (text === "mejoras") {
      reply =
        eliImprovements.length === 0
          ? "No tengo mejoras registradas."
          : "📌 Mejoras registradas:\n- " + eliImprovements.join("\n- ");
    }

    /* =========================
       3️⃣ APLICAR MEJORAS
    ========================== */

    else if (
      text.includes("quien eres") &&
      eliImprovements.some(m =>
        m.toLowerCase().includes("present")
      )
    ) {
      reply =
        "Soy ELI 🤖, un asistente digital en evolución.\n" +
        "Aprendo mediante memoria, configuración y mejoras que tú defines.\n" +
        "Mi objetivo es ayudarte a crear y automatizar sistemas inteligentes,\n" +
        "evolucionando paso a paso contigo.";
    }

    /* =========================
       4️⃣ RESPUESTAS CONFIGURADAS
    ========================== */

    else if (eliConfig.responses) {
      let found = false;
      for (const key in eliConfig.responses) {
        if (key !== "default" && text.includes(key)) {
          reply = eliConfig.responses[key];
          found = true;
          break;
        }
      }
      if (!found) {
        reply = eliConfig.responses.default || "ELI activo";
      }
    }

    /* =========================
       5️⃣ DEFAULT
    ========================== */

    else {
      reply = "ELI activo";
    }

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
