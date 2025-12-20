// ELI v3.2 - Fallback a ChatGPT (SUMADO, NO REEMPLAZA)
// Prioridad:
// sistema → autoprogramación → reglas → ChatGPT → default

document.addEventListener("DOMContentLoaded", async function () {
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
    responses: { default: "ELI activo" }
  };

  try {
    const res = await fetch("./eli-config.json");
    if (res.ok) eliConfig = await res.json();
  } catch {}

  /* =========================
     ESTADOS
  ========================== */

  let eliRules = JSON.parse(localStorage.getItem("eli_rules") || "[]");
  let eliVersions = JSON.parse(localStorage.getItem("eli_versions") || "[]");
  let pendingConfirmation = null;

  /* =========================
     VERSIONADO
  ========================== */

  function saveVersion(reason) {
    eliVersions.push({
      date: new Date().toISOString(),
      reason,
      rules: JSON.parse(JSON.stringify(eliRules))
    });
    localStorage.setItem("eli_versions", JSON.stringify(eliVersions));
  }

  function rollbackVersion(index) {
    const version = eliVersions[index];
    if (!version) return "❌ Versión no encontrada.";

    eliRules = version.rules;
    localStorage.setItem("eli_rules", JSON.stringify(eliRules));

    return `♻️ Restaurado a versión ${index}`;
  }

  /* =========================
     EJECUTOR DE ACCIONES
  ========================== */

  function executeAction(action) {
    const clean = action.trim();

    if (clean.toLowerCase().startsWith("abrir ")) {
      const url = clean.substring(6).trim();
      window.open(url, "_blank");
      return `🌐 Abriendo ${url}`;
    }

    if (clean.toLowerCase().startsWith("decir ")) {
      return clean.substring(6).trim();
    }

    return clean;
  }

  /* =========================
     BLOQUE CHATGPT (NUEVO)
     SOLO FALLBACK
  ========================== */

  async function askChatGPT(message) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message
        })
      });

      if (!res.ok) {
        console.warn("ChatGPT no respondió correctamente");
        return null;
      }

      const data = await res.json();
      return data.reply || null;

    } catch (err) {
      console.error("Error ChatGPT:", err);
      return null;
    }
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
       SISTEMA
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
          ? "No hay versiones."
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
       AUTOPROGRAMACIÓN
    ========================== */

    else if (
      eliConfig.mode === "experimental" &&
      text.startsWith("cuando ")
    ) {
      const match = input.match(/cuando diga (.+) haz (.+)/i);

      if (match) {
        pendingConfirmation = {
          trigger: match[1].trim().toLowerCase(),
          action: match[2].trim()
        };

        reply =
          `⚠️ Crear regla:\n` +
          `"${pendingConfirmation.trigger}" → "${pendingConfirmation.action}"\n` +
          `¿Confirmas? (si / no)`;
      } else {
        reply = "Formato inválido. Usa: cuando diga X haz Y";
      }
    }

    else if (pendingConfirmation && (text === "si" || text === "sí")) {
      saveVersion("Regla creada");
      eliRules.push(pendingConfirmation);
      localStorage.setItem("eli_rules", JSON.stringify(eliRules));
      pendingConfirmation = null;
      reply = "✅ Regla creada correctamente.";
    }

    else if (pendingConfirmation && text === "no") {
      pendingConfirmation = null;
      reply = "❌ Operación cancelada.";
    }

    /* =========================
       EJECUCIÓN DE REGLAS
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
       CHATGPT FALLBACK
    ========================== */

    if (!reply) {
      const aiReply = await askChatGPT(input);
      if (aiReply) reply = aiReply;
    }

    /* =========================
       DEFAULT
    ========================== */

    if (!reply) reply = eliConfig.responses?.default || "ELI activo";

    response.textContent = reply;
    inputElement.value = "";
  });
});
