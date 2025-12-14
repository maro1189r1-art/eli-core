// ELI v1 - núcleo básico estable
// Preparado para evolución futura

let ELI_CONFIG = {
  mode: "manual",
  allowEvolution: false,
  lastCommand: ""
};

// Cargar configuración de ELI
fetch("./eli-config.json")
  .then(response => response.json())
  .then(config => {
    ELI_CONFIG = config;
    console.log("Configuración de ELI cargada:", ELI_CONFIG);
  })
  .catch(error => {
    console.warn("No se pudo cargar eli-config.json, usando valores por defecto");
  });

document.addEventListener("DOMContentLoaded", function () {
  console.log("ELI conectado correctamente");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    if (text.includes("hola")) {
      reply = "Hola 👋 Soy ELI, ¿en qué te ayudo?";
    } 
    else if (text.includes("quien eres")) {
      reply = "Soy ELI, un asistente en evolución creado por ti.";
    }
    else if (text.includes("modo")) {
      reply = `Estoy en modo: ${ELI_CONFIG.mode}`;
    }
    else {
      reply = "Aún estoy aprendiendo, pero te escucho 🙂";
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

// Abrir ChatGPT en una nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
