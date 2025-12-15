// ELI v2.6 - Acciones seguras y auditables
// Prioridad:
// comandos → acciones → reglas → aprendizajes → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado v2.6");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: DOM incompleto");
    return;
  }

  /* =========================
     CONFIGURACIÓN
  ========================== */

  let eliConfig = {
    mode: "manual",
    responses: { default: "ELI activo" },
    ai: { enabled: false }
  };

  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) eliConfig = await res.json();
  } catch {}

  /* =========================
     ESTADOS
  ========================== */

  let eliActions = JSON.parse(
    localStorage.getItem("eli_actions") || "{}"
  );

  let eliRules = JSON.parse(
    localStorage.getItem("eli_rules") || "[]"
  );

  let pendingAction = null;

  /* =========================
     EJECUTOR
  ========================== */

  function executeAction(action) {
    if (action.startsWith("abrir ")) {
      const url = action.replace("abrir ", "").trim();
      window.open(url, "_blank");
      return `🌐 Abriendo ${url}`;
    }

    if (action.startsWith("decir ")) {
      return action.replace("decir ", "").trim();
    }

    return "⚠️ Acción no reconocida.";
  }

  /* =========================
     EVENTO PRINCIPAL
  ========================== */

  sendBtn.addEventListener("click", async function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* =========================
       1️⃣ COMANDOS DE LISTADO
    ========================== */

    if (text === "acciones") {
      const keys = Object.keys(eliActions);
      reply =
        keys.length === 0
          ? "No hay acciones registradas."
          : "⚙️ Acciones:\n- " + keys.join("\n- ");
    }

    else if (text === "reglas") {
      reply =
        eliRules.length === 0
          ? "No hay reglas registradas."
          : "📐 Reglas:\n- " +
            eliRules.map(r => `${r.trigger} → ${r.action}`).join("\n- ");
    }

    /* =========================
       2️⃣ CREAR ACCIÓN
    ========================== */

    else if (text.startsWith("accion ")) {
      const content = input.substring(7);
      const parts = content.split("=");

      if (parts.length === 2) {
        const name = parts[0].trim().toLowerCase();
        const action = parts[1].trim();

        if (name && action) {
          eliActions[name] = action;
          localStorage.setItem(
            "eli_actions",
            JSON.stringify(eliActions)
          );
          reply = `⚙️ Acción "${name}" registrada.`;
        } else reply = "Nombre o acción inválidos.";
      } else reply = "Formato: accion nombre = instruccion";
    }

    /* =========================
       3️⃣ EJECUCIÓN CON CONFIRMACIÓN
    ========================== */

    else if (eliActions[text]) {
      pendingAction = eliActions[text];
      reply = `❓ ¿Confirmas ejecutar "${text}"? (si / no)`;
    }

    else if (pendingAction && (text === "si" || text === "sí")) {
      reply = executeAction(pendingAction);
      pendingAction = null;
    }

    else if (pendingAction && text === "no") {
      reply = "❌ Acción cancelada.";
      pendingAction = null;
    }

    /* =========================
       4️⃣ RESPUESTAS CONFIG
    ========================== */

    else if (eliConfig.responses) {
      for (const key in eliConfig.responses) {
        if (key !== "default" && text.includes(key)) {
          reply = eliConfig.responses[key];
          break;
        }
      }
    }

    /* =========================
       5️⃣ DEFAULT
    ========================== */

    if (!reply) reply = eliConfig.responses?.default || "ELI activo";

    response.textContent = reply;
    inputElement.value = "";
  });
});

function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
