// ELI v1.2 - núcleo estable con comandos
// Controlado por eli-config.json

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración segura por defecto
  let eliConfig = {
    mode: "manual",
    allowEvolution: false,
    responses: {
      default: "ELI activo."
    }
  };

  // Cargar configuración externa
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      eliConfig = await res.json();
      console.log("Config cargada:", eliConfig);
    }
  } catch (e) {
    console.warn("No se pudo cargar eli-config.json");
  }

  sendBtn.addEventListener("click", function () {
    const inputRaw = inputElement.value.trim();
    const input = inputRaw.toLowerCase();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    // 🔐 COMANDOS ESPECIALES
    if (input === "/estado") {
      response.textContent =
        `Modo: ${eliConfig.mode} | Evolución: ${eliConfig.allowEvolution ? "ACTIVA" : "BLOQUEADA"}`;
      inputElement.value = "";
      return;
    }

    if (input === "/evolucion") {
      response.textContent = eliConfig.allowEvolution
        ? "Evolución permitida 🔓 (lista para futuro)"
        : "Evolución bloqueada 🔒";
      inputElement.value = "";
      return;
    }

    // 🧠 Respuestas normales
    let reply = eliConfig.responses?.default || "Te escucho 🙂";

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

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
