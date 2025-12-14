// ELI v1.3 - núcleo estable con memoria controlada
// Lee configuración externa y guarda memoria local

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

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = eliConfig.responses?.default || "Te escucho 🙂";

    // Comando especial: memoria
    if (text.includes("memoria") && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo que dijiste: "${eliConfig.memory.lastMessage}"`
        : "Aún no tengo nada en memoria.";
    } else {
      // Buscar respuestas configuradas
      if (eliConfig.responses) {
        for (const key in eliConfig.responses) {
          if (text.includes(key)) {
            reply = eliConfig.responses[key];
            break;
          }
        }
      }
    }

    // Guardar memoria (siempre)
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
