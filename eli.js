// ELI v1.1 - núcleo con configuración externa
// Lee eli-config.json para comportamiento dinámico

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración por defecto (seguridad)
  let eliConfig = {
    mode: "manual",
    responses: {
      default: "ELI activo, pero sin configuración externa."
    }
  };

  // Intentar cargar eli-config.json
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      eliConfig = await res.json();
      console.log("ELI config cargada:", eliConfig);
    } else {
      console.warn("ELI: no se pudo cargar eli-config.json");
    }
  } catch (error) {
    console.warn("ELI: error leyendo eli-config.json", error);
  }

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim().toLowerCase();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    let reply = eliConfig.responses?.default || "Te escucho 🙂";

    // Buscar coincidencias en responses
    if (eliConfig.responses) {
      for (const key in eliConfig.responses) {
        if (input.includes(key)) {
          reply = eliConfig.responses[key];
          break;
        }
      }
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

// Abrir ChatGPT en nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
