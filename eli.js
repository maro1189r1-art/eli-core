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

  response.textContent = "ELI dice: " + input;
});

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
