// ELI v3.2 - Autoprogramación flexible y segura
// Prioridad: comandos → reglas → tareas → acciones → respuestas → IA → default

document.addEventListener("DOMContentLoaded", function () {
  console.log("ELI iniciado v3.2");

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
     ESTADOS PERSISTENTES
  ========================== */

  let eliActions = JSON.parse(localStorage.getItem("eli_actions") || "{}");
  let eliRules = JSON.parse(localStorage.getItem("eli_rules") || "[]");
  let pendingAction = null;

  /* =========================
     EJECUTOR DE ACCIONES DINÁMICAS
  ========================== */

  function executeAction(action) {
    const clean = action.trim();

    // Acciones de tipo 'abrir'
    if (clean.toLowerCase().startsWith("abrir ")) {
      const url = clean.slice(6).trim();
      window.open(url, "_blank");
      return `🌐 Abriendo ${url}`;
    }

    // Acción 'decir'
    if (clean.toLowerCase().startsWith("decir ")) {
      return clean.slice(6).trim();
    }

    // Si no es un comando predefinido, devuelve como mensaje
    return clean;
  }

  /* =========================
     EVENTO PRINCIPAL
  ========================== */

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* =========================
       1️⃣ LISTAR ACCIONES / REGLAS
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
       2️⃣ CREAR / EDITAR ACCIÓN
    ========================== */

    else if (text.startsWith("accion ")) {
      const content = input.substring(7);
      const parts = content.split("=");

      if (parts.length === 2) {
        const name = parts[0].trim().toLowerCase();
        const action = parts[1].trim();

        if (name && action) {
          // Actualización de acción
          eliActions[name] = action;
          localStorage.setItem("eli_actions", JSON.stringify(eliActions));
          reply = `⚙️ Acción "${name}" registrada o actualizada.`;
        } else reply = "Nombre o acción inválidos.";
      } else reply = "Formato: accion nombre = instruccion";
    }

    /* =========================
       3️⃣ EJECUCIÓN DE ACCIÓN CON CONFIRMACIÓN
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
       4️⃣ CREAR REGLA
    ========================== */

    else if (text.startsWith("cuando ")) {
      const match = input.match(/cuando diga (.+) haz (.+)/i);

      if (match) {
        const trigger = match[1].trim().toLowerCase();
        const action = match[2].trim();

        eliRules.push({ trigger, action });
        localStorage.setItem("eli_rules", JSON.stringify(eliRules));
        reply = `✅ Regla creada: "${trigger}" → "${action}"`;
      } else {
        reply = "Formato incorrecto. Usa: cuando diga X haz Y";
      }
    }

    /* =========================
       5️⃣ RESPUESTAS CONFIGURADAS
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
       6️⃣ DEFAULT
    ========================== */

    if (!reply) reply = eliConfig.responses?.default || "ELI activo";

    response.textContent = reply;
    inputElement.value = "";
  });
});

function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
