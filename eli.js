// ELI v1.6 - núcleo estable con prioridades correctas
// Prioriza: comandos → mejoras → respuestas configuradas → default

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

  // Cargar memoria guardada
  if (eliConfig.memory?.enabled) {
    const savedMemory = localStorage.getItem("eli_last_message");
    if (savedMemory) {
      eliConfig.memory.lastMessage = savedMemory;
    }
  }

  // Cargar mejoras guardadas
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
       1️⃣ COMANDOS EXPLÍCITOS
    ========================== */

    // Ver memoria
    if (text === "memoria" && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo que dijiste: "${eliConfig.memory.lastMessage}"`
        : "Aún no tengo nada en memoria.";
    }

    // Agregar mejora
    else if (text.startsWith("mejora:")) {
      const improvement = input.substring(7).trim();
      if (improvement) {
        eliImprovements.push(improvement);
        localStorage.setItem(
          "eli_improvements",
          JSON.stringify(eliImprovements)
        );
        reply = "✅ Mejora registrada. La tendré en cuenta.";
      } else {
        reply = "Escribe la mejora después de 'mejora:'.";
      }
    }

    // Listar mejoras
    else if (text === "mejoras") {
      reply =
        eliImprovements.length === 0
          ? "No tengo mejoras pendientes aún."
          : "📌 Mejoras registradas:\n- " + eliImprovements.join("\n- ");
    }

    /* =========================
       2️⃣ APLICAR MEJORAS
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
        "Mi objetivo es ayudarte a construir y automatizar sistemas inteligentes,\n" +
        "evolucionando paso a paso contigo.";
    }

    /* =========================
       3️⃣ RESPUESTAS CONFIGURADAS
    ========================== */

    else if (eliConfig.responses) {
      let matched = false;
      for (const key in eliConfig.responses) {
        if (key !== "default" && text.includes(key)) {
          reply = eliConfig.responses[key];
          matched = true;
          break;
        }
      }
      if (!matched) {
        reply = eliConfig.responses.default || "ELI activo";
      }
    }

    /* =========================
       4️⃣ DEFAULT FINAL
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

// Abrir ChatGPT en nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
