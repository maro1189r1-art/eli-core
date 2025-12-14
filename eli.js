// ELI v1.6 - confirmación segura antes de ejecutar
// Paso 2 del sistema autoprogramable

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

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    const text = input.toLowerCase();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    // 🔐 Confirmación pendiente
    if (pendingAction) {
      if (text === "si" || text === "sí") {
        response.textContent = `✅ Acción confirmada:\n${pendingAction.description}`;
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

    // 🧠 Detectar intención
    if (text.startsWith("tarea:")) {
      pendingAction = {
        type: "tarea",
        description: input
      };
      response.textContent =
        "⚠️ Detecté una TAREA.\n¿Confirmas ejecutarla? (sí / no)";
    }
    else if (text.startsWith("respuesta:")) {
      pendingAction = {
        type: "respuesta",
        description: input
      };
      response.textContent =
        "⚠️ Detecté una MODIFICACIÓN DE RESPUESTA.\n¿Confirmas ejecutarla? (sí / no)";
    }
    else if (text.startsWith("accion:")) {
      pendingAction = {
        type: "accion",
        description: input
      };
      response.textContent =
        "⚠️ Detecté una ACCIÓN.\n¿Confirmas ejecutarla? (sí / no)";
    }
    else {
      response.textContent =
        eliConfig.responses?.default || "ELI activo";
    }

    // Guardar memoria
    if (eliConfig.memory?.enabled) {
      localStorage.setItem("eli_last_message", input);
      eliConfig.memory.lastMessage = input;
    }

    inputElement.value = "";
  });
});

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
