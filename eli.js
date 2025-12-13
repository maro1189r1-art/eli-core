// ELI v1 - núcleo básico estable
// Preparado para evolución futura (modo manual)

document.addEventListener("DOMContentLoaded", function () {
  console.log("ELI conectado correctamente");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  function processInput() {
    const input = inputElement.value.trim();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    if (text.includes("hola")) {
      reply = "Hola 👋 Soy ELI, ¿en qué te ayudo?";
    } else if (text.includes("quien eres")) {
      reply = "Soy ELI, un asistente en evolución creado por ti.";
    } else {
      reply = "Aún estoy aprendiendo, pero te escucho 🙂";
    }

    response.textContent = reply;
    inputElement.value = "";
  }

  // Click en botón
  sendBtn.addEventListener("click", processInput);

  // Enter desde teclado (PC o celular)
  inputElement.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      processInput();
    }
  });
});

// Abrir ChatGPT en una nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
