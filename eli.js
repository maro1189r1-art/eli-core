// eli-core/eli.js
// Núcleo lógico de ELI – control por modos

import config from "./eli-config.json" assert { type: "json" };

export function processMessage(input) {
  const text = input.toLowerCase().trim();
  const mode = config.mode;
  const responses = config.responses;

  // 🔒 Modo futuro bloqueado
  if (config.modes[mode]?.locked) {
    return "Este modo está bloqueado para evolución futura 🔒";
  }

  // 👀 Modo observador
  if (mode === "observador") {
    return `Mensaje recibido en modo observador: "${input}"`;
  }

  // 🧑‍💻 Modo manual (por defecto)
  if (responses[text]) {
    return responses[text];
  }

  return responses.default;
}
