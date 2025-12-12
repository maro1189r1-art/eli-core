document.getElementById("eli-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = document.getElementById("eli-input").value;

  const response = await fetch("/api/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  });

  const data = await response.json();

  document.getElementById("eli-response").innerText = data.reply;
});
