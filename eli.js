// ELI v1.2 - núcleo estable con control de estado
// Evolución segura sin romper el funcionamiento actual

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración por defecto (modo seguro)
  let eliConfig = {
    mode: "manual",
    allowEvolution: false,
    responses: {
      default: "ELI activo, pero sin configuración externa."
    }
  };

  // Cargar eli-config.json
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      const externalConfig = await res.json();
      eliConfig = { ...eliConfig, ...externalConfig };
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

    // 🔍 Comando de estado
    if (input === "estado") {
      response.textContent =
        `ELI modo: ${eliConfig.mode} | evolución: ` +
        (eliConfig.allowEvolution ? "habilitada" : "bloqueada");
      inputElement.value = "";
      return;
    }

    // Respuesta por defecto
    let reply = eliConfig.responses?.default || "Te escucho 🙂";

    // Coincidencias configurables
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
