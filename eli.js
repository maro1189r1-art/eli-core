// ELI v1.3 - núcleo administrable desde chat
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
      hola: "Hola 👋 Soy ELI",
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
    const raw = inputElement.value.trim();
    const input = raw.toLowerCase();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    // 🔐 COMANDOS ADMIN
    if (input === "/estado") {
      response.textContent =
        `Modo: ${eliConfig.mode} | Evolución: ${eliConfig.allowEvolution ? "ACTIVA" : "BLOQUEADA"}`;
      inputElement.value = "";
      return;
    }

    if (input.startsWith("/setmodo ")) {
      const nuevoModo = input.replace("/setmodo ", "");
      eliConfig.mode = nuevoModo;
      response.textContent = `Modo cambiado a: ${nuevoModo}`;
      inputElement.value = "";
      return;
    }

    if (input.startsWith("/setrespuesta ")) {
      // formato: /setrespuesta hola=Hola nuevo texto
      const data = raw.replace("/setrespuesta ", "");
      const partes = data.split("=");

      if (partes.length === 2) {
        const key = partes[0].toLowerCase().trim();
        const value = partes[1].trim();
        eliConfig.responses[key] = value;
        response.textContent = `Respuesta guardada para "${key}"`;
      } else {
        response.textContent = "Formato inválido. Usa: /setrespuesta clave=respuesta";
      }

      inputElement.value = "";
      return;
    }

    // 🧠 Respuestas normales
    let reply = eliConfig.responses?.default || "Te escucho 🙂";

    for (const key in eliConfig.responses) {
      if (input.includes(key)) {
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
