// ELI v3.2 - Autoprogramación sin errores silenciosos
// Regla simple: si no es comando, ES TEXTO

document.addEventListener("DOMContentLoaded", function () {
  console.log("ELI iniciado v3.2");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI: DOM incompleto");
    return;
  }

  let eliRules = JSON.parse(localStorage.getItem("eli_rules") || "[]");
  let pendingRule = null;

  function executeAction(action) {
    const clean = action.trim();

    // abrir enlace
    if (clean.toLowerCase().startsWith("abrir ")) {
      const url = clean.slice(6).trim();
      window.open(url, "_blank");
      return `🌐 Abriendo ${url}`;
    }

    // decir explícito
    if (clean.toLowerCase().startsWith("decir ")) {
      return clean.slice(6).trim();
    }

    // 🔥 TEXTO LIBRE = RESPUESTA
    return clean;
  }

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    // Crear regla
    if (text.startsWith("cuando diga ")) {
      const match = input.match(/cuando diga (.+) haz (.+)/i);
      if (match) {
        pendingRule = {
          trigger: match[1].trim().toLowerCase(),
          action: match[2].trim()
        };
        reply =
          `⚠️ Crear regla:\n"${pendingRule.trigger}" → "${pendingRule.action}"\n¿Confirmas? (si / no)`;
      } else {
        reply = "Formato incorrecto.";
      }
    }

    // Confirmar regla
    else if (pendingRule && (text === "si" || text === "sí")) {
      eliRules.push(pendingRule);
      localStorage.setItem("eli_rules", JSON.stringify(eliRules));
      pendingRule = null;
      reply = "✅ Regla creada.";
    }

    else if (pendingRule && text === "no") {
      pendingRule = null;
      reply = "❌ Cancelado.";
    }

    // Ejecutar reglas
    else {
      for (const rule of eliRules) {
        if (text.includes(rule.trigger)) {
          reply = executeAction(rule.action);
          break;
        }
      }
    }

    if (!reply) reply = "ELI activo";

    response.textContent = reply;
    inputElement.value = "";
  });
});

function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
