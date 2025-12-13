// ELI v1 - núcleo básico funcional

console.log("ELI conectado correctamente");

// Botón Enviar
document.getElementById("sendBtn").addEventListener("click", function () {
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");
  const input = inputElement.value;

  if (input.trim() === "") {
    response.textContent = "Escribe algo primero 🙂";
    return;
  }

  let reply = "";
  const text = input.toLowerCase();

  if (text.includes("hola")) {
    reply = "Hola 👋 Soy ELI, ¿en qué te ayudo?";
  } else if (text.includes("quien eres")) {
    reply = "Soy ELI, un asistente en evolución creado por ti.";
  } else {
    reply = "Aún estoy aprendiendo, pero te escucho 🙂";
  }

  response.textContent = reply;
  inputElement.value = ""; // limpia el input
});

// Abrir ChatGPT en una nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
