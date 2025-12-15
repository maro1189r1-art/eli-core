// ELI v1.8 - auto-aprendizaje de respuestas (sin backend)

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración base
  let eliConfig = {
    mode: "manual",
    memory: { enabled: false, lastMessage: "" },
    responses: { default: "ELI activo" }
  };

  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) eliConfig = await res.json();
  } catch {}

  // Memoria
  if (eliConfig.memory?.enabled) {
    const saved = localStorage.getItem("eli_last_message");
    if (saved) eliConfig.memory.lastMessage = saved;
  }

  // Respuestas aprendidas
  let learnedResponses = JSON.parse(
    localStorage.getItem("eli_learned_responses") || "{}"
  );

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* 1️⃣ Comando: enseñar respuesta */
    if (
      text.startsWith("mejoras cuando diga") &&
      text.includes("responde")
    ) {
      const match = input.match(/cuando diga (.+) responde (.+)/i);
      if (match) {
        const trigger = match[1].toLowerCase().trim();
        const answer = match[2].trim();

        learnedResponses[trigger] = answer;
        localStorage.setItem(
          "eli_learned_responses",
          JSON.stringify(learnedResponses)
        );

        reply = `✅ Aprendido. Cuando digas "${trigger}", responderé eso.`;
      } else {
        reply = "Formato incorrecto. Ejemplo:\nmejoras cuando diga hola responde Hola 👋";
      }
    }

    /* 2️⃣ Respuestas aprendidas */
    else if (learnedResponses[text]) {
      reply = learnedResponses[text];
    }

    /* 3️⃣ Respuestas de config */
    else if (eliConfig.responses) {
      let found = false;
      for (const key in eliConfig.responses) {
        if (key !== "default" && text.includes(key)) {
          reply = eliConfig.responses[key];
          found = true;
          break;
        }
      }
      if (!found) reply = eliConfig.responses.default;
    }

    /* 4️⃣ Default */
    else {
      reply = "ELI activo";
    }

    // Guardar memoria
    if (eliConfig.memory?.enabled) {
      localStorage.setItem("eli_last_message", input);
      eliConfig.memory.lastMessage = input;
    }

    response.textContent = reply;
    inputElement.value = "";
  });
});

// Abrir ChatGPT
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
