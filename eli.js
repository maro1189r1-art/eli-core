// ELI v1.7 - auto-configuración segura
// PASO 3: ELI modifica su comportamiento sin tocar código

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  let pendingAction = null;

  // Configuración base
  let eliConfig = {
    mode: "manual",
    memory: { enabled: true },
    responses: { default: "ELI activo" }
  };

  // Cargar config base
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      eliConfig = await res.json();
    }
  } catch {}

  // Cargar respuestas dinámicas
  const savedResponses = JSON.parse(
    localStorage.getItem("eli_dynamic_responses") || "{}"
  );

  eliConfig.responses = {
    ...eliConfig.responses,
    ...savedResponses
  };

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    const text = input.toLowerCase();

    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    // 🔐 Confirmación pendiente
    if (pendingAction) {
      if (text === "si" || text === "sí") {

        // Ejecutar acción
        if (pendingAction.type === "respuesta") {
          savedResponses[pendingAction.key] = pendingAction.value;
          localStorage.setItem(
            "eli_dynamic_responses",
            JSON.stringify(savedResponses)
          );
          response.textContent =
            `✅ Respuesta guardada:\n"${pendingAction.key}" → "${pendingAction.value}"`;
        }

        pendingAction = null;
      } else if (text === "no") {
        response.textContent = "❌ Acción cancelada.";
        pendingAction = null;
      } else {
        response.textContent = "Responde solo con: sí o no";
      }

      inputElement.value = "";
      return;
    }

    // 🧠 Detectar nueva respuesta
    if (text.startsWith("respuesta:")) {
      const content = input.substring(10).trim();
      const parts = content.split("=");

      if (parts.length === 2) {
        pendingAction = {
          type: "respuesta",
          key: parts[0].trim().toLowerCase(),
          value: parts[1].trim()
        };

        response.textContent =
          `⚠️ Nueva respuesta detectada:\n"${pendingAction.key}" → "${pendingAction.value}"\n¿Confirmas? (sí / no)`;
      } else {
        response.textContent =
          "Formato incorrecto.\nEjemplo:\nrespuesta: hola = Hola 👋";
      }

      inputElement.value = "";
      return;
    }

    // 🤖 Responder normalmente
    let reply = eliConfig.responses.default;

    for (const key in eliConfig.responses) {
      if (text.includes(key)) {
        reply = eliConfig.responses[key];
        break;
      }
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
