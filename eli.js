// ELI v3.0 - Autoprogramación controlada
// Prioridad:
// comandos → sistema → reglas → acciones → aprendizajes → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado v3.0");

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
    mode: "manual", // manual | experimental
    responses: { default: "ELI activo" }
  };

  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) eliConfig = await res.json();
  } catch {}

  /* =========================
     ESTADOS PRINCIPALES
  ========================== */

  let eliActions = JSON.parse(localStorage.getItem("eli_actions") || "{}");
  let eliRules = JSON.parse(localStorage.getItem("eli_rules") || "[]");
  let eliVersions = JSON.parse(localStorage.getItem("eli_versions") || "[]");

  let pendingConfirmation = null;

  /* =========================
     VERSIONADO
  ========================== */

  function saveVersion(reason) {
    const snapshot = {
      date: new Date().toISOString(),
      reason,
      actions: JSON.parse(JSON.stringify(eliActions)),
      rules: JSON.parse(JSON.stringify(eliRules))
    };

    eliVersions.push(snapshot);
    localStorage.setItem("eli_versions", JSON.stringify(eliVersions));
  }

  function rollbackVersion(index) {
    const version = eliVersions[index];
    if (!version) return "❌ Versión no encontrada.";

    eliActions = version.actions;
    eliRules = version.rules;

    localStorage.setItem("eli_actions", JSON.stringify(eliActions));
    localStorage.setItem("eli_rules", JSON.stringify(eliRules));

    return `♻️ Restaurado a versión del ${version.date}`;
  }

  /* =========================
     EJECUTOR DE ACCIONES
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

  sendBtn.addEventListener("click", function () {
    const input = inputElement.value.trim();
    if (!input) {
      response.textContent = "Escribe algo primero 🙂";
      return;
    }

    const text = input.toLowerCase();
    let reply = "";

    /* =========================
       1️⃣ SISTEMA / CONTROL
    ========================== */

    if (text === "modo experimental") {
      eliConfig.mode = "experimental";
      reply = "🧪 Modo experimental activado.";
    }

    else if (text === "modo seguro") {
      eliConfig.mode = "manual";
      reply = "🔒 Modo seguro activado.";
    }

    else if (text === "versiones") {
      reply =
        eliVersions.length === 0
          ? "No hay versiones guardadas."
          : "🕒 Versiones:\n- " +
            eliVersions.map(
              (v, i) => `${i}: ${v.date} (${v.reason})`
            ).join("\n- ");
    }

    else if (text.startsWith("rollback ")) {
      const index = parseInt(text.replace("rollback ", ""));
      reply = rollbackVersion(index);
    }

    /* =========================
       2️⃣ AUTOPROGRAMACIÓN
    ========================== */

    else if (
      eliConfig.mode === "experimental" &&
      text.startsWith("cuando ")
    ) {
      // Formato:
      // cuando diga X haz Y
      const match = input.match(/cuando diga (.+) haz (.+)/i);

      if (match) {
        const trigger = match[1].trim().toLowerCase();
        const action = match[2].trim();

        pendingConfirmation = { trigger, action };
        reply =
          `⚠️ Voy a crear la regla:\n` +
          `"${trigger}" → "${action}"\n` +
          `¿Confirmas? (si / no)`;
      } else {
        reply =
          "Formato inválido. Usa: cuando diga X haz Y";
      }
    }

    else if (
      pendingConfirmation &&
      (text === "si" || text === "sí")
    ) {
      saveVersion("Auto-regla creada");

      eliRules.push(pendingConfirmation);
      localStorage.setItem(
        "eli_rules",
        JSON.stringify(eliRules)
      );

      reply = "✅ Regla creada correctamente.";
      pendingConfirmation = null;
    }

    else if (pendingConfirmation && text === "no") {
      reply = "❌ Creación cancelada.";
      pendingConfirmation = null;
    }

    /* =========================
       3️⃣ EJECUCIÓN DE REGLAS
    ========================== */

    else {
      for (const rule of eliRules) {
        if (text.includes(rule.trigger)) {
          reply = executeAction(rule.action);
          break;
        }
      }
    }

    /* =========================
       4️⃣ RESPUESTAS CONFIG
    ========================== */

    if (!reply && eliConfig.responses) {
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
