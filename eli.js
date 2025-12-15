// ELI v2.1 - Núcleo con Tareas y Reglas Automáticas
// Prioridad:
// control → reglas → tareas → aprendizajes → comandos → respuestas → IA → default

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ELI iniciado v2.1");

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
    memory: { enabled: false, lastMessage: "" },
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

  const eliLearnings = JSON.parse(
    localStorage.getItem("eli_learnings") || "{}"
  );

  const eliTasks = JSON.parse(
    localStorage.getItem("eli_tasks") || "[]"
  );

  const eliRules = JSON.parse(
    localStorage.getItem("eli_rules") || "[]"
  );

  /* =========================
     IA (FUTURO)
  ========================== */

  async function askAI(message) {
    return "🤖 IA aún no conectada.";
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
       1️⃣ CONTROL
    ========================== */

    if (text === "estado") {
      reply =
        "🧠 Estado de ELI:\n" +
        `- Aprendizajes: ${Object.keys(eliLearnings).length}\n` +
        `- Tareas: ${eliTasks.length}\n` +
        `- Reglas: ${eliRules.length}`;
    }

    /* =========================
       2️⃣ REGLAS (CUANDO X → Y)
    ========================== */

    // Crear regla
    else if (text.startsWith("regla:")) {
      // Formato: regla: cuando diga X => Y
      const content = input.substring(6).trim();
      const parts = content.split("=>");

      if (parts.length === 2) {
        const trigger = parts[0].replace("cuando diga", "").trim().toLowerCase();
        const action = parts[1].trim();

        if (trigger && action) {
          eliRules.push({ trigger, action });
          localStorage.setItem("eli_rules", JSON.stringify(eliRules));
          reply = `📐 Regla creada: cuando diga "${trigger}" → responder "${action}"`;
        } else {
          reply = "La regla no puede estar vacía.";
        }
      } else {
        reply = "Formato: regla: cuando diga X => respuesta";
      }
    }

    // Ejecutar reglas
    if (!reply) {
      for (const rule of eliRules) {
        if (text.includes(rule.trigger)) {
          reply = rule.action;
          break;
        }
      }
    }

    /* =========================
       3️⃣ TAREAS
    ========================== */

    // Crear tarea
    if (!reply && text.startsWith("tarea:")) {
      const task = input.substring(6).trim();
      if (task) {
        eliTasks.push(task);
        localStorage.setItem("eli_tasks", JSON.stringify(eliTasks));
        reply = "📝 Tarea registrada.";
      } else {
        reply = "Escribe la tarea después de 'tarea:'";
      }
    }

    // Listar tareas
    else if (!reply && text === "tareas") {
      reply =
        eliTasks.length === 0
          ? "No hay tareas registradas."
          : "📋 Tareas:\n- " + eliTasks.join("\n- ");
    }

    /* =========================
       4️⃣ APRENDIZAJES
    ========================== */

    if (!reply) {
      for (const key in eliLearnings) {
        if (text.includes(key)) {
          reply = eliLearnings[key];
          break;
        }
      }
    }

    /* =========================
       5️⃣ RESPUESTAS CONFIG
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
       6️⃣ IA (FUTURO)
    ========================== */

    if (!reply && eliConfig.mode === "ia" && eliConfig.ai?.enabled) {
      reply = await askAI(input);
    }

    /* =========================
       7️⃣ DEFAULT
    ========================== */

    if (!reply) reply = eliConfig.responses?.default || "ELI activo";

    response.textContent = reply;
    inputElement.value = "";
  });
});

function openChat() {
  window.open("https://chat.openai.com/", "_blank");
}
