// ELI v2.5 - Núcleo con Acciones Ejecutables
// Prioridad:
// acciones → reglas → tareas → aprendizajes → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado v2.5");

  const sendBtn = document.getElementById("sendBtn");
  const inputElement = document.getElementById("userInput");
  const response = document.getElementById("response");

  if (!sendBtn || !inputElement || !response) {
    console.error("ELI error: elementos del DOM no encontrados");
    return;
  }

  /* =========================
     CONFIGURACIÓN BASE
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

  const eliActions = JSON.parse(
    localStorage.getItem("eli_actions") || "{}"
  );

  const eliRules = JSON.parse(
    localStorage.getItem("eli_rules") || "[]"
  );

  /* =========================
     EJECUTOR DE ACCIONES
  ========================== */

  function executeAction(action) {
    // Acción: abrir url
    if (action.startsWith("abrir ")) {
      const url = action.replace("abrir ", "").trim();
      window.open(url, "_blank");
      return `🌐 Abriendo ${url}`;
    }

    // Acción: mostrar mensaje
    if (action.startsWith("decir ")) {
      return action.replace("decir ", "").trim();
    }

    // Acción desconocida
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
       1️⃣ CREAR ACCIÓN
    ========================== */

    // Formato: accion nombre = instruccion
    if (text.startsWith("accion ")) {
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
        } else {
          reply = "Nombre o acción inválidos.";
        }
      } else {
        reply = "Formato: accion nombre = instruccion";
      }
    }

    /* =========================
       2️⃣ EJECUTAR ACCIÓN
    ========================== */

    if (!reply && eliActions[text]) {
      reply = executeAction(eliActions[text]);
    }

    /* =========================
       3️⃣ REGLAS → ACCIONES
    ========================== */

    if (!reply) {
      for (const rule of eliRules) {
        if (text.includes(rule.trigger)) {
          if (eliActions[rule.action.toLowerCase()]) {
            reply = executeAction(
              eliActions[rule.action.toLowerCase()]
            );
          } else {
            reply = rule.action;
          }
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
       5️⃣ IA (FUTURO)
    ========================== */

    if (!reply && eliConfig.mode === "ia" && eliConfig.ai?.enabled) {
      reply = "🤖 IA aún no conectada.";
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
