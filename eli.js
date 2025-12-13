// ELI v1 - núcleo básico funcional

console.log("ELI conectado correctamente");

// Botón Enviar
document.getElementById("sendBtn").addEventListener("click", function () {
  const input = document.getElementById("userInput").value;
  const response = document.getElementById("response");

  if (input.trim() === "") {
    response.textContent = "Escribe algo primero 🙂";
    return;
  }
let reply = "";

if (input.toLowerCase().includes("hola")) {
  reply = "Hola 👋 Soy ELI, ¿en qué te ayudo?";
} else if (input.toLowerCase().includes("quien eres")) {
  reply = "Soy ELI, un asistente en evolución creado por ti.";
} else {
  reply = "Aún estoy aprendiendo, pero te escucho 🙂";
}

response.textContent = reply;

});

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
