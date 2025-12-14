// eli-core/chatbot.js
// ELI v1 – núcleo estable y funcional

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

    // 🔹 MODO MANUAL (estable)
    if (text.includes("hola")) {
      reply = "Hola 👋 Soy ELI (modo manual). ¿En qué te ayudo?";
    } else if (text.includes("quien eres")) {
      reply = "Soy ELI, un asistente en evolución creado por ti.";
    } else if (text.includes("estado")) {
      reply = "ELI está funcionando correctamente ✅";
    } else {
      reply = "Aún estoy aprendiendo, pero te escucho 🙂";
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

// 🔹 Abrir ChatGPT en nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
