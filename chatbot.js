// eli-core/chatbot.js
// ELI v1 – estado estable confirmado

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
      reply = "Hola 👋 Soy ELI. ¿En qué te ayudo?";
    } else if (text.includes("quien eres")) {
      reply = "Soy ELI, un asistente creado por ti.";
    } else if (text.includes("estado")) {
      reply = "ELI está funcionando correctamente ✅";
    } else {
      reply = "Te escucho 🙂";
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

// Botón para abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
