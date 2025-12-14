// ELI v1 - núcleo con ejecución de órdenes remotas

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI conectado correctamente");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // 🔹 Leer configuración remota
  try {
    const res = await fetch("eli-config.json");
    const config = await res.json();

    if (config.lastCommand) {
      ejecutarOrden(config.lastCommand.toLowerCase());
    }
  } catch (err) {
    console.warn("No se pudo leer eli-config.json");
  }

  function ejecutarOrden(orden) {
    if (orden.includes("saludar")) {
      response.textContent = "👋 Hola, recibí tu orden desde el celular.";
    } else if (orden.includes("estado")) {
      response.textContent = "✅ ELI está activa y funcionando correctamente.";
    } else {
      response.textContent = `📡 Orden recibida: "${orden}" (sin acción definida aún)`;
    }
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

  sendBtn.addEventListener("click", processInput);

  inputElement.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      processInput();
    }
  });
});

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
