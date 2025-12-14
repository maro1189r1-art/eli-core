// ELI v1.5 - detección de intención (PASO 1)
// NO ejecuta cambios, solo identifica órdenes

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  // Configuración por defecto
  let eliConfig = {
    mode: "manual",
    memory: {
      enabled: false,
      lastMessage: ""
    },
    responses: {
      default: "ELI activo"
    }
  };

  // Cargar configuración externa
  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) {
      eliConfig = await res.json();
      console.log("ELI config cargada:", eliConfig);
    }
  } catch (error) {
    console.warn("ELI: error leyendo eli-config.json");
  }

  // Cargar memoria
  if (eliConfig.memory?.enabled) {
    const savedMemory = localStorage.getItem("eli_last_message");
    if (savedMemory) {
      eliConfig.memory.lastMessage = savedMemory;
    }
  }

  // Mejoras pendientes
  let eliImprovements = JSON.parse(
    localStorage.getItem("eli_improvements") || "[]"
  );

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();

    if (input === "") {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    // 🔎 DETECCIÓN DE INTENCIÓN (PASO 1)
    if (text.startsWith("tarea:")) {
      reply = "🧠 Intención detectada: CREAR TAREA\n(aún no ejecutada)";
    } 
    else if (text.startsWith("respuesta:")) {
      reply = "🧠 Intención detectada: MODIFICAR RESPUESTA\n(aún no ejecutada)";
    } 
    else if (text.startsWith("accion:")) {
      reply = "🧠 Intención detectada: EJECUTAR ACCIÓN\n(aún no ejecutada)";
    } 
    else if (text.startsWith("mejora:")) {
      const improvement = input.substring(7).trim();
      if (improvement) {
        eliImprovements.push(improvement);
        localStorage.setItem(
          "eli_improvements",
          JSON.stringify(eliImprovements)
        );
        reply = "✅ Mejora registrada (intención aceptada).";
      } else {
        reply = "Escribe la mejora después de 'mejora:'.";
      }
    }
    else if (text.includes("memoria") && eliConfig.memory?.enabled) {
      reply = eliConfig.memory.lastMessage
        ? `Recuerdo que dijiste: "${eliConfig.memory.lastMessage}"`
        : "Aún no tengo nada en memoria.";
    }
    else {
      // Respuestas normales desde config
      reply = eliConfig.responses?.default || "Te escucho 🙂";
      if (eliConfig.responses) {
        for (const key in eliConfig.responses) {
          if (text.includes(key)) {
            reply = eliConfig.responses[key];
            break;
          }
        }
      }
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

// Abrir ChatGPT en nueva ventana
function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
