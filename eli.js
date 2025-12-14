// ELI v1.4.1 - núcleo estable con memoria y órdenes priorizadas

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

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
    }
  } catch (e) {
    console.warn("No se pudo cargar eli-config.json");
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

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    const text = input.toLowerCase();

    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    let reply = "";

    // 🔴 PRIORIDAD 1: COMANDOS
    if (text === "mejoras") {
      reply = eliImprovements.length
        ? "📌 Mejoras:\n- " + eliImprovements.join("\n- ")
        : "No hay mejoras registradas.";
    }

    else if (text.startsWith("mejora:")) {
      const imp = input.substring(7).trim();
      if (imp) {
        eliImprovements.push(imp);
        localStorage.setItem(
          "eli_improvements",
          JSON.stringify(eliImprovements)
        );
        reply = "✅ Mejora guardada.";
      } else {
        reply = "Escribe la mejora después de 'mejora:'";
      }
    }

    else if (text === "memoria" && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo: "${eliConfig.memory.lastMessage}"`
        : "No tengo recuerdos aún.";
    }

    // 🟢 PRIORIDAD 2: RESPUESTAS CONFIGURADAS
    else {
      reply = eliConfig.responses?.default || "Te escucho 🙂";
      for (const key in eliConfig.responses) {
        if (text.includes(key)) {
          reply = eliConfig.responses[key];
          break;
        }
      }
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

function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
