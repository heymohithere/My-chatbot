let mode = "chat";

// Mode toggle
document.getElementById("chatMode").onclick = () => {
  mode = "chat";
  highlightMode();
};

document.getElementById("searchMode").onclick = () => {
  mode = "search";
  highlightMode();
};

function highlightMode() {
  const chatBtn = document.getElementById("chatMode");
  const searchBtn = document.getElementById("searchMode");

  if (mode === "chat") {
    chatBtn.className = "px-4 py-2 rounded-xl bg-emerald-500 text-white shadow";
    searchBtn.className = "px-4 py-2 rounded-xl bg-white/10 text-white border border-emerald-400/40";
  } else {
    searchBtn.className = "px-4 py-2 rounded-xl bg-emerald-500 text-white shadow";
    chatBtn.className = "px-4 py-2 rounded-xl bg-white/10 text-white border border-emerald-400/40";
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  if (mode === "chat") {
    showTypingIndicator("thinking");

    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    removeTypingIndicator();
    addMessage("bot", data.reply);
  }

  if (mode === "search") {
    showTypingIndicator("search");

    const res = await fetch("http://localhost:3001/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text })
    });

    const data = await res.json();
    removeTypingIndicator();

    if (data.results.length === 0) {
      addMessage("bot", "No results found.");
    } else {
      let resultText = "<b>🔍 Web Search Results</b><br><br>";
      data.results.forEach((r, i) => {
        resultText += `<b>${i + 1}. ${r.title}</b><br>${r.url}<br><br>`;
      });
      addMessage("bot", resultText);
    }
  }
}

// Messages
function addMessage(sender, text) {
  const area = document.getElementById("chatArea");

  const bubble = document.createElement("div");
  bubble.className =
    sender === "user"
      ? "chat-bubble user-bubble text-white p-3 rounded-xl ml-auto fade"
      : "chat-bubble bot-bubble text-white p-3 rounded-xl fade";

  bubble.innerHTML = text.replace(/\n/g, "<br>");
  area.appendChild(bubble);
  area.scrollTop = area.scrollHeight;
}

// Typing indicator
function showTypingIndicator(type) {
  const area = document.getElementById("chatArea");

  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className =
    "chat-bubble bot-bubble text-white p-3 rounded-xl fade flex items-center gap-2";

  indicator.innerHTML = `
    <span>${type === "search" ? "🔍 Searching" : "🤖 Thinking"}</span>
    <span class="typing">
      <span>.</span><span>.</span><span>.</span>
    </span>
  `;

  area.appendChild(indicator);
  area.scrollTop = area.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}
